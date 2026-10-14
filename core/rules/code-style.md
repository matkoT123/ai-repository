# Code style (defaults)

Defaults for code the user owns. An existing project's own conventions win (see `workflow.md`).

## General
- Explicit, readable code over clever one-liners.
- Short methods with a single responsibility.
- Comments only when the WHY is non-obvious.

## Java
- `var` for locals where the type is clear.
- No Java records. Use classes with Lombok (`@Data`, `@Builder`, `@RequiredArgsConstructor`, `@Getter`/`@Setter`).
- Dedicated request/response classes for data transfer.
- Exception: a project that already uses records and no Lombok keeps doing so.
