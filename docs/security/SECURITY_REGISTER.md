# ILLYRIAN — security register
Updated 2026-10-25. Canonical security state; continuity documents link here. Scope: public static DEMO, feature `feat/i18n-shop-feedback-20261022`, Draft PR #1. Baseline HEAD `2901d58b6e080c11345f21e76790edf3085e9ee8`; runtime/test `ec70a92c56b207a4bd5ccaa79f01d73f38bd36ac`. Existing audit A1-01–A1-07 corrections are recorded in CURRENT_STATE with source/CI links; do not re-open them from an old report.
Statuses: VERIFIED (bounded evidence), PARTIAL (incomplete), FAILED, UNKNOWN, NOT APPLICABLE (current DEMO only). A failed tool/network/queued job is not a passed scan. No absolute-security claim.

| ID / risk / component | Status | Control and evidence | Next action |
|---|---|---|---|
| SEC-01 high / secrets | PARTIAL | Current-tree known-format/assignment detector; redacted output; synthetic rejection test | Wider historical/entropy scan and private reporting route before real credentials; no secrets committed |
| SEC-02 high / DOM and UGC | PARTIAL | Escaping/semantic exclusions and existing A1 browser regressions; bounded eval/write detector | Review changed sinks; comprehensive SAST remains unimplemented |
| SEC-03 high / supply chain | VERIFIED | Locked i18next/Playwright inventory, vendor SHA/parity, npm audit at high threshold | Record actual audit result below; no suppressed advisories |
| SEC-04 high / local state | PARTIAL | Existing A1 recovery/quota/stale-write tests and continuity evidence | Local data is mutable; no server transaction guarantee |
| SEC-05 high / merge policy | PARTIAL | PR QA already exists; new security-baseline proposed check | F06 administrative enforcement needs approval; no rules changed |
| SEC-06 critical / real account/API/DB/DM/payment | NOT APPLICABLE | No real backend/native/auth/payment in this repository | Mandatory real-release gate; UNKNOWN until implemented and negatively tested |
| SEC-07 high / device/accessibility | UNKNOWN | DOM/emulated browser evidence only | Real M01–M18 Android/iPhone, TalkBack/VoiceOver and owner signoff |
| SEC-08 high / scheduled monitoring | PARTIAL | Weekly schedule defined | Inactive until workflow authorized on default branch; no background monitoring claim |
| SEC-09 high / disclosure/incident/restore | UNKNOWN | Root SECURITY.md avoids public exploit reports | Verify private advisory/contact; approve operational owner and restore evidence before real users |

## Verification ledger
Implementation belongs to PR #1; source commit is discoverable with `git log -- .github/workflows/illyrian-security.yml`. Local/remote results are appended below after execution; never mark verified from file presence. Sensitive unresolved findings remain private; public rows contain only sanitized status. Update this register only when control, risk or evidence actually changes.

### 2026-10-25 — local implementation evidence (PR #1)
- Known-format self-test: 7 unsafe fixtures rejected, safe fixture accepted. Full scanner negative test returned exit 1 on a synthetic token and did not print its value; temporary fixture removed before commit.
- Current-tree scan: 78 text files, zero matching findings. Bounded detection only, not proof of no secrets.
- Locked npm install with scripts disabled PASS; `npm audit --prefix security --audit-level=high`: **0 vulnerabilities** at execution. Advisory database changes over time.
- First-party JS/inline syntax and exact served-vendor/npm equality PASS; locale mirrors PASS; staged diff whitespace check PASS. Runtime code unchanged, existing browser CI reused.
- Remote security job: UNKNOWN until this commit is pushed and run observed. Weekly execution inactive on feature-only workflow. Comprehensive SAST/history scanning and private reporting channel remain open.

### Verified remote security baseline
Source `598628f25a514d6190c5dfee18a1c75eaeae10b9`; [run 40206194367](https://github.com/titanfit102-bit/Illyrian/actions/runs/40206194367), job 121207531799 completed/success, log inspected: 7 negative detector fixtures, 78-file scan, JS syntax/vendor parity, locked install and npm audit 0 vulnerabilities all PASS. SEC-01/02 remain PARTIAL by coverage; SEC-03 VERIFIED only at this execution. Remote browser run 40206194257 IN PROGRESS at checkpoint. No full SAST/history/private-disclosure/physical-device claim.

### 2026-10-25 — Messages/Stories bounded data-safety verification
Source `0deea7d4128de63ed1dedf2184d231121f67036f`, PR #1; [CI 40206834620](https://github.com/titanfit102-bit/Illyrian/actions/runs/40206834620) **232 Chromium + 16 Linux WebKit PASS**, logs inspected; [security 40206834606](https://github.com/titanfit102-bit/Illyrian/actions/runs/40206834606) PASS / npm audit 0 vulnerabilities. SEC-04 remains PARTIAL: new Story timer draft protection and observed stale-message rejection are verified, including quota/retry/reload; other core writers and atomic concurrency are not globally covered. Locale mirrors and domain keys preserved. Preview for this SHA BLOCKED by build-rate-limit; physical/device release evidence UNKNOWN. Blueprint §12 extends existing native/store prerequisites, not implementation. No active critical vulnerability or absolute-safety claim is inferred from passing checks.

### Phase 1 checkpoint — 2026-10-25
Source `00fdf0196b4a9201e884e7bc3a1a6a61dd4f6559`, [full QA 40208002522](https://github.com/titanfit102-bit/Illyrian/actions/runs/40208002522) **235 Chromium + 16 WebKit PASS**, both logs inspected; [security 40208002519](https://github.com/titanfit102-bit/Illyrian/actions/runs/40208002519) PASS / npm audit 0. Governance unknown historical status now preserved/escaped without UI translation or raw data write. SEC-02 remains PARTIAL by global sink coverage. New P1-A11Y-01 contrast finding and incomplete manual gates are tracked in [Phase 1 handoff](../PHASE1_QA_HANDOFF.md); no palette change authorized. SEC-07 remains UNKNOWN for physical screenreaders. Baseline Preview183a802 root/16assets verified; new fix Preview blocked by build-rate-limit. F06 remains unenforced/approval required. No real backend/mobile or release-readiness claim.

### Phase 1 Preview resolved for candidate a78935738a8ad9ccd7e86ec7dc1fe461f1acc272
Protected immutable https://illyrian-demo-rbke1i9an-un24.vercel.app/ READY, target null, same candidate metadata; root HTTP200/full source prefix and changed Governance JS HTTP200/exact parity. Tested runtime code-equivalent to 00fdf019. Baseline unchanged assets retain earlier parity evidence. Physical/contrast/global audit/F06 gates remain OPEN; see [QA handoff](../PHASE1_QA_HANDOFF.md).


### Phase 3 bounded social/location checkpoint — 2026-10-25
Source `a9a380cfa570a2a07c3c7b0ae814817e630e8e99`, [security run 40234873350](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234873350) PASS, job 121294172984 log inspected: 7 negative fixtures, 83-file bounded scan, syntax/vendor parity, locked inventory and npm audit 0. [QA 40234873355](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234873355): 257/257 Chromium + 16/16 Linux WebKit PASS; local 22/22 and 6/6 responsive/focus probes PASS. Comments/membership/city rollback and observed stale-comment rejection, UGC literal rendering, city-time validation and expired-interest handling are covered; SEC-02/04 stay PARTIAL (other sinks/writers and true atomic concurrency unproven). No GPS collected, no new service/dependency. Optional communityId/timeZone fields preserve historical keys/raw data on load. Future object/role/notification/timezone contracts extend blueprint §13; SEC-06 stays NOT APPLICABLE to DEMO and mandatory before real release. [Phase 3 report](../PHASE3_INTEGRATION_QA.md) records source-matched protected Preview HTTP200/17 asset parity and OPEN physical/global/contrast/F06 gates. No release/absolute-safety claim.
