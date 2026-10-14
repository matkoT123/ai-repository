# Android security, upgrade safety, accessibility, localization, logging

## Keys and secure storage

- Hardware-backed AndroidKeyStore keys do not survive backup/restore or device migration; app files and prefs often do. "Flags say activated, key alias missing" must mean not activated: wipe stale state, return a distinct status (re-activation), never fall through to success.
- Validate real cryptographic material, not marker files or booleans.
- Keys bound to user authentication can be invalidated by biometric enrolment changes (`KeyPermanentlyInvalidatedException`) - handle it as a recoverable state.
- Data encrypted with a PIN-derived key cannot be migrated on a cold first start; run that migration at the first PIN entry after update.
- EncryptedSharedPreferences is deprecated; for new code use a KeyStore AES-GCM wrapper or Tink. `allowBackup=false` (or explicit backup rules excluding secrets).

## RASP vs Play Integrity vs homemade checks

- Play Integrity: backend nonce > device token > backend verifies and decides. Warm up with `prepareIntegrityToken()`, check on sensitive actions, not only at start. Verdicts: appIntegrity, deviceIntegrity (STRONG / DEVICE / BASIC / VIRTUAL=emulator), accountDetails. Needs GMS (Huawei and sideloaded builds return UNRECOGNIZED_VERSION). Does not detect Frida, debuggers or hooking. Must be verified server-side, otherwise Frida rewrites the result. Complement, not replacement.
- Homemade root detection loses (Magisk systemless, Zygisk DenyList, Shamiko). Use a certified commercial RASP (Promon Shield, ThreatMark). Reference standard: OWASP MASVS-RESILIENCE.
- Agree inform vs block with the client before implementing - very different impact on real users.
- Shielded builds block emulators: estimates need physical devices and a separate QA phase. Keep emulator blocking only in prod-like builds; debug/demo log-only. App-level "rooted device" screens may be unreachable in shielded builds. Shielder upgrades: replace all binaries and diff the config template; check that config paths referenced in Gradle exist.
- SDK integrations: plan R8 rules, coexistence with RASP SDKs, re-shielding and a MobSF scan.

## Hardening baseline (MASVS)

- `FLAG_SECURE` on sensitive screens (toggle per environment), no `usesCleartextTraffic`, explicit `networkSecurityConfig`, certificate pinning in all prod-like flavors with current + next pin, `allowBackup=false`, R8 on, no logging of tokens/PINs/PII, exported components reviewed, `PendingIntent.FLAG_IMMUTABLE`, WebView JS/file access off unless required.
- Runtime TLS certificate rotation conflicts with SDKs that take certificates at construction - needs a `reconfigure()`-style API.
- Secrets (signing passwords, API keys, repo tokens) never in `build.gradle`/`settings.gradle`; flag any found.

## Upgrade and migration safety

- Map every key, alias and prefs name when migrating storage (legacy > new SDK). Check counter semantics (last-used vs next: off-by-one). Verify with `run-as` before/after and by reproducing an identical output (e.g. same OTP) from the same inputs.
- Do not copy unverified security state (turn biometrics off on migration). Clear new storage on logout or cancelled activation. Never re-import on every use.
- Values persisted only by an old code path (e.g. cert validity) show defaults (1970 dates) in the new flow - backfill.
- Time math: `(expiresAt - now) / 1000` truncates - round up for countdowns.
- "No data" can mean no request was sent (client-side guard returned false) - check before blaming backend.
- Don't let one bad item fail a list (decryption/parse failure > log, skip). Nullable server field > nullable DTO and model; a `!!` crashed a whole inbox.

## Accessibility / TalkBack

- Test devices need GMS + Play Store (sideloaded Accessibility Suite crashes without GMS). Prefer a stock Pixel, cross-check on the OEM devices users have. Device must reach targetSdk.
- TalkBack reads the accessibility tree (name, role, state - WCAG 4.1.2), not pixels. Canvas-drawn content (map markers, info windows) is invisible; navigation only through marker > info-window tap is unusable - provide an accessible list alternative.
- `announceForAccessibility` is unreliable/deprecated; use live regions (`liveRegion = LiveRegionMode.Polite`) or `paneTitle`.
- Compose: `clickable(role = Role.Button)` alone was not enough - add `.semantics { role = Role.Button }`; merge descendants for rows (`semantics(mergeDescendants = true)`), `contentDescription = null` for decorative images, headings via `semantics { heading() }`.
- RecyclerView: clearing `collectionInfo` on the list does not help - clear `CollectionItemInfo` per ViewHolder.
- `stateDescription` is read only on re-focus; state changes need a live region or explicit announcement.
- Touch targets 48dp, contrast, font scaling up to 200% without clipping.
- Locate the exact screen of an audit finding before fixing (names in audits can mislead).

## Localization

- Format specifiers (`%1$s`, `%d`) must match in count and type across all locales - mismatch crashes at runtime. Lint `StringFormatMatches` helps; check manually for new translations.
- Do not start a string with a placeholder; build such sentences in code (also needed for iOS sharing).
- Plurals: SK has one/few/other (and many for decimals), EN/HU one/other. Use `<plurals>` / `pluralStringResource`.
- No hardcoded UI strings in Kotlin.
- Number/currency formatting is a frequent bug ("10 EUR" vs "10,00 EUR") - format with locale-aware formatters and agree the rule.
- Shared Android/iOS translation sheet: diff `values*/strings.xml` between branches; match new keys by text across all tabs (iOS rows may exist without the Android key); append only rows with no equivalent; list changed texts too; paste from a real xlsx grid (TSV from Notepad lands in one cell); confirm row numbers in the live sheet.

## Logging

- Keep local logcat logging and remote log upload as independent, documented gates; remote upload of WARN/ERROR may be on for all users regardless of local log level - know which.
- Batch remote logs (count / size / time thresholds). Never log secrets or PII.
- Device logs with state (offline counters etc.) are key for diagnosing client/server mismatches.
