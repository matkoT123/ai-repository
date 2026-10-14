# MZV - official documents app (Android)

Android app for official documents handled by MZV (Ministry of Foreign Affairs) via partner Microcomp: citizen app for lost/travel documents, web portal, staff app. Features: biometrics (fingerprint via Morpho/IDEMIA LiveScan, face photo with quality checks, handwritten signature), smart card reading, PDF view and signing, offline encrypted DB with sync. Saudi-themed icons in `D:/MZV/icons` suggest a deployment or demo for an embassy context.

## Status
Inactive. Last commit 2024-05-10 (Jurenka, version 1.11). Development 2023-05 to 2024-05. Jira prefix `MZVBIO-`.

## Paths
| Path | What |
|---|---|
| `D:/MZV/mzv-android-app` | Newest clone (master, 644 commits) - use this one |
| `D:/MZV/icons`, `D:/MZV/pictures` | UI assets |
| `C:/PROJECTS/FILIP_MZV/mzv-android-app-new5` (+ `.rar`) | Filip's clone, 2023-10-02 |
| `C:/PROJECTS/PROJECTS_TO_WORK/mzv-android-app`, `C:/PROJECTS/MZV ANDROID VERSION 5/mzv-android-app`, `C:/PROJECTS/WORK/MZV6/mzv-android-app` | Clones 2023-10 |
| `C:/PROJECTS/MZV ANDROID VERSION 5/mzv-android-app - Copy`, `MZV ANDROID VIA CORREXT COMPOSER 3 ANDROID`, `MZV COMPOSER 3 ANDROID`, `new mzv android`, `WORK/MZV_NEW_VERSION*`, `ACONSULTING PROJECTS/mzv-android-app` | Early clones 2023-06/07 (Compose Material 3 migration) |
| `C:/PROJECTS/WORK/MZV/mzv`, `WORK/MZV2/mzv` (+ zip) | Prototype repo `https://git.adit.sk/zemla/mzv.git`, 2023-05/06 |
| `C:/PROJECTS/mzv`, `C:/PROJECTS/mzv_Zaloha/mzv` | Pre-git prototype (`com.example.mzv`, Login/Register/Home activities) |
| `C:/PROJECTS/WORK/MZV3`, `WORK/newMzvCloning` | Empty |

All old copies are superseded by `D:/MZV/mzv-android-app`; candidates for deletion after the user confirms.

## Repo
`https://git.adit.sk/microcomp/mzv-android-app.git` (never push). Contributors: Jurenka (266), Andrej Krajci (177), Tremko (74), Filip Zemla (73), Marek Oravec.

## Stack
- Kotlin 1.8.21, AGP 8.1.1, JDK 17 target, compileSdk/targetSdk 33, minSdk 29, applicationId `sk.microcomp.mzv.document.app`.
- Jetpack Compose (Material 3 1.1.1, compiler 1.4.7), Navigation Compose, Hilt 2.44 (+ hilt-work), Room 2.5.2 with SQLCipher 4.5.4, Retrofit 2 + Gson.
- Modules: `app`, `api` (`certs`, `common`, `codelist`, `service`; clients generated from `openapi_codelist.yaml`, `openapi_mp_service.yaml` via `generate.bat` = `gradlew api:generateSwaggerCode`), `libsmartcard` (AAR), `facial-validation-lib`, `MorphoLiveScan` (in some clones).
- Screens: dashboard, requests, newRequest, requestData/Info/Sign/TravelDoc/LegalRepresentative, dataComparison, biometry (face, signature), verification, search, sync, tour, settings.

## Build / run
JDK 17. `cleanBuild.sh` wipes build dirs; `connect.bat` = adb over Wi-Fi to a test tablet.

## Security notes
- secret present in `D:/MZV/mzv-android-app/adit.jks` (signing keystore tracked in git).
- `local.properties` files exist in several clones (local SDK paths, not secrets).
