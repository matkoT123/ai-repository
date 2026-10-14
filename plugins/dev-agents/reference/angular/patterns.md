# Angular greenfield skeletons (Angular 19+)

Use only when the project has no precedent. In an existing project copy the neighbouring file instead.

## app.config.ts

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // stable from 20.2; on 19 keep provideZoneChangeDetection({ eventCoalescing: true })
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
  ],
};
```

## Presentational component

```ts
@Component({
  selector: 'app-order-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './order-card.component.html',
  host: { class: 'block' },
})
export class OrderCardComponent {
  readonly order = input.required<OrderResponse>();
  readonly compact = input(false);
  readonly selected = output<string>();

  protected readonly isOverdue = computed(() => new Date(this.order().dueDate) < new Date());
}
```

```html
<article class="rounded-xl p-4" [class.opacity-60]="order().status === 'CANCELLED'">
  <h3>{{ order().title }}</h3>
  @if (isOverdue()) {
    <span class="text-[var(--color-error)]">{{ 'ORDER.OVERDUE' | translate }}</span>
  }
  <button type="button" (click)="selected.emit(order().id)" [attr.aria-label]="'ORDER.OPEN' | translate">
    <i class="ph ph-arrow-right" aria-hidden="true"></i>
  </button>
</article>
```

## Container component with UI state

```ts
type ViewState<T> =
  | { status: 'loading' }
  | { status: 'error'; messageKey: string }
  | { status: 'ok'; data: T };

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderCardComponent, TranslatePipe],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private readonly api = inject(OrderApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<ViewState<OrderResponse[]>>({ status: 'loading' });
  protected readonly query = signal('');

  constructor() {
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.state.set({ status: 'loading' })),
      switchMap(q => this.api.list(q).pipe(
        map(data => ({ status: 'ok', data }) as const),
        catchError(() => of({ status: 'error', messageKey: 'ORDER.LOAD_FAILED' } as const)),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(s => this.state.set(s));
  }
}
```

```html
@let s = state();
@switch (s.status) {
  @case ('loading') { <app-skeleton /> }
  @case ('error') { <p role="alert">{{ s.messageKey | translate }}</p> }
  @case ('ok') {
    @for (o of s.data; track o.id) {
      <app-order-card [order]="o" (selected)="open($event)" />
    } @empty {
      <p>{{ 'ORDER.EMPTY' | translate }}</p>
    }
  }
}
```

## Request-driven loading with resource (when the version allows)

```ts
readonly id = input.required<string>();            // from route via withComponentInputBinding
protected readonly order = httpResource<OrderResponse>(() => `${environment.apiUrl}/order/${this.id()}`);
// template: order.isLoading(), order.error(), order.value()
```

## API service

```ts
@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/order`;

  list(query: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.base, { params: { q: query } });
  }

  create(request: OrderCreateRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.base, request);
  }
}
```

## Signal store (feature scoped)

```ts
@Injectable() // provided in the feature route: providers: [CartStore]
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.price * i.qty, 0));

  add(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }
}
```

## Functional guard and interceptor

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  return auth.isLoggedIn() ? true : inject(Router).parseUrl('/login');
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl) || !isPlatformBrowser(inject(PLATFORM_ID))) {
    return next(req);
  }
  const token = inject(AuthStateService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
```

## Typed reactive form

```ts
private readonly fb = inject(NonNullableFormBuilder);

protected readonly form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  amount: [0, [Validators.required, Validators.min(1)]],
});

private readonly submit$ = new Subject<void>();

constructor() {
  this.submit$.pipe(
    filter(() => this.form.valid),
    exhaustMap(() => this.api.create(this.form.getRawValue())),
    takeUntilDestroyed(),
  ).subscribe(/* success + error handling */);
}

protected submit(): void {
  this.form.markAllAsTouched();
  this.submit$.next();
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <label for="email">{{ 'FORM.EMAIL' | translate }}</label>
  <input id="email" type="email" formControlName="email"
         [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched"
         aria-describedby="email-err" />
  @if (form.controls.email.touched && form.controls.email.hasError('email')) {
    <p id="email-err" class="text-[var(--color-error)]">{{ 'FORM.EMAIL_INVALID' | translate }}</p>
  }
  <button type="submit">{{ 'FORM.SAVE' | translate }}</button>
</form>
```

## SSR-safe browser access

```ts
private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

readValue(key: string): string | null {
  return this.isBrowser ? localStorage.getItem(key) : null;
}

constructor() {
  afterNextRender(() => this.chart = new Chart(this.canvas().nativeElement, this.config()));
}
```

## Specs

```ts
// pure function (preferred, fast)
describe('evaluateQuota', () => {
  it('blocks when the plan is exhausted', () => {
    expect(evaluateQuota(baseQuota({ planRemaining: 0 }), now)).toEqual({ reason: 'daily-limit-reached' });
  });
});

// service with HTTP
beforeEach(() => TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
}));
it('posts create request', () => {
  const api = TestBed.inject(OrderApiService);
  const http = TestBed.inject(HttpTestingController);
  api.create(request).subscribe(res => expect(res.id).toBe('1'));
  http.expectOne({ method: 'POST', url: `${environment.apiUrl}/order` }).flush({ id: '1' });
  http.verify();
});

// component input
fixture.componentRef.setInput('order', mockOrder);
fixture.detectChanges();
```
