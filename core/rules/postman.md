# Postman

Only when explicitly asked. Never automatically.

## "generate postman api"
1. Create a Postman workspace named after the project (if missing).
2. Scan all controllers: method, path, body, path variables, query params.
3. Create collection `<ProjectName> API` in that workspace.
4. Real Postman folders per controller or domain (Auth, Profile, ...). Never `[Group]` prefixes in request names.
5. Collection-level Bearer auth with `{{access_token}}`.
6. Collection variable `baseUrl` with the default server URL.
7. Pre-fill bodies with example values from the request classes.
8. Public endpoints get a `No Auth` override.

## "update postman api"
- Find the existing workspace and collection, rescan controllers, diff.
- Add new, update changed, remove deleted endpoints. Keep the folder structure. Never recreate from scratch.

## Auth
- JWT/Keycloak: collection Bearer `{{access_token}}` plus a token-fetch request.
- No security config: collection auth `No Auth`.
- Unsure: check the security configuration first.
