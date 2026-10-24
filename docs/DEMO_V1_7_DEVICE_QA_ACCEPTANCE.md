# ILLYRIAN DEMO v1.7 — Phone, screenreader and release-gate QA

> Operative acceptance checklist — 2026-10-24. Status: **UNEXECUTED / NOT RELEASE APPROVED**. This is a verification plan for the existing DEMO, **not** a new product scope or authorization to release, merge or change Production.

## 0. Preconditions: avoid testing the wrong build
- Verify repository `titanfit102-bit/Illyrian`, exact tested **code commit SHA**, open **Draft PR #1**, and target `demo/v1.7-illyrian-shop`. Check matching `push` and `pull_request` Chromium runs.
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
- Reels keyboard regression cases added afterward at `d9219abb92439b6a8cd1cdb89e3c4a3fe7a7bde2`; **result requires its own exact-SHA CI check**.
- F05 HTTP root, manual phone, screenreader and owner sign-off remain OPEN unless separate new evidence is recorded.

**Source of authority:** `CURRENT_STATE.md`, `MASTER_HANDOFF.md` active section, GitHub LIVE code/CI, existing DEMO architecture. This file is a QA execution aid, not an assertion that cases were performed.
