# Greenfield Android skeletons

Use only in greenfield / no-local-style mode. In an existing project copy its base classes and neighbours.

## MVI base

```kotlin
abstract class MviViewModel<S : Any, I : Any, E : Any>(initialState: S) : ViewModel() {

    private val _state = MutableStateFlow(initialState)
    val state: StateFlow<S> = _state.asStateFlow()

    private val _effects = Channel<E>(Channel.BUFFERED)
    val effects: Flow<E> = _effects.receiveAsFlow()

    private val intents = Channel<I>(Channel.UNLIMITED)

    init {
        viewModelScope.launch {
            for (intent in intents) handleIntent(intent)
        }
    }

    fun onIntent(intent: I) {
        intents.trySend(intent)
    }

    protected abstract suspend fun handleIntent(intent: I)

    protected fun setState(reducer: S.() -> S) = _state.update { it.reducer() }

    protected fun sendEffect(effect: E) {
        _effects.trySend(effect)
    }
}
```

Intents are processed sequentially (no races). Long-running work inside `handleIntent` should `launch` its own job so it does not block later intents; cancel the previous job when a newer intent supersedes it.

## Contract, ViewModel, Screen

```kotlin
object CardsContract {
    data class State(
        val isLoading: Boolean = false,
        val cards: List<CardUi> = emptyList(),
        val error: UiError? = null,
    )

    sealed interface Intent {
        data object Load : Intent
        data class Open(val id: String) : Intent
    }

    sealed interface Effect {
        data class NavigateToDetail(val id: String) : Effect
    }
}

@HiltViewModel
class CardsViewModel @Inject constructor(
    private val getCards: GetCardsUseCase,
) : MviViewModel<State, Intent, Effect>(State()) {

    override suspend fun handleIntent(intent: Intent) {
        when (intent) {
            Intent.Load -> load()
            is Intent.Open -> sendEffect(Effect.NavigateToDetail(intent.id))
        }
    }

    private suspend fun load() {
        setState { copy(isLoading = true, error = null) }
        when (val result = getCards()) {
            is Result.Success -> setState { copy(isLoading = false, cards = result.data.map { it.toUi() }) }
            is Result.Failure -> setState { copy(isLoading = false, error = result.failure.toUiError()) }
        }
    }
}

@Composable
fun CardsRoute(onNavigate: (String) -> Unit, viewModel: CardsViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(viewModel, lifecycleOwner) {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            viewModel.effects.collect { effect ->
                when (effect) {
                    is Effect.NavigateToDetail -> onNavigate(effect.id)
                }
            }
        }
    }
    CardsScreen(state = state, onIntent = viewModel::onIntent)
}

@Composable
fun CardsScreen(state: State, onIntent: (Intent) -> Unit, modifier: Modifier = Modifier) { /* stateless UI */ }
```

## Result and failures

```kotlin
sealed interface Result<out T> {
    data class Success<T>(val data: T) : Result<T>
    data class Failure(val failure: AppFailure) : Result<Nothing>
}

sealed interface AppFailure {
    data object Connection : AppFailure
    data class Http(val code: Int, val errorCode: String?) : AppFailure
    data class Business(val code: String) : AppFailure
    data class Unexpected(val cause: Throwable) : AppFailure
}

suspend fun <T> safeApiCall(block: suspend () -> T): Result<T> =
    try {
        Result.Success(block())
    } catch (e: CancellationException) {
        throw e
    } catch (e: IOException) {
        Result.Failure(AppFailure.Connection)
    } catch (e: HttpException) {
        Result.Failure(AppFailure.Http(e.code(), parseErrorCode(e)))
    } catch (e: Exception) {
        Result.Failure(AppFailure.Unexpected(e))
    }
```

## Use case and repository

```kotlin
class GetCardsUseCase @Inject constructor(private val repository: CardsRepository) {
    suspend operator fun invoke(): Result<List<Card>> = repository.getCards()
}

internal class CardsRepositoryImpl @Inject constructor(
    private val api: CardsApi,
    private val dispatchers: AppDispatchers,
) : CardsRepository {
    override suspend fun getCards(): Result<List<Card>> = withContext(dispatchers.io) {
        safeApiCall { api.getCards().items.orEmpty().mapNotNull { it.toDomainOrNull() } }
    }
}

interface AppDispatchers {
    val io: CoroutineDispatcher
    val default: CoroutineDispatcher
    val main: CoroutineDispatcher
}
```

## Token refresh authenticator

```kotlin
class TokenAuthenticator @Inject constructor(
    private val tokenStore: TokenStore,
    private val refresher: Lazy<TokenRefresher>,
) : Authenticator {

    private val mutex = Mutex()

    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.priorResponse != null) return null // already retried once
        val failedToken = response.request.header("Authorization")?.removePrefix("Bearer ")
        val newToken = runBlocking {
            withTimeoutOrNull(15_000) {
                mutex.withLock {
                    val current = tokenStore.accessToken()
                    if (current != null && current != failedToken) current
                    else refresher.get().refresh() // null on failure > logout handled there
                }
            }
        } ?: return null
        return response.request.newBuilder().header("Authorization", "Bearer $newToken").build()
    }
}
```

## OkHttp with pinning

```kotlin
val pinner = CertificatePinner.Builder()
    .add(config.host, config.currentPin, config.nextPin) // sha256/... from config, not hardcoded per env
    .build()

OkHttpClient.Builder()
    .certificatePinner(pinner)
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .addInterceptor(authInterceptor)
    .authenticator(tokenAuthenticator)
    .apply { if (BuildConfig.DEBUG) addInterceptor(HttpLoggingInterceptor().setLevel(BODY)) }
    .build()
```

## ViewModel test

```kotlin
@Test
fun `load success updates cards`() = runTest {
    Dispatchers.setMain(StandardTestDispatcher(testScheduler))
    coEvery { getCards() } returns Result.Success(listOf(card))
    val vm = CardsViewModel(getCards)

    vm.state.test {
        assertThat(awaitItem().cards).isEmpty()
        vm.onIntent(Intent.Load)
        assertThat(awaitItem().isLoading).isTrue()
        assertThat(awaitItem().cards).hasSize(1)
    }
}
```

## Gradle (release block, KTS)

```kotlin
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release") // values from env / local.properties
        }
    }
}
kotlin { jvmToolchain(17) }
```
