# Asseco build environment

Machine basics (JDK 17 for Android, `gradlew --stop`, no jq): `core/rules/environment.md`. Generic Android tooling: `plugins/dev-agents/agents/android.md`.

When a build fails before compiling any code, check these in order before suspecting the code.

## 1. VPN
`nexus`, `gitlab`, `gitlab-prem.*` and test backends resolve only on the Asseco VPN. Exceptions: Adit hosts and VSZP HLT envs (`hlt-*.asseco-ce.com`, published externally).

## 2. Asseco Root CA
The JDK does not trust `Asseco Central Europe Root CA` > `PKIX path building failed`. Either import it into the JDK 17 `cacerts`, or pass `-Djavax.net.ssl.trustStore=<cacerts copy with the CA> -Djavax.net.ssl.trustStorePassword=<store password>` to Gradle.

## 3. Nexus credentials
Two naming schemes, both read from env or `local.properties`:
| Projects | Env vars | local.properties |
|---|---|---|
| VSZP | `NEXUS_USER`, `NEXUS_PASSWORD` | none; without env: "Username must not be null!" |
| mToken SDK, product-mtoken-android, SEZAM | `NEXUS_USERNAME`, `NEXUS_PASSWORD` | `nexus.user`, `nexus.password` |
`settings.gradle` in the SEZAM repos resolves user and password independently. On this machine only `NEXUS_PASSWORD` is set in the environment and it differs from `local.properties`, so the build mixes them and Nexus returns 401. Run with both env vars unset (or both set). Values: `secrets/work.env: NEXUS_USER, NEXUS_PASSWORD`.

VSZP keeps its two Nexus repos commented out in `settings.gradle.kts`; uncomment locally only when building against internal artifacts, never commit (see `projects/vszp.md`).

## 4. JDK 17
`JAVA_HOME` defaults to JDK 21. Kotlin follows it while Java targets 17 > "Inconsistent JVM-target compatibility". Use `JAVA_HOME="C:\Program Files\Java\jdk-17"` or `-Dorg.gradle.java.home="C:/Program Files/Java/jdk-17"`. Android Studio uses its embedded 17 and is not affected.

## 5. SDK from mavenLocal
jt-mtoken consumes the new SDK as `com.mtoken:sdk:3.0.8` from `mavenLocal()`. After every SDK change: `gradlew publishReleasePublicationToMavenLocal publishDebugPublicationToMavenLocal` in the SDK repo (JDK 17), otherwise the app does not see it.

## Test devices
- Pixel 10a: current work test phone (TalkBack, GMS). Pixel 9a was the recommended purchase for accessibility tests.
- Xiaomi Redmi (user's own): cross-check on a vendor skin; needs OpenVPN for Asseco envs.
- IDEMIA tablet MPH-MB003A: no GMS, TalkBack crashes. Not usable for accessibility tests.
- AVD `Pixel_9_Pro` (API 36) matches VSZP target SDK.
