# ILLYRIAN — Product Architecture Blueprint v0.1 (decision draft)

**Date:** 22 October 2026 | **Stage:** Phase 8 design, NOT product implementation | **Status:** Proposed for validation
**Source of truth for demo:** demo/ILLYRIAN_DEMO_v1.7.html and demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md on branch demo/v1.7-illyrian-shop.
**Isolation:** This blueprint belongs exclusively to ILLYRIAN; do not use code, credentials, infrastructure, repositories or accounts from any other project.
**Proof boundary:** v1.7 is an interactive local-storage demonstration. It has no production identity, shared database, verified business, marketplace settlement, real moderation, or certified native app. Tests on the demo do not prove production security.

## 1. Product thesis and release principle

Albanian-speaking people and local sellers in Albania, Kosovo and diaspora use ILLYRIAN to connect through community posts and plans, discover relevant local goods, housing, vehicles and services, and transact only when trust and fulfillment have been validated. Retention depends on useful community content, reliable plans, and accurate listings, rather than feature count.

**Initial proof of value:** a member can sign up, discover useful local content and plans, communicate or request participation, and find trustworthy listings. Each action must be backed by real shared state and real server authorization, not browser localStorage.

**Commercial rule:** demo's illustrative 5% Shop commission is NOT an approved rate. No live collection, payments, subscriptions, escrow or payout until a separate regulatory/commercial decision. Vehicles, accommodation and services begin with inquiries only.

## 2. Actors and permission boundaries

- **Visitor:** read only intentionally public content and publicly available listings; cannot post, message, order or see private membership.
- **Member:** manage own account/profile/privacy, own content, follows, conversations and plan participation; create reports and block users.
- **Plan organizer:** edit only plans they own, manage requests/capacity, send permitted group messages; role cannot be obtained by client-side UI toggle.
- **Seller / business manager:** manage verified-owned shop and its listings; no access to another seller's inventory or inquiries.
- **Moderator:** review restricted queues with least privilege, record reasons, impose appealable actions; not a database superuser.
- **Admin / operations:** separately authenticated privileged operations with stronger protection and full audit trails.
- **System workers:** explicit service identities scoped only to media, notifications and event processing.

Account suspension, block relations, content privacy, plan membership, seller ownership and moderation are enforced on the SERVER for every request, including websocket/realtime subscriptions.

## 3. Domain and data contracts (logical, not deployed)

**Identity:** account(id, created_at, status), profile(account_id, name, locale, city_visibility), privacy_preference(account_id, rules), account_block(blocker_id, blocked_id), follow_request(from_id, to_id, status).
**Community:** post(id, author_id, visibility, status), media_asset(id, owner_id, storage_key, content_type, scan_status), comment(id, post_id, author_id, status), reaction(account_id, target_id, type), story(id, expires_at), reel(id, processing_status).
**Plans:** plan(id, owner_id, city, venue_visibility, starts_at, capacity, status), plan_request(plan_id, member_id, status), plan_attendance(plan_id, member_id, state), plan_group_message(plan_id, author_id, body).
**Messaging:** conversation(id, type), conversation_member(conversation_id, account_id, state), message(id, conversation_id, sender_id, body, delivery_state).
**Marketplace:** seller(id, verification_state), shop(id, seller_id, status), listing(id, shop_id, type, status, city), listing_media(listing_id, media_id), product_variant(id, listing_id, sku), inventory(variant_id, quantity_version), inquiry(id, listing_id, sender_id, status).
**Commerce — gated, not MVP settlement:** cart(id, owner_id), order(id, buyer_id, seller_id, payment_state, fulfillment_state), order_item(order_id, variant_id, unit_amount, currency), refund(id, order_id, status). These entities are DESIGN ONLY until payments/compliance are approved.
**Safety / governance:** report(id, reporter_id, target_type, target_id, reason, state), moderation_case(id, assigned_to, decision, appeal_state), moderation_audit(id, actor_id, action, target, timestamp), data_request(id, account_id, kind, state).

Invariants: IDs are opaque; timestamp is server-generated; ownership never comes from a trusted client claim; all changes use transactional server checks. Plan joins never exceed capacity under concurrent requests. Inventory reservations cannot go below zero. A blocked/suspended identity cannot bypass access by deep link or direct API query. Every moderation action has a reason and immutable operational audit. Deletes use a documented lifecycle for user rights and legal retention where applicable.

## 4. Architecture alternatives and provisional direction

**Option A — web/PWA-first + server API:** fastest way to preserve interactions from the existing HTML demo, lowest initial client rewrite. Downsides: mobile video/notifications/platform integrations and high-end gestures may require compromises.
**Option B — Android-first React Native/Expo client + admin web:** better mobile installation, camera/video and native navigation, with iOS path later. Downsides: the 660 KB static HTML demo is a visual/behavioral reference, NOT native reusable UI; substantial screen reconstruction required.

**Recommendation pending explicit product sign-off:** pursue a small cross-platform native client for a validated Android-first pilot, retain web-based QA/admin and a public informational website. Do not confuse converting HTML to APK with creating a secure real product. The actual framework decision is **provisional**, subject to platform needs, maintenance budget and current SDK/app-store verification.

**Backend candidates:** managed relational platform with PostgreSQL/RLS and object storage versus a modular API service on PostgreSQL with dedicated authorization. Start with one coherent domain boundary, not microservices. Provider choice and deployment remain **OPEN**, and infrastructure must be exclusive to ILLYRIAN. Add asynchronous workers for media and notifications only once needed. Do not place privileged database keys or payment secrets in mobile clients.

## 5. API, privacy and trust controls

### Minimum threat model — current DEMO vs future real product (2026-10-25)

This table classifies requirements only; it does **not** claim deployed protection for server-side threats.

| Threat / trust boundary | CURRENT DEMO — verifiable scope | FUTURE REAL APP — prerequisite, NOT IMPLEMENTED |
| --- | --- | --- |
| Fake identity, cross-account access, seller/organizer role spoofing | Browser guest/session and role UI are simulated; localStorage gives **no** server authorization | Authenticated server session; per-resource membership and ownership checks; negative tests using two distinct accounts |
| User-authored content and stored data | Browser QA covers selected encoding and malformed localStorage failures; complete media/HTML injection audit not certified | Validated inputs/outputs and uploads, ownership, size/type limits, abuse reporting, moderation and audit trail |
| Sensitive location, private groups, messages | Illustrative controls with fictional data, not a privacy guarantee | Least-privilege access, location minimization, per-conversation membership, retention/export/deletion rights and applicable legal review |
| Stale updates, double booking and inventory | Browser localStorage sequential conflict tests only, **not atomic distributed transactions** | Server transactions, idempotency, capacity/inventory constraints and concurrency regression tests |
| Supply chain, signed packages, incident recovery | Static repo with PR browser workflow; no native release build or app signing | Pinned/reviewed dependencies, least-privilege CI, release signing, secrets isolation, backup/restore and incident runbooks |
| Commercial abuse / refunds / payments | Only fictional Shop UI. No legitimate checkout/settlement | Separate business/legal/owner decision, vetted payment provider, disputes/refunds, fraud controls; NOT NOW |

**Decision boundary:** the future technical stack, payments, legal obligations and release scope remain subject to owner approval. An external protocol cannot authorize them.


- API authentication/session issuance by a real identity service; short-lived credential rotation and revocation; server-side authorization by ownership and membership.
- Explicit privacy for public/private profiles, follow requests, group membership, plan venue visibility; no publishing precise member GPS coordinates.
- Signed, access-checked media upload; content-type and byte limits; malware/abuse screening where appropriate; deletion and media retention workflow.
- Rate limits, spam detection, reporting/appeals, block enforcement, seller verification and conflict-of-interest separation for moderators.
- Private messaging restricted to authorized conversation members; message delivery, reporting, blocking, deletion and abuse handling designed before activation.
- GDPR and local regulatory requirements for target markets require professional review; this file makes no claim of legal compliance.
- Logs redact secrets and sensitive content; privacy export/deletion has explicit service-level tests and response obligations to be defined.
- Operational observability: server request IDs, redacted structured logs, alerting, error budgets and incident/rollback procedures.

## 6. MVP sequencing, proof gates and out-of-scope

### Foundation gate crosswalk (design vs evidence — 2026-10-25)

These are **labels for the existing M0–M5 gates**, not permission to begin a native build. A browser DEMO can pass browser QA while all native/backend release gates remain open.

| Foundation gate | Existing ILLYRIAN gate | Current evidence and boundary |
| --- | --- | --- |
| G0 — product ready to build | M0 → approved M1 scope | **PARTIAL / DECISION REQUIRED**: product thesis and draft blueprint exist; target geography, MVP scope, platform/provider and user validation need owner decisions |
| G1 — real engineering baseline | M1–M2 | **NOT IMPLEMENTED for real app**: no native AAB/APK, real API/auth, backend tests, signing plan or real mobile security checks; static DEMO Chromium/WebKit CI does not count |
| G2 — safe integration/change | DEMO Phase 7 / F06 | **PARTIAL**: GitHub Actions PR checks pass; `demo/v1.7-illyrian-shop` has no required-check enforcement; F06 needs explicit owner authorization |
| G3 — physical-device release | M5 | **NOT TESTED / RELEASE HOLD**: M01–M18 on Android/iPhone, actual screenreaders, real-app performance/privacy/security/store checks and owner sign-off outstanding |


**Gate M0 — validate demand:** interviews/pilots with real buyers, local businesses and community hosts; collect evidence of repeat use, inventory supply and moderation workload. Confirm primary launch geography and data requirements. No live payment obligations.
**Gate M1 — product foundation:** approved PRD, threat model, accounts/profiles, access matrix, public content, reports/blocks, admin audit, privacy/deletion; integration tests prove that one user cannot read or mutate another user's private resources.
**Gate M2 — community loop:** plans/events, capacity transactions, membership messaging, notifications, real media processing and usable Android client. Verify two concurrent requests for last plan seat and blocked-user behavior.
**Gate M3 — marketplace discovery:** verified seller organization, products and catalog, real inquiry path for cars/housing/services, listing quality and reporting, search and moderation. No checkout or payouts yet. Measure active sellers, inquiry-to-response and successful user outcomes.
**Gate M4 — transactional commerce decision:** only after commercial validation and separate verification of payment provider availability, KYC/KYB, fulfillment, fees, taxation, cancellations, disputes, refund policy and liabilities. Use licensed providers; commission rate is an open business decision.
**Gate M5 — release readiness:** security testing, accessibility (real screen reader + keyboard), performance on target phones, backups/restore, incident playbook, privacy review, app-store release checks, observability, staged rollout and written sign-off.

Explicit **NOT NOW**: microservices, complicated recommendation AI, real estate/vehicle payments, self-built wallet/escrow, mass international launch, fine-grained individual location and public real-time identity tracking.

## 7. Migration from demo to real product

Treat current screen flows and 25 Playwright cases as acceptance references, not production code. Version visual tokens (crimson #E50C37, coral #F9644F, burgundy #2A0B18, midnight #0B050A), navigation semantics, empty/error states and user journeys. Replace localStorage fixtures with API-backed state per bounded module, preserving the same user-visible behavior and adding security/error states. Never mix demo identities with real accounts or migrate fictitious listings as genuine offers.

Recommended build order: authentication/privacy first -> content/media -> plans/requests -> messaging -> Shop discovery and seller identity -> moderation/support -> optional financial flows.

## 8. Measurable acceptance and open decisions

### Performance evidence and candidate budgets — no claimed pass (2026-10-25)

- **CURRENT DEMO:** QA Lab displays browser Navigation Timing as **INFO**, not a measured device performance budget. Automated tests cover screen reachability and some 200% CSS scaling; they do not certify battery, memory pressure, startup time on actual phones, or real network latency. Avoid changing code just to satisfy speculative benchmarks.
- **FUTURE REAL APP:** before implementing a native/client/backend performance gate, select and record **two benchmark devices, OS/browser/app build versions, network profile, content fixture, measurement tool, baseline and repetitions**. Measure cold/warm start, first useful screen, p95 tap feedback, scroll-jank rate, memory peak, MB per media session, battery/background cost, package size, crash-free sessions/ANR and API p95 after backend exists.
- **Candidate pilot targets — PROPOSED, NOT APPROVED, NOT TESTED:** useful first screen p75 ≤3 s on the selected midrange device/profile; tap-feedback p95 ≤100 ms; crash-free sessions ≥99.5% once meaningful sessions are available. These are initial hypotheses for measurement **only**; confirm feasibility, device conditions and targets with the owner before enforcing CI/release gates. Do not pretend p95 API, AAB size or network-use budgets exist before their baselines.
- **Change review:** whenever DEMO code adds large assets or expensive UI work, compare identical-browser/same-fixture baselines before/after and report relative change. A documentation change alone does not constitute a benchmark. Native release needs recorded physical measurements and an agreed fail threshold before M5 sign-off.


Success criteria for initial pilot: >90% completion of one meaningful first-session action among test participants; no unauthorized API read/write in security test suite; 100% seller ownership isolation in regression tests; no unhandled critical accessibility blocker in tested journeys; backups successfully restored in a non-production exercise. These are **proposed gates, not achieved metrics**.

**Decisions still requiring owner validation:** target launch geography and minimum viable feature mix; Android-first vs web-first; authentication methods; businesses' willingness to supply real inventory; messaging moderation policy; whether commercial payments are included in the first monetized release; operating and support budget. We can research options without committing vendors, spending money, merging to main or deploying a real backend.

## 9. Evidence and status

Demo Phase 7 automated functional evidence: GitHub Actions run #39833964922, 25/25 Playwright tests PASS, including 126/126 baseline and 147/147 advanced QA Lab assertions. This is NOT a production security or visual accessibility certificate.
Pending Phase 7: human visual sign-off (including screenshot comparison), real phone testing at the end of the demo build, real touch and screen reader tests, performance and release approval.
Phase 8 blueprint status: DESIGN DRAFT; no backend, production DB, real transaction, release or separate app repository was created as part of this design.



## 10. Consolidated architecture decisions — 23 October 2026 (approved direction; not implementation)
**Authority:** Owner accepted the compatible principles of `MASTER ARCHITECTURE UPGRADE`, `MASTER ARCHITECTURE ADDENDUM 02`, and reviewed the independent `ILLYRIAN_MASTER_ARCHITECTURE_REVIEW_AND_EXECUTION_PLAN` (Work report, snapshot 4a951e4). This section records AGREED PRINCIPLES, PROPOSALS, and OPEN DECISIONS separately. It does **not** automatically approve all features or revise prior production gates.

### ACCEPTED — design principles / future requirements
- One integrated ILLYRIAN ecosystem connecting profiles, posts, stories/reels, communities, plans, messaging, and IllyrianShop. Preserve v1.7 DEMO and the distinct project's history; never restart the product from scratch.
- Architecture internationalized from the beginning: canonical semantic UI keys, sq/en/it with technical English fallback, saved preference over device detection, locale-specific number/currency/date/plural formatting, and RTL-ready design without claiming RTL production support. User-generated posts, messages, listings and names are **not** auto-translated by the UI adapter. Support for 100+ future languages is an extension capability, not a deliverable today.
- A single user identity with **scoped** organizer, creator, seller, organization, moderator and admin capabilities. Server-side enforcement on each protected object/action, not client role toggles.
- Shared logical foundations across modules: stable opaque IDs and domain codes independent of language; privacy/permissions, settings, notifications, reporting/moderation, data lifecycle, safe deep links, telemetry/analytics event definitions, media/storage, cost/observability. Build only the minimal implementation each release actually needs.
- Analytics defines versioned event contracts and KPI denominators first; report aggregate profile visits/reach rather than exposing visitor identities. Personal, Creator, Business, and Organizer dashboards share metrics and data protections, but only relevant role views are enabled when the backing functionality exists. DEMO mock analytics must be clearly labeled.
- IllyrianShop stays **inside** ILLYRIAN, never an APK store. Unified `Seller/Organization → Shop → Listing` domain and catalog for Shop and Shop Plus as the real-product target; do not build two production inventories. Distinct workflows: physical product/cart/order; cars/property/classifieds/inquiry; service/rental/request/availability. A social post/reel can reference an authorized listing by ID without copying canonical product data; deleted/unavailable listing must not break the post.
- Separate payments and payouts from catalog/inquiry. The DEMO's illustrative 5% fee is **not** approved pricing. Live checkout, revenue claims, payouts, KYC/KYB, buyer protection, dispute/refund, regional provider support, compliance (GDPR/DSA/GPSR where applicable) each require explicit release gates. No self-operated handling of sensitive card data.
- Privacy/security-by-design, proportionate abuse/fraud controls and owner-scoped admin/moderation. Prefer understandable architecture, modular backend boundaries, relational data integrity, reversible migration, managed primitives as appropriate. Avoid speculative microservices, AI recommendation infrastructure, expensive cloud provisioning and parallel backend systems.
- Real product and DEMO have separate evidence gates: browser demo fixtures/localStorage are not real multi-user authorization. Preserve UX and verified journeys when migrating to real clients; HTML DOM cannot be assumed to transfer directly into React Native.
- Track every change with branch/PR, tests tied to exact SHA, architectural decision record and handoff. No merge to `main`, Production, irreversible migration, vendor subscription, public-release change or spending without express owner authorization.

### ACCEPTED — execution order
`P0-D`: repair proven Shop/i18n regressions, protect stable select values and user content, handle storage errors honestly, improve CI correctness (including PR trigger and canonical locales), define deploy candidate; do not remove existing functions.
`P1-D`: finish sq/en/it forms and critical dynamic states; Shop/Shop Plus demo consistency, Settings scope, only useful illustrative dashboards; regression, visual, accessibility, Android phone review and screenshots by owner, then demo release gate.
`P0-R/P1-R`: once validation and platform/geography choices are recorded, evaluate a mobile-first React Native/Expo+TypeScript client versus Web/PWA, Postgres-backed modular backend with scoped authorization, media, notifications, recovery and operations; deliver a limited real vertical slice, then pilot.
`P2/P3`: validated social-commerce expansion, transactional payments only after business/legal/provider gates, richer realtime/video/analytics, additional markets/languages and measured scaling.

### CONDITIONAL — do not implement as automatically approved
- Product differentiation: test an integrated community → content → seller discovery/inquiry loop as a potential early MVP slice, **not** a mandate to ship full Shop checkout. Whether Shop discovery belongs to P1-R or P2 depends on pilot evidence and operating cost.
- React Native/Expo and Postgres/Supabase are strong *candidates*, **not** signed-off stack, project provisioning or vendor spending. Benchmark Web/PWA vs mobile against actual audience, device capabilities, skill and cost.
- Four full dashboards, sophisticated AI ranking, unrestricted DM, video transcode, seller subscriptions and international commerce are not P0 requirements.
- First pilot geography (Albania/Kosovo vs accessible Italian-city Albanian community), audience, minimum feature triad, public visibility/resource classes, licenses, auth provider, financial model, operator budget and legal/regulatory sign-off remain DECISION REQUIRED.
- Original roadmap's Phase 7 DEMO and Phase 8 M0–M5 gates remain authoritative; P0/P1-D/P1-R/P2/P3 labels **map onto** them instead of replacing their history.

### CURRENT EVIDENCE (as of 23 October 2026; refresh at each PR)
- Branch `demo/v1.7-illyrian-shop` remained at `015ce439...` during audit; Draft PR #1 `feat/i18n-shop-feedback-20261022` HEAD `4a951e4...` (not merged).
- Historical Chromium run #39852708170: 53/53 PASS. New run #39857060705: **54 PASS, 2 FAIL** (Shop category select `<option>` translated text became form value in en/it, while domain expects stable original codes). Do not claim full i18n release or 56/56 until a new SHA passes.
- 296 i18n keys / locale across 15 namespaces on PR branch; full UI coverage unverified. Vercel historical READY is older than the PR; preview/candidate URL and root routing require verified release check. GitHub repository is currently PUBLIC.
- Next action: repair the two failing tests without masking them; enforce invariant that UI labels can change but persisted domain values cannot. Then continue safe i18n migration and phone QA.


### 10.1 First post-review verification — P0-D form contract
A targeted patch preserved the pre-existing Albanian domain values in Shop `<option value>` while allowing sq/en/it translated option labels; listing user-authored detail fields have explicit translation exclusions. GitHub Actions #39865986736 on exact code SHA `db574224d4849775224fb6ee4df0247aa2f18c46` reports **57 passed (2.0m)**. The two previous en/it failures are resolved *within the tested Chromium flows*, not a full localized-release or real-device certification. PR #1 remains draft. Pending gates: failed storage persist semantics, other forms' code/label separation, UGC inventory, canonical i18n keys, preview currency/access, visual/a11y/device verification.
