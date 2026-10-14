# EntityRepository / ListRequest pattern

House pattern for filtered, sorted, paged lists. Exists as the shared `common` library in A Consulting modules (reuse it there) and as a vendored copy in Balansee and ProfesionalsBE. Describe and reuse the concept; in a project that already has it, use its classes, never write a parallel one.

## Shape

- `EntityRepository<T, I>`: `@NoRepositoryBean`, extends `ListCrudRepository<T, I>` and `JpaSpecificationExecutor<T>`. All repositories extend it and add derived queries as needed.
  - Default Specification builders: `byId`, `byIds`, `byCode`, `notDeleted`, `notDeletedById`, ...
  - Default finders: `findByIdNotDeleted`, `existsByCodeNotDeleted`, ...
  - `fromFilters(filters, request)` > `Specification<T>`: supports dotted join paths (`profile.user.id`), auto-adds `notDeleted` when the entity has a `deleted` field, fulltext fields compared as `LOWER(UNACCENT(...))`.
  - `fromSorts(sorts, request)` > `PageRequest`: default `createdAt DESC` when the field exists; localized sorts join a translation map by locale (custom repository base class overriding `getQuery`).
  - `fetchEntity(key, finder, exceptionSupplier)` helpers.
- `ListRequest` (`@Data @NoArgsConstructor @SuperBuilder`): `pageIdx` (default 0, `@Min(0)`), `pageSize` (default 20, `@Max(200)`), `languageCode`, nested `Filter{property, value, operator, cast}` and `Sort{property, direction, locale}`. Operators: `EQ, LIKE, LT, GT, LTE, GTE, IN`; cast `DATE` optional. Field initializers need `@Builder.Default`.
- Per entity: `XxxListRequest extends ListRequest` declaring
  `List<@Valid @EntityField(acceptedValues = {"name", "createdAt", ...}) Filter> filters` and `sorts`, plus `@UUIDFormat(properties = {"id"})` etc., overriding `patchPropertyValue` to convert string values to the field type. The whitelist is the security boundary - never allow arbitrary property paths.

## Usage

```java
@PostMapping("/list")
public Page<ExpenseListResponse> list(@Valid @RequestBody ExpenseListRequest request) {
    return expenseService.list(request);
}
```

```java
@Transactional(readOnly = true)
public Page<ExpenseListResponse> list(ExpenseListRequest request) {
    var userId = currentUserService.getCurrentUserId();
    Specification<Expense> ownScope = (root, q, cb) -> cb.equal(root.get("owner").get("id"), userId);
    var spec = expenseRepository.fromFilters(request.getFilters(), request).and(ownScope);
    var page = expenseRepository.fromSorts(request.getSorts(), request);
    return expenseRepository.findAll(spec, page).map(expenseMapper::toListResponse);
}
```

## Rules

- Always AND a current-user (or tenant) scope onto `fromFilters` for user-owned data.
- Keep `pageSize` bounded; validate filters with the whitelist annotations.
- Greenfield without the library: either vendor a trimmed copy (as ProfesionalsBE did) or use plain `Pageable` + explicit Specifications; do not invent a third variant.
