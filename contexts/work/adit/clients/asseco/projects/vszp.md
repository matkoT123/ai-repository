# VšZP patient app (vszp-android)

Mobile app for policyholders of Všeobecná zdravotná poisťovňa: login with PIN/biometrics, eRecepty and "Do lekárne", drug stock availability in pharmacies (SP97302), PZS search with map, payments, documents, benefits, chatbot, waiting lists.

Memory (current status, details): `C:/Users/marti/.claude/projects/G--nogames-asseco-android-Projects-VSZP-vszp-android/memory/` (index `MEMORY.md`). Adit copy memory: `...-aditCopyProjects-VsZP-vszp-android/memory/`.

## Paths
| Copy | Path | Remotes |
|---|---|---|
| Asseco (main working copy) | `G:/nogames/asseco-android/Projects/VSZP/vszp-android/vszp-patient-app` | origin = Asseco `git.asseco-ce.com/mobilny-vyvoj/vszp/vszp-android`, `adit` |
| Adit | `G:/nogames/asseco-android/aditCopyProjects/VsZP/vszp-android/vszp-patient-app` | origin = Adit, `asseco` |
Working material: `vszp-patient-app/claude-materials/` (reports, Jira exports, swaggers, translation helpers).

## Stack
Kotlin + legacy Java (`sk.qbsw.vszp.patient.*` legacy, `com.asseco.ce.vszp.patient.*` new). Clean Architecture + MVI, Koin, Retrofit + Moshi (new) / Gson (legacy), Room, Compose mixed with Fragments, Paging 3, Google + Huawei maps, Firebase. compile/target SDK 36, minSdk 24.
Modules: `app`, `core`, `domain`, `data`, `data-networking`, `presentation`, `integrationApi`, `utils`, `feature/{healthserviceproviders,benefits,chatbot,myhealth/waitinglist}`, `generic/*`, `buildSrc`. Two PZS map implementations exist (legacy Java `CFragmentInNearbyMap` and Kotlin `feature/healthserviceproviders`); SP97302 extended both.

## Flavors and environments
| Flavor / variant | Backend | Used for |
|---|---|---|
| `vszp_prod` / `prodRelease` | production | production, only flavor with SSL pinning |
| `vszp_demo` / `vszp_demoRelease` | `zlp3.vszp.local:81/mobile/` (VPN) | builds for VšZP testers, sent on Fridays via Drive |
| `asseco_vpn` | HLT env (`hlt-roz` or `hlt-bud.asseco-ce.com/mobile/`) | Asseco internal testers, continuous |
| `asseco_roz`, `asseco_bud`, `asseco_vyv`, `asseco_test` | `hlt-<x>.asseco-ce.com/mobile/` | HLT public envs |
Testing runs on HLT ROZ; when test data is missing, ask for an account from Andrea or use the one named in the ticket.
Current working HLT tier: **ROZ** (confirmed 2026-10-10). It can flip before releases; if something points to BUD, ask. `vszp_demo` (ZLP3) builds for VšZP testers are made by colleagues with ZLP3 access; the user has no access to ZLP3, so never plan steps that need it.
Test logins: `secrets/work.env: VSZP_TEST_USER, VSZP_TEST_PASSWORD, VSZP_HLT_SMS_CODE, VSZP_DEBUG_UNLOCK_PIN`. HLT rejects trivial PINs (e.g. sequences).

### Integration switch (local only, never staged)
- "ROZ"/"BUD" for `asseco_vpn`: swap the host in both `centralUrl` and `assecoOnboardingUrl`.

## Branches
- `develop`: integration branch for MRs. `master`: production; hotfixes branch from `origin/master` (see `rules/git-asseco.md`).
- Feature: `feature/SP<n>-ZPIS-<n>-<desc>`; fixes `fix/...`; old `build/SP...` branches for specific deliveries.
- `feat/SP97302-...-v-MA` is dead; the SP97302 integration branch was `feature/SP97302-ZPIS-90284-stav-zasob-liekov-v-MA`.
- Blind friendly work: `feature/ZPIS-98427-SP100763-blind-friendly` (re-host of Filip's `adit/task/ZPIS-98427`, recipe B in `rules/git-asseco.md`).

## Release and versions
- `appVersionCode` in `app/gradle.properties` must exceed every build already handed out (same `applicationId`, no downgrade). Ask which build VšZP already has; take the number the user writes literally.
- Test APK version bumps stay uncommitted. Merging `develop` with an uncommitted bump fails ("local changes would be overwritten"): `git checkout -- app/gradle.properties`, merge, set the number again.
- `centralUrl` is stored base64 in resources; grep for the host in an APK finds nothing. Inspect with `aapt dump --values resources`.
- Old APKs lie in `app/build/outputs/apk/...`; send only the one just built.

## Translation sheet "Vszp MA strings"
Shared with iOS. Main sheet "Redizajn 2. faza" (`A=iOS Key | B=Key (Android) | C=SK | D=EN | E=HU`), "Plurals" has an extra category column. Before adding a row, search existing rows by SK/EN text (iOS keys like `Common.Accessibility.*` have empty Android column) and fill column B there. Deliver as xlsx copied from the grid, not TSV. No placeholder at the start of a string (`%1$s, ...`); format specifiers must match in SK/EN/HU. Full procedure: memory `prekladove-stringy-google-sheet.md`.

## Durable gotchas
- Empty pharmacy/PZS list is often not a BE bug: `HealthServiceFilterState.canFilter()` returns false with location denied and no filter, and no request is sent.
- `pzs/list` and `pzs/map` are different endpoints (map ignores region filter).
- Moshi non-nullable fields missing in real BE data throw, and the app shows the generic "Internetové pripojenie nie je k dispozícii" (`ConnectionFailure`). Suspect a strict field before a network or BE issue.
- `BranchPharmacyListScreen` is shared by `Branch`, `Pharmacies` and `PharmaciesEReceipt`. Drug availability UI (filter section, availability text, tooltip bubble) must be gated on `PharmaciesEReceipt`; check all three when one leaks.
- Non-contracted pharmacies (`vratitNezmluvneLekarne=true`) only for the drug availability use case. `zasoby-liekov` is on `v5`.
- Map marker tap only shows the info window; navigation hangs on the window click, which is not in the accessibility tree.
- Accessibility fixes: declare `.semantics { role = Role.Button }`; use `CAccessibilityUtils.clearListItemPosition()` in view holders.
- Old "Do lekárne" nearest-pharmacy banner (`CFragmentToPharmacy.java`) is a different, older feature than SP97302.
- `specka.txt` is empty; read the spec docx.
- "Padol extrakt" is the ETL job (Fero), not Android. Missing test data on ROZ usually comes from it.
- RASP findings SP75264/SP75268: our stated position is that VšZP selects and buys a certified RASP library and we integrate it. Do not deviate without agreement. Details: memory `project_rasp_mobile_security.md`.
- Tapjacking (SP94975, ZPIS-82324): a global touch filter was reverted twice (2022 hotfix 5.0.2, 2025 `BaseActivity.dispatchTouchEvent`, still commented out) because legitimate overlays made screens unresponsive. Agreed direction (2026-10-12): protect only a central list of critical screens, block the touch and show a message (Alternative 2), never silently. Details: memory `sp94975_tapjacking.md`.
- "Prejdenie ANA" from the analyst = developer review of an analysis with one clear decision, not a time estimate.
- Backend is VšZP `ipep-be` (Adit copy `aditCopyProjects/VsZP/ipep-be`, legacy Java 8, needs VPN/Nexus, not built locally). Read its code only to confirm backend behaviour.
