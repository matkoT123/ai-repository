# secrets (local only)

Everything in this folder except this README and `*.template` files is gitignored.

Rules:
- Claude never copies values from here into chat, memory, commits, docs or other files.
- Context files reference a secret by file and key name only, e.g. `secrets/work.env: VSZP_TEST_USER`.
- Real secrets belong to a password manager (Passwork for Asseco). This folder holds only test-environment values needed for daily work.

Files:
- `work.env` - Asseco/Adit test accounts, PINs, SMS codes (see `work.env.template`)
- `personal.env` - Balansee and other personal test values (see `personal.env.template`)
