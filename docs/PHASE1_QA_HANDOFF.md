# ILLYRIAN — Phase 1 functional QA and handoff

Updated 2026-10-25 (Europe/Rome). **Phase 1: PARTIAL / RELEASE HOLD.** The automated checkpoint is ready for review; physical acceptance, global UI coverage and owner approvals are unfinished. This is the final report for this QA pass, not a claim that every possible state or device has passed.

## Exact candidate and evidence
- Repository `titanfit102-bit/Illyrian`, authorized `feat/i18n-shop-feedback-20261022`, PR #1 OPEN/DRAFT/UNMERGED into `demo/v1.7-illyrian-shop`.
- Baseline docs HEAD `183a8024fa7780cfe738d042fe5a9aae9f3c3c3b`; earlier source `0deea7d4128de63ed1dedf2184d231121f67036f` passed [232 Chromium + 16 WebKit](https://github.com/titanfit102-bit/Illyrian/actions/runs/40206834620). Previously verified A1 fixes and Story/message safeguards were reused, not rebuilt.
- New bounded fix/test source `00fdf0196b4a9201e884e7bc3a1a6a61dd4f6559`: Governance preserves unknown historical status codes as escaped original text, excluded from UI phrase translation. Both report cards and review views use the same renderer. No data migration, role change, catalog merge or design/palette/logo change.
- Three new sq/en/it regressions failed before the fix: status `Mbyll` was incorrectly shown as pending. **7/7 targeted local tests PASS** after the fix, including existing semantic/failed-save Governance tests; original raw storage remains unchanged.
- Current full CI: [run 40208002522](https://github.com/titanfit102-bit/Illyrian/actions/runs/40208002522), **235/235 Chromium + 16/16 Linux WebKit PASS**, both logs inspected (jobs 121213002005 / 121214367894). Security: [run 40208002519](https://github.com/titanfit102-bit/Illyrian/actions/runs/40208002519) PASS; bounded secret scan, syntax/vendor identity, locked install and npm audit. No assertion of comprehensive SAST or absolute safety. The locally tested tree and source tree match: `09b69f685030f45b99b4c13d0ff39484e69810cc`. The 16 WebKit probes are a bounded subset, not the complete Chromium suite or real Safari hardware.

## Module acceptance map
“PASS scoped” means the existing browser regression suite exercised the stated journeys. It is not full branch/code coverage or production validation. Fixtures and browser-local behavior remain DEMO.

| Area | Evidence / verified scope | Real-app gap or residual |
|---|---|---|
| Home/Feed | Navigation, compose, local posts, filtering and failed-save regression | Shared feed, ranking, server privacy, remaining legacy write paths |
| Profile/Settings | Profile/quota retry, theme, language, scoped reset, About v1.7 | Real identity/recovery/account deletion; preference permissions are UI only |
| Messages/Inbox | Draft/quota rollback, retry/reload, observed stale-tab rejection | No delivery server, durable outbox, cross-device auth or atomic transactions |
| Stories/Reels | Viewer close/focus/touch, creator/UGC, Story draft clock pause and reply retry | Photo-based simulation, media pipeline/expiry/access control absent; own-media/rare draft paths not exhaustively certified |
| Communities/Search | Directory/member/profile/plan links and sample search | Fixture results and memberships; no real search index or membership enforcement |
| Shop | Catalog/listings/cart/contact, validation and quota rollback | Fake orders/contact; separate inventory from Shop Plus |
| Shop Plus | Category fields, forms, draft/locale preservation, known/unknown states, stale-write rejection | Separate inventory, illustrative 5%, no real payment/fulfillment or atomic stock |
| Plans/Events | Organizer/participant, capacity/waitlist/chat, locale/forms, failed-save and stale-write tests | Legacy event cards and Plans remain separate models; role switch is not authentication |
| Connections | Cities/interests→Plan draft, repeat/host samples and UGC preservation | Synthetic counts/hosts; dynamic cross-module data is not a shared transactional store |
| Privacy/Map | Public/private simulation, filters, canonical values, locale/ARIA/focus | Client-visible fixtures; schematic map, not server privacy or personal GPS tracking |
| Governance | Reports/appeals/work panels, local error paths and unknown historical statuses | Local decisions do not remove catalog content; mutable audit log, no moderator service |

Structural conflicts remain recorded, **not merged**: Shop vs Shop Plus catalogs (`kind` vs `type`), legacy Events vs Plans, multiple profile/block/membership models, local reports vs global enforcement, and independent local stores. Native implementation must define one authoritative object and ownership contract; retain historical DEMO IDs until a versioned migration is approved.

## i18n and accessibility
- Actual catalogs: **596 keys per sq/en/it, 15 namespaces**, matching key sets and root/demo byte mirrors. Existing fallback/preference/number/plural tests are reused. Key parity is not a percentage of translated UI.
- Additional runtime sample: Settings→Language correctly shows sq/en/it title, description and buttons after switching. Existing open-form draft/focus/domain-value tests remain part of the suite. User names, posts, captions, messages and historical unknown status strings must remain unchanged.
- **Global translation audit remains OPEN:** exact-match inventories only sample visible states. Rare notices, static explanatory prose, ARIA/empty/error states outside explicitly asserted paths are not certified. Phrase-based MutationObserver translation still coexists with semantic keys.
- Existing keyboard tests cover Tab/Shift+Tab containment, Escape, focus return and background inert behavior in module dialogs and Stories/Reels. Existing validation tests cover selected field/error association. This is DOM/keyboard evidence, not actual screenreader behavior.
- New axe-core **4.10.3** local diagnostic (temporary tool, no application dependency) sampled Home, Profile and Settings theme at 390×844. Rule tags: WCAG 2 A/AA and 2.1 AA. Home light/auto has **one `color-contrast` serious finding**: `.v4-reels-head > button[data-id="0"][data-act="open-reels"]`, foreground `#e50c37`, background `#f8f5f6`, 11px bold, reported **4.36:1**, expected **4.5:1**. Home dark, sampled Profile and Settings had no violations from these runs, but each had incomplete contrast checks. No blanket contrast PASS.
- **P1-A11Y-01 OPEN:** review the light-mode Reels button contrast. This task explicitly preserves colors/design, so no unapproved color/typography redesign was applied. A bounded visual adjustment needs an owner decision; do not hide the finding or suppress the rule.
- Reduced-motion runtime probe: with `prefers-reduced-motion: reduce`, the same built-in Story remained selected after advancing the browser clock by 9 seconds without entering a reply. PASS for this scenario; not an all-animation or vestibular-safety certificate.
- TalkBack, VoiceOver, real virtual keyboard, zoom/system text size and screenreader announcements remain NOT TESTED. Browser accessibility metadata cannot replace these.

## Responsive and visual scope
Existing visual suite produces 63 baseline plus 24 sq/en/it portrait/landscape images (87 expected) across 320×568, 360×780, 390×844, 430×932, 844×390, 932×430 and 1280×800. Existing theme, viewport, dialog and 200% CSS-root scaling regressions are reused. Screenshot capture is not baseline pixel-diff or proof every image was reviewed during this pass. No new screenshots were needed for the text-only status correction; existing visual evidence was retained.

Actual Android/iPhone keyboard resize, browser bars/safe-area behavior, OS text scaling, hardware gestures, battery/memory and assistive technology are OPEN. CSS root scaling is not actual OS/browser zoom. No performance threshold is marked PASS without selected device baselines and measurements.

## Vercel and administrative gates
- The earlier build-limit blocker was rechecked. Immutable **baseline Preview** [illyrian-demo-6k78v4klv-un24.vercel.app](https://illyrian-demo-6k78v4klv-un24.vercel.app/), deployment `dpl_4Fr38nkGv4YE7Yw12hFN8g5o259c`, READY/Preview target null, git SHA `183a802…`.
- Authorized protected root HTTP **200**, complete same-SHA committed HTML as exact prefix plus 163-character Vercel feedback suffix; **16/16 referenced CSS/JS/vendor/catalog assets HTTP 200 and exact same-SHA source parity**. All results inspected. ILLYRIAN title/favicon/logo remain the established assets. No global SSO change; no temporary token recorded here. This does not certify anonymous access.
- **New fix source `00fdf019…`: Preview BLOCKED**, GitHub Vercel status `failure / build-rate-limit`, no same-SHA deployment returned at this check. Baseline Preview does not contain the Governance fix. Do not substitute it for final-candidate visual/device acceptance.
- All four branches reported `protected:false`; repository rulesets `[]`. Proposed required checks remain `browser-smoke-pull_request`, `webkit-smoke-pull_request`, `security-baseline`. F06 enforcement requires explicit administrative approval. Successful workflows alone do not prevent merge.
- No merge, main/integration/Production update, spending, paid upgrade, backend, native build, secret or global authentication change.

## Physical acceptance and exact next action
Use [M01–M18 acceptance matrix](DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md) and [physical session worksheet](DEMO_V1_7_PHYSICAL_QA_SESSION.md); record a new immutable same-SHA candidate, not a historical example. Physical status remains **NOT TESTED** on Android Chrome and iPhone Safari.

Order of remaining work:
1. Obtain a free READY Preview for the new fix source or a code-equivalent documentation HEAD, verify HTTP/assets/SHA, and update the physical-session candidate fields.
2. Run M01–M18 with real Android/iPhone, portrait/landscape, sq/en/it, virtual keyboard, Light/Dark, TalkBack/VoiceOver and real text scaling. Record model/OS/browser, locale, orientation, build/source, input and PASS/FAIL/BLOCKED evidence. Include Story draft during timeout, quota/retry/reload and two-tab guidance.
3. Decide the bounded contrast correction without changing the approved identity; complete global i18n/UGC/ARIA inventory and any confirmed corrections. Do not treat unmatched inventory labels as automatically untranslated user content.
4. Obtain explicit F06 owner approval and validate actual enforcement without merging. Owner signoff follows resolved blockers and evidence, not test count.

## Android/iOS readiness handoff
Canonical requirements are [blueprint §12](../architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md), M0–M5, and [security architecture/gates](security/SECURITY_ARCHITECTURE.md). No parallel native architecture document is introduced.

Still required: signed-off MVP/exclusions and platform choice; per-screen API/data/error contracts; identity/session/recovery and object authorization; shared catalog/Plan identity; durable drafts/outbox/idempotency; media lifecycle; membership-restricted private messages; rate/abuse/moderation operators; privacy/export/deletion; monitoring/backup/restore; device baselines and store/privacy/signing/test distribution checks. Prototype role toggles, local orders and browser fixtures satisfy none of those server-side guarantees. Android/AAB and iOS distribution require separate platform artifacts. No native app has been built.

**Phase 1 decision:** automated functionality and the bounded new correction are evidenced; global localization/accessibility, real devices, F06 and owner acceptance remain OPEN. Phase 1 is **not finally accepted** and is **not release-ready**. Continue from the ordered steps above, preserving all modules, ILLYRIAN identity, stable storage/domain values and historical evidence.

## Final candidate update (supersedes earlier Preview blocker)
Immutable candidate docs SHA `a78935738a8ad9ccd7e86ec7dc1fe461f1acc272`, [Preview](https://illyrian-demo-rbke1i9an-un24.vercel.app/), READY/target null; code-equivalent to tested `00fdf019…`. Authorized root HTTP 200 with exact source prefix (+163 feedback chars), changed Governance JS HTTP 200 and exact source parity. Other 15 referenced assets are unchanged from the 16/16 baseline verification. **Preview selection gate is now VERIFIED for this candidate**, not anonymous/device acceptance. Remaining step 1 above is satisfied by this candidate; proceed to real M01–M18 and the listed OPEN findings. No paid upgrade or protection changes.
