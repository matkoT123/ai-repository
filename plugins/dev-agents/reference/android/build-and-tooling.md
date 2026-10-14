# Android build and tooling (Windows)

## Build failures before compile - check in this order

1. VPN (internal Maven/Nexus host does not resolve without it).
2. Corporate root CA missing in the JDK truststore > `PKIX path building failed`. Import into that JDK's `cacerts` or pass `-Djavax.net.ssl.trustStore=...`.
3. Repo credentials mixed from two sources (one from env var, other from `local.properties`) > 401. Missing credential env var shows as "Username must not be null!".
4. JDK: `JAVA_HOME` 21 > Java targets 17, Kotlin picks 21 > "Inconsistent JVM-target compatibility". Per call: `JAVA_HOME="C:\Program Files\Java\jdk-17" ./gradlew ...`. Root fix: `kotlin { jvmToolchain(17) }` / matching `jvmTarget`. Android Studio's embedded JDK 17 hides the problem.
5. Aborted build > daemon holds `classes.jar` > "file is being used by another process". `./gradlew --stop`.

## Dependency upgrades

- Transitive bumps can change UI. Real case: appcompat 1.6.1 > 1.7.1 under forced edge-to-edge (targetSdk 35+) stopped padding content under the action bar (content 147 px under the bar on every screen). Fix: inset listener on `android.R.id.content` in the base activity. Diagnose by forcing the old version via a Gradle init script, without touching the repo.
- OEM skins behave differently with edge-to-edge (Huawei); test on real devices.
- `./gradlew :app:dependencies --configuration releaseRuntimeClasspath` to see what actually ships.

## versionCode and releases

- Must strictly increase per applicationId; testers cannot downgrade without uninstall. Ask which build is already out before choosing; a number the user gives is taken literally.
- Schemes seen: linear integer in `gradle.properties`, `yyMMddNN`, derived from versionName (digits x 10, never edit directly). Follow the project's.
- Local-only versionCode bump blocks `git merge` ("local changes would be overwritten") - stash/checkout, merge, re-apply.
- "Latest version" = `build.gradle` on main, not the tag list.
- Hotfix branches from master/release, not develop; `git branch --unset-upstream` so a bare push cannot target the protected branch.
- Send only the APK you just built; `build/outputs/apk` accumulates stale ones. Verify signer with `apksigner verify --print-certs`.

## R8 / ProGuard

- Release without minify ships unobfuscated - pentests flag it. Turning it on needs keep rules and a full retest.
- Libraries that typically need rules: Moshi (without codegen), Gson/Jackson models, Retrofit interfaces, Room, Hilt, Firebase, security SDKs (ThreatMark etc.).
- Never keep a whole app package (`-keep class com.app.** { *; }`) - it defeats obfuscation.
- Keep the mapping file per release for crash deobfuscation.

## adb / emulator on Windows (Git Bash)

- MSYS path mangling: `adb shell ls /sdcard` becomes `C:/Program Files/Git/sdcard`. Use `MSYS_NO_PATHCONV=1` or `//sdcard/...`.
- Emulator hang / black screen: `-no-snapshot-load -gpu swiftshader_indirect`. Use a `google_apis_playstore` image matching targetSdk when GMS is needed (Play Integrity, TalkBack).
- Tapping: do not guess coordinates from screenshots. `adb shell uiautomator dump` + `adb pull`, parse `bounds=` and tap the centre. Compose lazy items exist only after scrolling into view. uiautomator fails ("could not get idle state") on screens with running animations - fall back to screenshots.
- Wi-Fi adb: pairing and connect use different ports; IP changes with DHCP. Reliable: over USB `adb tcpip 5555`, then `adb connect ip:5555` (resets on reboot). mDNS may list the device twice - use `-s`. Stuck: `adb kill-server && adb start-server`.
- Simulate timeout: `adb shell settings put global http_proxy 10.255.255.1:3128`; reset with `:0`.
- Debug build storage: `adb shell run-as <pkg> cat shared_prefs/x.xml` - essential to verify migrations before/after.
- APK resources without installing: `aapt dump --values resources`.
- App PIN/login fails during device testing (unknown PIN, attempts running out): do not keep guessing. Rebuild the app, `adb uninstall` + clean install, reactivate with the test login and set a new PIN, checking the PIN dots on a screenshot before confirming. Save the new PIN in project memory.
- PowerShell `>` corrupts binary output: never `adb exec-out screencap -p > x.png`; use `adb shell screencap -p /sdcard/x.png` + `adb pull`.
- Batch adb steps into one script (relaunch, wait, dump, grep) to cut tool calls and prompts. No `jq` - use `node -e` or `py -3`.

## SBOM / Dependency-Track

- CycloneDX Gradle plugin: `./gradlew app:cyclonedxBom` > `app/build/reports/sbom.json`; restrict to `releaseRuntimeClasspath` (debug/test classpaths add noise).
- CI: generate > upload > fetch report > export, manual trigger.
- If all branches upload to one DT project, a feature-branch run overwrites state; re-run from main after merge.
- Check the project's Components tab, not global search; grep the local SBOM if search misses. Yellow triangle = newer version exists, not vulnerable. Guava suggestions may point to `-jre`, which is wrong on Android - force the `-android` flavor via constraint.
- Fix transitive CVEs by bumping the direct dependency or a Gradle `constraints {}` block.

## Dokka on GitLab

- Dokka HTML cross-refs render as raw text in GitLab. Generate `dokkaGfm`, commit to `docs/`; GitLab renders relative links without Pages.
- No spaces in `moduleName`. Strip `[androidJvm]` tags after every regeneration (order: generate, strip, commit). Generated files are CRLF - use line-based scripts, not whole-file regex.
- Same text often lives in KDoc, `module.md` and the guide - update all three.
- Strongest check: regenerate into `build/`, strip, `diff -r` against `docs/` > 0 differences.
- Document only fields that exist in the real payload. Use Mermaid instead of ASCII diagrams. Suppress internal packages with `perPackageOption`.

## SDK / library publishing

- App consuming an SDK via `mavenLocal()` sees changes only after `publishReleasePublicationToMavenLocal publishDebugPublicationToMavenLocal` (JDK 17).
- Never commit `mavenLocal()` into shared `settings.gradle` - breaks other developers' builds.
- App code that needs an unreleased SDK API breaks a clean checkout of main - record it.
- Breaking public API changes need a documented migration path. Public API never throws: return a result type. Keep everything `internal` by default.
- Internal Nexus requiring credentials/VPN is not "public" - docs must say so.
