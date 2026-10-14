# Architecture

- Controllers stay thin: parse the request, call a service, return the response.
- No business logic in controllers: no repository calls, no entity state checks, no data transformation.
- Logic needed by a fix or feature goes into an existing or new service method that the controller calls.
- The current user comes from the security context (a current-user service), never from a path or body parameter.
