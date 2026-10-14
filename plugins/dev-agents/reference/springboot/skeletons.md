# Greenfield skeletons

Use only in greenfield / no-local-style mode. In an existing project copy its neighbours instead.

## Controller

```java
@RestController
@RequestMapping("/savings-item")
@RequiredArgsConstructor
@Tag(name = "Savings items")
public class SavingsItemController {

    private final SavingsItemService savingsItemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SavingsItemResponse create(@Valid @RequestBody SavingsItemCreateRequest request) {
        return savingsItemService.create(request);
    }

    @GetMapping("/{id}")
    public SavingsItemResponse get(@PathVariable UUID id) {
        return savingsItemService.get(id);
    }

    @PatchMapping("/{id}")
    public SavingsItemResponse patch(@PathVariable UUID id, @Valid @RequestBody SavingsItemPatchRequest request) {
        return savingsItemService.patch(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        savingsItemService.delete(id);
    }
}
```

## Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class SavingsItemService {

    private final SavingsItemRepository savingsItemRepository;
    private final SavingsItemMapper savingsItemMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public SavingsItemResponse get(UUID id) {
        return savingsItemMapper.toResponse(loadOwned(id));
    }

    @Transactional
    public SavingsItemResponse patch(UUID id, SavingsItemPatchRequest request) {
        var item = loadOwned(id);
        savingsItemMapper.patch(item, request);
        log.info("Savings item {} updated", id);
        return savingsItemMapper.toResponse(item);
    }

    private SavingsItem loadOwned(UUID id) {
        var item = savingsItemRepository.findById(id)
                .orElseThrow(() -> new SavingsItemNotFoundException(id));
        currentUserService.verifyOwnership(item.getOwner().getId(), () -> new SavingsItemNotFoundException(id));
        return item;
    }
}
```

## DTOs and mapper

```java
@Data
@NoArgsConstructor
public class SavingsItemCreateRequest {
    @NotBlank @Size(max = 100)
    private String name;
    @NotNull @DecimalMin("0.00") @Digits(integer = 17, fraction = 2)
    private BigDecimal amount;
}

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SavingsItemMapper {
    SavingsItemResponse toResponse(SavingsItem entity);
    void patch(@MappingTarget SavingsItem entity, SavingsItemPatchRequest request);
}
```

## Exception core

```java
@Getter
@RequiredArgsConstructor
public enum Error {
    BAD_REQUEST("invalid-request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("not-authenticated", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("access-denied", HttpStatus.FORBIDDEN),
    NOT_FOUND("resource-not-found", HttpStatus.NOT_FOUND),
    CONFLICT("conflict", HttpStatus.CONFLICT),
    INTERNAL_SERVER_ERROR("internal-error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final HttpStatus status;
}

@Getter
public class AppException extends RuntimeException {
    private final Error error;
    private final String messageCode;
    private final transient Object[] args;

    protected AppException(Error error, String defaultMessage, String messageCode, Object... args) {
        super(defaultMessage);
        this.error = error;
        this.messageCode = messageCode;
        this.args = args;
    }
}

public abstract class EntityNotFoundException extends AppException {
    protected EntityNotFoundException(Class<?> entityClass, Serializable id) {
        super(Error.NOT_FOUND, entityClass.getSimpleName() + " " + id + " not found", "resource-not-found", id);
    }
}

public class SavingsItemNotFoundException extends EntityNotFoundException {
    public SavingsItemNotFoundException(UUID id) {
        super(SavingsItem.class, id);
    }
}
```

Advice: one `@RestControllerAdvice` mapping `AppException`, `MethodArgumentNotValidException` (400 + `fields`), `HttpMessageNotReadableException` (400, details only at debug), `NoResourceFoundException` (404), `Exception` (500, `log.error` with stack, generic message). Body `{"error", "message"}`.

## Current user

```java
@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    public User getCurrentUser() {
        var keycloakId = SecurityUtils.getCurrentKeycloakId(); // JWT "sub"
        return userRepository.findByKeycloakIdAndDeletedFalse(keycloakId)
                .orElseThrow(UserNotAuthenticatedException::new);
    }

    public UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public void verifyOwnership(UUID ownerId, Supplier<? extends RuntimeException> notFound) {
        if (!getCurrentUserId().equals(ownerId)) {
            throw notFound.get();
        }
    }
}
```

## Security config (Keycloak resource server)

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
                        .requestMatchers("/registration/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(keycloakRoleConverter())))
                .build();
    }
    // keycloakRoleConverter(): map realm_access.roles and resource_access.<client>.roles to ROLE_*
}
```

`spring.security.oauth2.resourceserver.jwt.issuer-uri: ${KEYCLOAK_ISSUER_URI}` - from env, never hardcoded per environment.

## Internal endpoint guard and outbound service token

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class InternalAccessGuard {
    @Value("${keycloak.service-client.client-id}")
    private String serviceClientId;

    public void requireServiceClient() {
        var azp = SecurityUtils.getCurrentClientId(); // JWT "azp"
        if (!serviceClientId.equals(azp)) {
            log.warn("Rejected internal call from client {}", azp);
            throw new InternalAccessDeniedException();
        }
    }
}
```

Outbound: client-credentials token provider (Keycloak admin client `tokenManager()` or a small form-POST provider), cached until ~30 s before expiry, sent as `Authorization: Bearer`. Client classes document what happens when the target service is down (fail-open vs fail-closed).

## Async

```java
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {
    @Bean("auditExecutor")
    Executor auditExecutor() {
        var executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("audit-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
```

The `@Async("auditExecutor")` method lives in its own bean, called from a facade.

## Config properties with kill switch

```java
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "ads")
public class AdRewardProperties {
    /** Master switch; feature is off until explicitly enabled per environment. */
    private boolean enabled = false;
    private Duration nonceTtl = Duration.ofMinutes(10);
}
```

## Migration

`src/main/resources/db/migration/V7__savings_item_currency.sql`

```sql
ALTER TABLE savings_item ADD COLUMN currency varchar(3);
UPDATE savings_item SET currency = 'EUR' WHERE currency IS NULL;
ALTER TABLE savings_item ALTER COLUMN currency SET NOT NULL;

ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_type_check;
ALTER TABLE notification ADD CONSTRAINT notification_type_check
    CHECK (type IN ('WELCOME', 'MONTHLY_REVIEW', 'SYSTEM_ALERT'));
```

## Dockerfile

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml lombok.config ./
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre
RUN useradd -r -u 1001 app
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
