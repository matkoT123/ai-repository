# React / Next.js greenfield skeletons (Next 15/16, React 19)

Use only when the project has no precedent. Verify cache API names against the installed Next version.

## Layout

```
app/
  layout.tsx            html lang, fonts, providers (thin client wrapper only)
  (public)/page.tsx
  orders/
    page.tsx            server: fetch + render
    loading.tsx
    error.tsx           "use client"
    [id]/page.tsx
    actions.ts          "use server"
  api/webhooks/x/route.ts
components/ui/          primitives (Button, Input, Dialog)
components/<feature>/
lib/data/               server data functions ("server-only")
lib/validation/         zod schemas shared by action + form
lib/utils.ts            cn()
types/
```

## Server page with parallel data and streaming

```tsx
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrder(id);
  return { title: order ? `Order ${order.number}` : "Order not found" };
}

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ id }, { tab = "detail" }] = await Promise.all([params, searchParams]);
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <section aria-labelledby="order-title">
      <h1 id="order-title">{order.number}</h1>
      <Suspense fallback={<HistorySkeleton />}>
        <OrderHistory orderId={id} />
      </Suspense>
      <OrderTabs active={tab} />
    </section>
  );
}
```

## Server data function

```ts
import "server-only";
import { cache } from "react";

export const getOrder = cache(async (id: string): Promise<Order | null> => {
  const res = await fetch(`${process.env.API_URL}/order/${id}`, {
    headers: await authHeaders(),
    next: { tags: [`order:${id}`], revalidate: 60 }, // or "use cache" + cacheTag() with cacheComponents
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Order fetch failed: ${res.status}`);
  return OrderSchema.parse(await res.json());
});
```

## Server action with zod and typed result

```ts
"use server";

export type ActionState =
  | { ok: true; message: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string[]> }
  | null;

export async function updateOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();                 // actions are public endpoints
  const parsed = OrderUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const res = await apiPatch(`/order/${parsed.data.id}`, parsed.data, user);
  if (!res.ok) return { ok: false, message: "Uloženie zlyhalo" };

  revalidateTag(`order:${parsed.data.id}`);         // check signature for the installed Next major
  return { ok: true, message: "Uložené" };
}
```

## Client form with useActionState

```tsx
"use client";

export function OrderForm({ order }: { order: Order }) {
  const [state, action, pending] = useActionState(updateOrder, null);
  const err = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} noValidate>
      <input type="hidden" name="id" value={order.id} />
      <label htmlFor="note">Poznámka</label>
      <textarea id="note" name="note" defaultValue={order.note}
        aria-invalid={!!err?.note} aria-describedby={err?.note ? "note-err" : undefined} />
      {err?.note && <p id="note-err" className="text-danger">{err.note[0]}</p>}
      <button type="submit" disabled={pending}>{pending ? "Ukladám..." : "Uložiť"}</button>
      <p aria-live="polite">{state?.ok ? state.message : state?.message}</p>
    </form>
  );
}
```

## Client island fed by the server

```tsx
// server page
<FilterBar initialCity={city} cities={cities} />

// components/home/FilterBar.tsx
"use client";
export default function FilterBar({ initialCity, cities }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setCity(city: string) {
    const params = new URLSearchParams(searchParams);
    params.set("city", city);
    router.replace(`${pathname}?${params}`, { scroll: false });
  }
  /* ... */
}
```

## Error boundary

```tsx
"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert">
      <p>Nastala chyba.</p>
      <button type="button" onClick={reset}>Skúsiť znova</button>
    </div>
  );
}
```

## UI primitive

```tsx
const variants = {
  primary: "bg-accent text-black hover:bg-accent-hover",
  secondary: "border border-white/20 hover:bg-white/10",
} as const;

type Props = React.ComponentProps<"button"> & { variant?: keyof typeof variants };

export function Button({ variant = "primary", className, type = "button", ...props }: Props) {
  return <button type={type} className={cn("inline-flex items-center rounded-xl px-5 py-2 text-sm", variants[variant], className)} {...props} />;
}
```

No `"use client"` needed on a primitive that only forwards handlers; the importing client component makes it client.

## Tailwind 4 tokens

```css
@import "tailwindcss";

@theme {
  --color-bg: rgb(14 14 17);
  --color-surface: rgb(21 21 26);
  --color-accent: rgb(142 44 69);
  --color-accent-hover: rgb(169 58 87);
  --font-heading: var(--font-cormorant);
}
```

Then `bg-surface`, `text-accent`, `font-heading` instead of `bg-[rgb(var(--bg-surface))]`.

## External store subscription (instead of effect + custom event)

```ts
export function useSession() {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
// getSession must return a cached/stable value between changes, not a fresh object per call.
```

## Tests

```tsx
// Vitest + RTL
it("shows a field error", async () => {
  render(<SignupForm />);
  await userEvent.click(screen.getByRole("button", { name: /registrovať/i }));
  expect(await screen.findByText(/email je povinný/i)).toBeInTheDocument();
});

// Playwright
test("login redirects to editor", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Heslo").fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "Prihlásiť" }).click();
  await expect(page).toHaveURL(/\/dashboard\/edit/);
});
```
