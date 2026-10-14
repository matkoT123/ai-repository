# mToken SDK and related libraries

## How the four repos relate (most common misunderstanding)
| Repo | What it is |
|---|---|
| `jt-mfll-android` | Old MFLL `.aar` library for other apps (internet banking). Reference version of the old library. |
| `jt-mtoken-android` | The production mToken app. Does not use MFLL; has its own copy of the logic in `com.ace.factor`. See `jt-mtoken.md`. |
| `product-mtoken-sdk-android` | New SDK `com.mtoken:sdk`. Replaces MFLL and the app's own implementation. We own it and may change it. |
| `product-mtoken-android` | Test harness app over the new SDK, reference integration for every API. |
Also on disk: `365-mfll-android` (older fork of MFLL, not handled), `Projects/jmfll` (unrelated non-Android Maven project `com.asseco:jmfll`, out of scope; "jmfll"/"j-mfll" in the user's words means `jt-mfll-android`).

## product-mtoken-sdk-android
- Path `G:/nogames/asseco-android/aditCopyProjects/product-mtoken-sdk-android`; origin = Adit, `asseco` = `gitlab-prem.assecosk.local/sezam/mobile-development/android/product-mtoken-sdk-android`.
- Memory: `C:/Users/marti/.claude/projects/G--nogames-asseco-android-aditCopyProjects-product-mtoken-sdk-android/memory/` (save progress proactively when "nové SDK" work happens).
- Library module `:mtokensdk`, namespace `com.asseco.mtokensdk`, min SDK 23, Kotlin, Koin, Retrofit + Moshi (KSP), SpongyCastle, Play Integrity. Public surface: `MToken`, `MTokenResult`, `MTokenFailure`, referenced `domain.model` types. Errors never leave as raw exceptions. The repo CLAUDE.md describes the architecture.
- Version `sdkVersion` in `mtokensdk/gradle.properties`. Published to Nexus `sezam-releases` (credential-gated, not "public"); locally to mavenLocal for jt-mtoken.
- Build under JDK 17: `./gradlew :mtokensdk:compileDebugKotlin "-Dorg.gradle.java.home=C:/Program Files/Java/jdk-17"` (Kotlin `jvmTarget` is not set).
- Branches: `main`; `task/implementation` (Filip, active SDK work, all commits his, squash before Asseco); `feature/JTSRAUTH-7625-implemention` (user, typo in name).
- Blocker items `BLK-*` (OCRA import via `extended` flavor, `reconfigure()` TLS rotation, cert expiry, business errors, etc.) are listed in memory `task_implementation_branch.md`. BLK numbering is an older work list from the colleague (Filip) and jt-mtoken `claude-materials/`; there is no Confluence or official source.
- Gaps vs the app: app version check is not in the SDK; TLS certs are passed statically in `MTokenConfig` (rotation via `reconfigure()`); storage names differ except the identity key alias `CERT_ALIAS_PRIVATE_KEY`; migration of operation keys needs the PIN, so it runs at first login after update; root signals come from the app via `setFraudDetectionSystemData`.

### SDK documentation
- English. Positive framing (see `contexts/work/adit/rules/writing-sk.md`).
- Source of truth: KDoc in `.kt` + `mtokensdk/module.md`. `docs/guide.md` (entry point) and `docs/mtoken-sdk/` (API reference from `dokkaGfm`) are generated/static and must be regenerated and recommitted.
- Text lives in three places that must agree: `module.md`, `docs/guide.md`, `docs/mtoken-sdk/com.asseco.mtokensdk/index.md`.
- After `dokkaGfm`, strip `[androidJvm]` tags before committing. Generated files are CRLF; use line-oriented scripts.
- IDEA patches do not carry new files; check relative links after applying (ignore first-line breadcrumbs).
- Do not reintroduce: optional articles Asseco rejected, endpoint names, a "Mastercard 3DS" section, invented payload fields like `child("amount")`.
- Patch handling: throwaway worktree > `git apply --check` > apply > verify > real tree.

## product-mtoken-android (test harness)
- Path `G:/nogames/asseco-android/aditCopyProjects/product-mtoken-android`; origin = Adit, `asseco` = `gitlab-prem.asseco-ce.com/sezam/mobile-development/android/product-mtoken-android`. Memory: `...-aditCopyProjects-product-mtoken-android/memory/`. Repo CLAUDE.md (gitignored) has stack, MVI convention, flavors.
- Debug screens with raw output are the purpose; do not polish them into production UX.
- 6 flavors: `jtcz`/`jtsr` x `ItpA`/`ItpB`/`Uat`. No tests; verify by building the affected flavor. TLS refresh: `python scripts/refresh_trust_stores.py`.
- Work arrives as IntelliJ patches in `claude-materials/patch-NN/`; apply, build, show diff, wait.
- `main` commit `c8d0c10` uses `Message.privateSubject/privateBody`, which SDK `3.0.8-debug` does not expose; `main` does not compile until a new SDK is published. Do not revert without asking.

## jt-mfll-android (old library, reference)
- Path `G:/nogames/asseco-android/aditCopyProjects/jt-mfll-android`, origin = Adit only. Memory: `...-aditCopyProjects-jt-mfll-android/memory/`.
- Reference for the SDK migration chapter. Error codes differ from 365-mfll (12, 13, 14, 70, 209; captcha replaced by integrity check in commit `3936035`). Only `GEORGE_NOT_ACCESSIBLE(28)` is commented out in `Status.java`.
- JTSRAUTH-7554 migration bug is not fixed here (`registerStatus()`, `SrvInitLibrary`); proposed fix in memory, not applied.
- Logging: logcat (gated by `logLevel`) and online logging to `mtoken/v2/log` (gated by `logContentType`) are independent. `Logger.logToConsole` WARN falls through to ERROR.

## 365-mfll-android
`G:/nogames/asseco-android/Projects/365-mfll-android`, origin = Asseco, `adit`. Fork of MFLL. Key storage: client cert/key in BKS files encrypted with PIN + server keystoreKey, IS key in AndroidKeyStore.
