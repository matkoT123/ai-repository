# SLSP mToken Android (mtoken-slsp-android)

Mobile token app "mobilny_token" for Slovenská sporiteľňa, an Asseco SEZAM project. Sibling generic repo: `Projects/mtoken-git/mtoken-android`.

Memory: `C:/Users/marti/.claude/projects/G--nogames-asseco-android-Projects-mtoken-git-mtoken-slsp-android/memory/`. Task context files: `claude-materials/<TICKET>/CONTEXT.md` (e.g. `SEZAM-26767`). `claude-materials/` is not gitignored here; never stage it.

## Path and git
- `G:/nogames/asseco-android/Projects/mtoken-git/mtoken-slsp-android`, single remote origin = Asseco `gitlab-prem.assecosk.local/sezam/mtoken/android/mtoken-slsp-android`. No Adit mirror.
- Fetch only when the user asks. Before a push command: run the Filip audit and check `origin/<base>..HEAD` authors (`rules/git-asseco.md`).
- Do not create repo files like CLAUDE.md here.

## Stack
`applicationId com.slsp.mtoken`, namespace `com.ace.factor`. Java (majority) + Kotlin, Hilt, Retrofit, Compose + DataBinding, Jackson/Gson, spongycastle, ThreatMark, zxing. compile/target SDK 37, minSdk 28, Java 17.
Flavors: server (`prod`, `uat`, `fat`, `sit`, `fix`, `omniApp1-4`) x googleServices (`android` FCM, `huawei` HMS). `releaseUnsigned` only for prod. Extra source sets `src/extras/{ocraAndQr,threatmark,fingerprint}`; per-env `res/raw` holds `server.properties` + `trust_store.bks`.

## Versions and branches
- `versionName` like `89.01` in `app/build.gradle`; `versionCode` derived from it and must never decrease. Bumps are commits `feat: SLSP version XX.YY`.
- Default branch `main` (remote `develop` was removed; local `develop` is stale). Releases `stage/release-XX`, tags `slsp-release-XX.YY-yymmddNN`.
- Commit style `fix(ITWORK-<n> / SEZAM-<n>): ...` or `feat: ...`.

## Dependency-Track
Pipeline in `.gitlab-ci.yml` runs only when started manually (Pipelines > New pipeline). Stages: `cyclonedxBom` > upload > fetch report > HTML export. Every branch uploads into the same DT project, so re-run from `main` after merging. Verify in DT project "Android" > Components, or grep the local `app/build/reports/sbom.json`. A yellow triangle means "newer version exists", not a vulnerability.

## Test handover
Jenkins job `slsp-mtoken-android`: `BRANCH_OR_TAG origin/main`, `SERVER` omniApp1 then omniApp2, `GOOGLE_SERVICES` Android, `BUILD_TYPE` Debug. APKs go to tester Attila.
