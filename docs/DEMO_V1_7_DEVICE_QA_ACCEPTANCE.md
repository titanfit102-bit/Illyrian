# ILLYRIAN DEMO v1.7 — Phone, screenreader and release-gate QA

> Operative acceptance checklist — 2026-10-24. Status: **UNEXECUTED / NOT RELEASE APPROVED**. This is a verification plan for the existing DEMO, **not** a new product scope or authorization to release, merge or change Production.

**Practical owner test worksheet:** [`DEMO_V1_7_PHYSICAL_QA_SESSION.md`](DEMO_V1_7_PHYSICAL_QA_SESSION.md). This document provides a historically verified immutable Preview example and instructions to record a **new same-SHA candidate**, short on-device steps, evidence fields, and clearly marks physical-device cases NOT TESTED. It does **not** replace M01–M18 below.

**Current documentary audit:** [blueprint §33](../architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-75). The dated ledgers below are historical checkpoints; CURRENT_STATE/GitHub LIVE select the next candidate. The durable index added below preserves browser evidence, not physical PASS or owner acceptance.

## 0. Preconditions: avoid testing the wrong build
- Verify repository `titanfit102-bit/Illyrian`, exact tested **code commit SHA**, open **Draft PR #1**, and target `demo/v1.7-illyrian-shop`. Verify the **exact-SHA `pull_request` Chromium + Linux WebKit** GitHub Actions runs for the selected feature-branch candidate. The duplicate feature-branch `push` trigger was intentionally removed; do not require a redundant push run.
- Obtain an **immutable Vercel Preview deployment URL** for that SHA; confirm `READY`, Preview target (not Production), branch and Git metadata. Open `/` through authorized HTTP access and check that it actually renders `ILLYRIAN_DEMO_v1.7.html`. A `READY` API response or static `vercel.json` rewrite alone does **not** satisfy F05.
- If access is denied (403/SSO) or build is rate limited, mark **BLOCKED** and do not treat an older preview as the current source. Never disable global SSO, expose a token, or use a Production URL as a substitute. Team access and temporary sharing need owner approval.
- Use **fictional test inputs only**: no identity documents, real phone numbers, addresses, card data, or payments. LocalStorage-backed DEMO state is not server authorization.
- Capture device, OS/version, browser/version, exact URL (remove temporary share tokens from evidence), orientation, language and code SHA at each session.

## 1. Device matrix
| Device / browser | Portrait | Landscape | Accessibility | Status |
| --- | --- | --- | --- | --- |
| Physical Android, Chrome | Required for Android pilot | Required | TalkBack + keyboard if available | NOT TESTED |
| Physical iPhone, Safari | Required before claiming iOS compatibility | Required | VoiceOver | NOT TESTED |
| Desktop Chromium (CI) | Viewport simulations only | Viewport simulations only | Tab/Shift+Tab/Escape automation | Automated evidence only |

A mobile-emulated Playwright viewport is **not** a physical phone or a real screenreader test. If only Android is available, record iOS as BLOCKED/NOT TESTED, not PASS.

## 2. Manual cases — one result per device, locale and orientation where applicable
| ID | Area | Procedure and expected outcome |
| --- | --- | --- |
| M01 | Entry/Navigation | Fresh session, guest tour, back/forward and main tabs; no blank or unusable screen |
| M02 | Responsive | At 320-like narrow portrait and landscape, no document-wide sideways overflow; overlays and close controls remain reachable |
| M03 | Social feed | Open profile, create a fictional draft, check error/empty states and return; unsaved input is not silently published |
| M04 | Stories/Reels | Open built-in Reels and Stories; close with UI and Escape where keyboard exists; focus returns; touch gestures do not trap the user |
| M05 | Reels author content | Enter a fictional caption with punctuation/HTML-like text; switching sq/en/it must not translate or reinterpret user text |
| M06 | Plans | Create a fictional unsent activity draft, change language in open form; data, canonical options, focus and draft remain intact |
| M07 | Connections | Open, traverse tabs/actions, create a draft only; close restores focus and background interaction |
| M08 | Privacy/Map | Open filters and group/profile views; change sq/en/it; preserve entered query, city/type codes and focus; no real privacy claim |
| M09 | Governance | Traverse trust/reports/status screens; keyboard/screenreader should announce the dialog and statuses; no actual moderation occurs |
| M10 | Shop basic | Navigate listings/search; verify synthetic inventory and no real checkout/payment |
| M11 | Shop Plus categories | Products show inventory; Cars show year/km; Rentals show area/rooms/period; Services show general fields. Other fields hidden from view/tab order |
| M12 | Shop Plus draft | Enter fictional text, switch category then sq/en/it then back; unsaved values survive while non-category metadata is excluded on final save |
| M13 | Shop Plus needs/replies | Create a fictional buyer request, prepare an unsent seller reply; expiration/error must not erase draft or pretend success |
| M14 | Shop Plus report/moderation | Reach horizontally clipped Reports tab and vertically distant submit; check unknown reason/user text is not corrupted |
| M15 | Data errors | Simulate unavailable storage only in a dedicated test session; after a failed save there must be no false success indication |
| M16 | Accessibility | TalkBack/VoiceOver reads dialog names, button purposes, input labels, field errors and feedback; focus stays inside overlays |
| M17 | Text scaling & theme | Increase browser/system text to 200% where supported; test light/dark/auto, long content, landscape and scroll |
| M18 | Conflict & persistence | In two tabs where supported, edit Shop Plus state: stale changes should be rejected; reload should preserve the last committed state in tested paths |

## 3. Evidence and triage protocol
For each case record:
- `ID | device + OS | browser | locale | orientation | PASS / FAIL / BLOCKED / NOT TESTED | actual behavior | evidence filename | issue link`.
- Screenshot before and after any anomaly; for focus/screenreader errors add a short screen recording and exact interaction sequence. **Exclude** precise addresses, accounts, personal information, and authorization/share tokens.
- Severity: **P0** security/privacy exposure, unrecoverable data loss, crash/no entry; **P1** blocked primary flow, false success, inaccessible core operation; **P2** degraded layout/translation/touch/focus with workaround; **P3** cosmetic issues. Log real evidence, not assumed defects.
- Reproduction: state fresh vs existing localStorage, current language, exact field values (fictional), whether the issue reproduces after reload, and whether a second tab was involved.

## 4. Release HOLD / exit criteria
All must be demonstrably satisfied before suggesting owner sign-off:
1. Browser QA green on the *exact candidate SHA*, including PR-triggered checks.
2. F05 served HTTP root matches v1.7 and correct Preview SHA, without altering Production or global SSO.
3. F06 branch/PR gating assessed and required-check enforcement **explicitly authorized and verified** before relying on it; triggering a PR workflow alone is not enforcement.
4. Critical flows in this checklist exercised on required physical devices; no unresolved P0/P1, with P2/P3 assessed and documented.
5. Accessibility tested with actual TalkBack/VoiceOver where platform delivery is claimed, not just Chromium keyboard automation.
6. Owner supplies explicit sign-off for DEMO promotion. **No merge, main/Production deployment, expenses, payment implementation or backend work is authorized by this checklist.**

## 5. Current evidence ledger (not results from this document)
- Prior confirmed CI: [177/177 PR run #40085347389](https://github.com/titanfit102-bit/Illyrian/actions/runs/40085347389) and [177/177 push run #40085343736](https://github.com/titanfit102-bit/Illyrian/actions/runs/40085343736), exact QA SHA `d4f9bba2c5836fa21d44c9abd72d9a1c79b4353a`.
- **Historical QA:** first Reels keyboard regression cases at `d9219abb92439b6a8cd1cdb89e3c4a3fe7a7bde2` initially exposed a failed focus return, fixed by later commits; latest passing 189/189 supersedes those failing attempts.
- **F05 PASS:** source SHA `4e57bb5cc22de1dd750c329a82957e6b0cbfaf57`, Preview `dpl_5XHeZrwthaDnjv2dMCyVcmmzXXn3` READY, protected `GET /` returned HTTP 200 with full committed HTML prefix and a Vercel feedback script appended. **16/16** referenced assets HTTP 200 with exact source parity. Does not imply anonymous unprotected access.
- **Latest CI:** [PR #40093963203](https://github.com/titanfit102-bit/Illyrian/actions/runs/40093963203) and [push #40093960592](https://github.com/titanfit102-bit/Illyrian/actions/runs/40093960592): **189/189 PASS each**, exact SHA `4e57bb5cc22de1dd750c329a82957e6b0cbfaf57`. Physical phone, actual screenreaders, F06 enforcement and owner sign-off remain OPEN / NOT TESTED.

## 6. Latest cross-engine and release evidence — 2026-10-24
- **Exact code/workflow/QA SHA:** `5a066164dbe794effea3b17eb241a70046d3949a`; PR [#40099906942](https://github.com/titanfit102-bit/Illyrian/actions/runs/40099906942): **Chromium 190/190 + bounded WebKit 12/12 PASS**. Feature push [#40099903469](https://github.com/titanfit102-bit/Illyrian/actions/runs/40099903469): **Chromium 190/190 PASS**. The WebKit job is a Linux engine-level smoke only, NOT native iPhone or VoiceOver QA.
- **F05 refresher:** protected Preview `dpl_7TATfNoxVzmH2uCAfkUNxvFATmtJ` for exact SHA: HTTP `/` 200, served committed HTML as full prefix plus Vercel feedback script; Shop Plus JS and Italian locale JS HTTP 200 and exact committed source. Previous **16/16** runtime asset check at `4e57bb5cc22de1dd750c329a82957e6b0cbfaf57` was already verified and runtime files have not changed since.
- **F06 release HOLD:** targeted branch protection administrative proposal [`docs/F06_REQUIRED_CHECKS_DECISION.md`](F06_REQUIRED_CHECKS_DECISION.md); no branch admin settings modified. Physical Android/iPhone, TalkBack/VoiceOver, owner sign-off remain NOT TESTED / OPEN.

## 7. Latest emulated touch smoke — 2026-10-24
- Exact source/QA SHA `b36708848d0b869ffa71238d81b0a35c007e82c6` — [PR CI #40104667894](https://github.com/titanfit102-bit/Illyrian/actions/runs/40104667894): **190/190 Chromium + 16/16 WebKit PASS**; [push #40104665295](https://github.com/titanfit102-bit/Illyrian/actions/runs/40104665295): **190/190 Chromium PASS**. Four new WebKit `tap()` cases cover Reels/Shop Plus at 390×844 and 844×390.
- An intermediate failed run `c5075ac5` asserted a WebKit-Linux `navigator.maxTouchPoints` value not supported by the runner. That assertion was removed, while real tap/UI assertions remained; all four touch cases then passed. Do NOT label the initial run green.
- F05 latest protected Preview `dpl_7Mka3RYEWQBEkZK6tkWyABc692sj`: HTTP `/` **200**, same-SHA DEMO HTML source exact prefix plus Vercel feedback append. The earlier **16/16** asset source-parity check was performed on `4e57bb5c`, with no runtime changes since.
- **Physical device cases M01–M18: NOT TESTED.** Linux WebKit touch emulation cannot replace Android Chrome/iOS Safari real devices, TalkBack/VoiceOver, text scaling and hardware. F06 branch protection still pending authorized owner decision. No release sign-off.

**Source of authority:** `CURRENT_STATE.md`, `MASTER_HANDOFF.md` active section, GitHub LIVE code/CI, existing DEMO architecture. This file is a QA execution aid, not an assertion that cases were performed.


<a id="durable-browser-evidence"></a>
## 8. Durable browser evidence index — 28 October2026, task7.5

Recovered existing proof, not a new browser/device session. Source `8258d2e6ac0a24f0189794ebbbda53db951f23f0`, [full PR run40601069212](https://github.com/titanfit102-bit/Illyrian/actions/runs/40601069212), feature branch→integration base `015ce439e7c6d736149c6c300391586517664f62`. Actual Chromium job122529094386:379 passed; Linux WebKit job122532628136:16 passed; steps/logs reread in7.5. Runtime/test/config bytes are unchanged at pre-audit baseline `0c19089` by Git compare; the pictures still carry their historical source, not a new build or fresh Preview. No physical Android/iPhone, TalkBack/VoiceOver, full visual/translation or release PASS.

| Stored original artifact | GitHub provenance / retention | Integrity and contents |
| --- | --- | --- |
| [visual-review.zip](archive/qa/8258d2e6ac0a24f0189794ebbbda53db951f23f0/visual-review.zip) | Artifact12778273876,3054568 bytes, created27 Oct2026 23:26:22 UTC; API expiry10 Nov2026 23:26:21 UTC. ZIP copied byte-for-byte before expiry; Git history retains this reference independently. | SHA256 `4c2b3895eddf81244d4a5d9399044e96859c0b4da3520078307d7c2e6a73da8b`, matched GitHub digest;87 JPEG members, no non-image member/path traversal or EXIF. Source is existing synthetic local CI, not real users. |
| [i18n-inventory.zip](archive/qa/8258d2e6ac0a24f0189794ebbbda53db951f23f0/i18n-inventory.zip) | Artifact12778273879,1779 bytes, created27 Oct2026 23:26:23 UTC; API expiry10 Nov2026 23:26:22 UTC. Original archive bytes preserved. | SHA256 `310a7db2efe67e668670a8f4724ca1ac84aaa29737596e2b82c33f7986ccc066`, matched digest; one `visible-ui-sq.json`,5112 bytes. Sample19 routes/264 distinct labels/76 exact-match misses; not76 confirmed untranslated UI strings. |
| [profile-phase1.zip](archive/qa/d33fc92d3b158a8eb0993edf030fd243305b6b85/profile-phase1.zip) | Source `d33fc92d3b158a8eb0993edf030fd243305b6b85`, [Browser41152183031](https://github.com/titanfit102-bit/Illyrian/actions/runs/41152183031),31 Oct2026; actual419 Chromium/16 Linux WebKit/12 classifier PASS. Selected14 original PNG members from artifact13023945434 (created00:58:48 UTC, expiry14 Nov00:58:46 UTC). Subset ZIP, not a byte-for-byte copy of the whole artifact. | 1891606 bytes; SHA256 `3d3adbc7d5289fd14aa8e33f00b26f8078c487df310e546c7ca7714b9c62959a`. Source ZIP SHA256 `c0de340396b14f6cf0681b8272fba2f91369c445c98e3288b9f00f5abef9dff0` matched GitHub digest.14 original PNGs (no EXIF),sq,Light/Dark,320×568/360×780/390×844/430×932/844×390/932×430/1280×800. ChatGPT inspected Dark390/Light320; keyboard focus outline visible intentionally. Layout/i18n/keyboard checks are bounded; photographic cover fidelity, owner visual acceptance, physical devices/screenreaders and full performance remain OPEN. No public-user data. |

Visual member index (original names retained inside ZIP):

| Filename pattern | Viewports / members | Scope |
| --- | --- | --- |
| `<width>x<height>-01-home`, `02-shop`, `02a-shop-plus-catalog`, `02b-shop-plus-needs`, `02c-shop-plus-create`, `03-events`, `04-plans`, `05-profile`, `06-reels`, each `.jpg` | 320x568,360x780,390x844,430x932,844x390,932x430,1280x800;9 states×7 sizes=63 images. | Browser captures only; default CI locale, no claim of all themes/permissions/form errors or every element. |
| `i18n-<sq/en/it>-<390x844/844x390>-<plans-dialog/privacy-dialog/shop-plus-catalog/shop-plus-form>.jpg` | 3 locales×2 sizes×4 states=24 images. | Sampled language/dialog evidence; a contact sheet was inspected for archive provenance, not pixel-diff/global acceptance. |

Inventory field `catalogKeys=710` is named by the old capture script but counts unique non-template Albanian text values (`Set`, excluding interpolation), not the full782 locale-key count/19 namespaces verified from current source. Exact-match misses include fixture names, combined labels and dynamic text. Review suspected UI omissions against source/semantics before logging a defect; do not translate UGC or claim global coverage from key parity.

Decisions and negative/intermediate results remain in Git history/security/Phase1/Phase3 and blueprint; no new full snapshot copy. For future material evidence, add sanitized original files to this same archive/index (or approved durable store), naming source/build/run/device/OS/locale/orientation/state, timestamp, outcome/issue, SHA256 and reviewer. Remove credentials/share URLs/private content **before** publication; do not publish native symbols/private manifests or personal incident evidence here. Archives must not be treated as public-user retention policy or proof of media rights. Preserve legal/privacy and release review. Historical screenshot sets outside these87 and future physical/build records remain OPEN; this index does not retroactively archive every past CI artifact.


### Notifications reference —31 October2026

Original PNGs from the final local Chromium140/headless-shell1193 run (`Notifications reference: responsive390x844`, sq, Light/Dark, portrait, initial unread fixture list). Captured on31 Oct2026 UTC, reviewed by ChatGPT against the supplied reference. Synthetic bundled profiles only; no real users or credentials. These are browser viewport captures, not physical Android/iPhone/native notification evidence or owner acceptance. Git commit history/readback pins the source; the hashes below identify the exact captured runtime, independent of expiring CI artifacts.

| Capture | Bytes | SHA256 |
|---|---:|---|
| [notifications-light.png](archive/qa/notifications-reference-f28ee73d30c5/notifications-light.png) | 186316 | `ae52db8e6021123d5ae7edcc5fccb6290329887216e648fb0d90d8e1b3d790aa` |
| [notifications-dark.png](archive/qa/notifications-reference-f28ee73d30c5/notifications-dark.png) | 175036 | `b95352c621831e7485b5c2c11eef115705937cbb3cc532a9ca1ebf3d082244f1` |

Captured runtime SHA256 (locale mirrors are byte-identical):

- `demo/ILLYRIAN_DEMO_v1.7.html`: `f91a89e8ca5258a2035509aa071fc490fa80b50723ba84adb1e756e83b676874`
- `demo/ILLYRIAN_NOTIFICATIONS_V17.css`: `6e1a516a5735aa1880f56c52331cd0b771689ca2dbb4c3ccd6d40ad8d47a9537`
- `demo/i18n/locales/sq.js`: `7d9788a18f9b5af2a0156e343b2f0d402246a475d30e783702b0fe36466a0d1e`
- `demo/i18n/locales/en.js`: `72cdf0f646da4f1a61830303d7176d0762aa0f05ee79d42316e6d6eff0b7c880`
- `demo/i18n/locales/it.js`: `d560f15e4c6a5961581e99fba7c32e40ccca90f53e22b1e29c737cab77133cc5`

Outcome: bounded visual review of both captures; source-matched local functional/layout results are in CURRENT_STATE. Physical devices/TalkBack/VoiceOver/performance and owner visual acceptance remain OPEN.


### Home Nearby —1 November2026

Original local Chromium140/headless-shell1193 PNGs, sq,390×844 portrait, Light/Dark, GPS-ready state using a **synthetic browser position** matched to the Milano reference. Reviewed by ChatGPT for the new panel/filter/Story/Reel presentation; no physical GPS or direct protected-Preview visual claim. Only fictional bundled identities and city name are visible, no precise coordinates or real private content. Source readback/runtime hashes pin these captures; CI artifacts are not their only copy. Local results/status and exact GitHub source are in CURRENT_STATE/Git history.

| Capture / UTC time | Bytes | SHA256 |
|---|---:|---|
| [nearby-light.png](archive/qa/nearby-d8844584d3fc/nearby-light.png) / 2026-11-01T13:02:55.450635+00:00 | 138004 | `00f4bafff1e2a6b92267e0d1d706f0dbb441ec44432a1203bfcdb578a44ce60b` |
| [nearby-dark.png](archive/qa/nearby-d8844584d3fc/nearby-dark.png) / 2026-11-01T13:02:56.122647+00:00 | 138839 | `94ecfa9d606819abd6a9d4967f4faab597621000a0280a2939cb3a0c7a7425d7` |

Captured runtime SHA256 (canonical/served locale mirrors identical):

- `demo/ILLYRIAN_DEMO_v1.7.html`: `32b1d27f65d076b7eeb35ac11b830e87382b83f93dbb50b54a0cbf7db2046cf1`
- `demo/ILLYRIAN_NEARBY_V17.js`: `6afa7419e16fd7aae88a3ea521273622d13349837e18c3f3cb35c3b141b2f005`
- `demo/i18n/locales/sq.js`: `837ba1655e8383c4fd9100752535b33c3fad727da00f745a3e3b75b19f1163e5`
- `demo/i18n/locales/en.js`: `51e541ae553e7667415326a71ddf5882b7c48a02adb1d397a5eed37660ddf429`
- `demo/i18n/locales/it.js`: `7f9331be1c2995154adf5eb60190cbf2b355154352ecca69e099c1e8d96835dd`

Permission denial/unavailable/timeout/revocation, stale callbacks, manual-city fallback, no coordinate persistence, modal drafts, empty areas and bounded media navigation are browser regressions, not hardware measurements. Real Android/iPhone GPS/permissions, TalkBack/VoiceOver, power/performance and owner acceptance remain OPEN.
