# Vendy

Backend for vending machines: users and profiles, machines, products with ingredients and allergens. Package `sk.idops.vendy`, artifact `vendy-server`.

## Copies on disk
| Copy | Path | Git | Java files | Newest file |
|---|---|---|---|---|
| VendyBE | `D:/ARUPROJECT/VENDY/VendyBE` | `github.com/ARULIFE/VendyBE`, last commit 2025-10-08 | 161 | 2025-10-09 |
| vendy-main | `D:/ARUPROJECT/vendy-main` (zip extract, also `vendy-main (3).zip`) | none; README points to `gitlab.com/kilam9/vendy` (original author's GitLab, not a push target) | 96 (server) | 2025-10-09 |
| vendy-server-martins-version | `D:/ARUPROJECT/vendy-server-martins-version` | none | 124 | 2025-09-18 |

vendy-main also contains `rest-vendy-api` (shared API module, Maven dependency `sk.idops.vendy:rest-vendy-api`) and `vendy-client` (Angular 19).

**Proposed canonical: `VendyBE`.** It is the only git-tracked copy on a personal remote, has the most code, and its commits (task `86c5w8rp3`) refactor the older code and pull the allergen DTOs from the external module into the project. Treat `vendy-server-martins-version` as the pre-git snapshot it was seeded from, and `vendy-main` as the original upstream reference (and the only source of the Angular client). Do not edit the two non-git copies.

## Stack (VendyBE)
- Spring Boot 3.3.3, Java 21, Data JPA + JDBC + Data REST, Security, Mail, Web Services, MapStruct.
- MariaDB with migrations in `src/main/resources/db.mariadb.migration`.
- Local DB: `develop/docker/docker-compose.yml`.
- Entities: VendyUser, UserProfile, ProfileAddress, VendyMachine, VendyMachineProduct, Product, Ingredient, ProductIngredient, Allergen.

## Status
Dormant since 2025-10. 4 commits by the user on top of the ARULIFE initial commit.

## Security notes
- Credential values committed in `VendyBE/src/main/resources/application.yml` and `VendyBE/develop/docker/docker-compose.yml`.
- Same kind of values in `vendy-main/vendy-server/src/main/resources/application.yml` and `vendy-server-martins-version/src/main/resources/application.yml`.
