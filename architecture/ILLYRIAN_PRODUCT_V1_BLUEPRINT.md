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

## 12. DEMO → Android/iOS implementation map (2026-10-25; readiness design)
This extends the existing M0–M5 plan, not stack selection or authorization to build an APK. Preserve ILLYRIAN identity, icon, all existing screen references and sq/en/it semantics. Android package/AAB and iOS signed app are separate release artifacts; HTML cannot be assumed reusable as native UI.

| Existing journeys | Preserve as acceptance reference | Real implementation required |
|---|---|---|
| Onboarding/Profile/Settings | Fields, consent choices, locale/theme, recovery/error states | Auth/recovery/revocation, account ownership, privacy/deletion; OS secure token storage |
| Feed/Communities/Search | Navigation, posts, filters, memberships and blocks | API pagination/search, server visibility/membership checks, canonical content IDs and moderation |
| Messages/Story replies | Draft, send/retry, quota/error and return paths | Conversation authorization, durable local outbox, client operation ID + server idempotency, delivery status and cross-device sync |
| Stories/Reels | Existing viewers/creator/links/gestures | Authorized uploads, media processing/CDN access, expiry/delete, playback lifecycle; photo demo is not real video |
| Plans/Events/Connections | Capacity/waitlist, drafts, interest→Plan and host context | One canonical Plan object, time-zone contract, transactional capacity, membership-scoped messaging |
| Shop/Shop Plus | Categories, listing forms/inquiry and seller views | Single Seller→Shop→Listing source, ownership, inventory/versioning; keep inquiries separate from gated financial flows |
| Privacy/Map | Coarse manual city, visibility preview, block/request states | Server enforcement, consent, venue audience and no public precise user tracking |
| Governance/Notifications | Reports/appeals/workflows, honest statuses | Restricted queues, audit/appeal lifecycle, operator response, consent-based push and redacted telemetry |

### Data and mobile acceptance prerequisites
Before client implementation, approve MVP and minimum OS/device matrix; preserve DEMO fixture keys as historical references, never import fictional users/listings as real data. Define API request/response/error schemas, ownership matrix, cursor pagination, operation IDs, version conflicts, UTC timestamps/display zones, media limits and deletion lifecycle. Test malformed JSON/types, historical snapshots, storage quota, interrupted write, offline retry, process restart and two-device concurrent operations. A successful local browser write is not server delivery. Unsent text must remain visible after failure; retry must not duplicate a confirmed operation.

Android: select min/target SDK against current Play requirements at submission; runtime permission denial must retain manual city/photo alternatives. Define lifecycle/back navigation, notification permission, app links, offline drafts, signing-key custody and upload signing, AAB/internal testing and staged rollback. iOS: select supported OS/devices and current Xcode/SDK at submission; define safe areas, keyboard, universal links, permission explanations, background limits, secure credentials, distribution signing and TestFlight. No SDK version, paid account or signing identity is approved by this document.

### Store-readiness evidence (official policies consulted 2026-10-25; recheck before submission)
- Google Play: accurate Data safety disclosures and public privacy policy for actual data/SDK behavior; apps offering account creation need in-app deletion and an external deletion-request web resource. Source: [User Data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en), [account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).
- Apple: account creation requires account-deletion initiation in-app; privacy policy in-app/store metadata; UGC needs filtering, reporting, blocking and published contact. Sources: [App Review Guidelines 1.2/5.1](https://developer.apple.com/app-store/review/guidelines/), [account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/).
- For both: implement operator-backed moderation and privacy lifecycle, correct age/content ratings, rights to assets, working support/privacy URLs, review access and release-device tests. Classify digital purchases versus physical goods/services before selecting billing; real payment flows remain separately gated. Check current testing, SDK, billing and regional requirements at release rather than freezing changing rules in this blueprint.

Acceptance artifacts: approved MVP/exclusions; screen→API mapping above expanded for the chosen slice; executable API/schema contracts; threat/permission matrix linked from `docs/security/`; device acceptance evidence using existing M01–M18 plus lifecycle/network/security cases. Measure performance on selected devices before adopting numeric budgets. Auth/API/DB and restore gates must pass before real private data; M5 requires current security baseline, physical accessibility, privacy/operational review and explicit owner signoff. These are requirements, not achieved results.

## 13. Social, community and activity API contracts — Phase 3 design

**BACKEND / design only, 25 October 2026.** Extends §3/§5/§10/§12; no database, API, migration, provider or native build is created. Implement only after the existing real-app gates and owner decisions. DEMO IDs remain stable.

### Canonical records and compatibility

| Record | Minimum future contract / invariant |
|---|---|
| Account/Profile | Opaque server-generated account ID; locale; account status; profile visibility; manual home/origin city references separate from presence/GPS. Roles are scoped grants, never a client toggle. |
| Community | ID, name, category code, public/private visibility, membership policy, moderation state. Education category covers school/university/students/alumni context, with no public minor directory; real age/consent/contact safeguards require a separate policy before real users. |
| Membership | Unique `(community_id, account_id)`; pending/accepted/declined/withdrawn/blocked; server checks private access on every read/write/subscription. Leaving removes future private access; retention/history needs an approved policy. |
| Post/Comment | Post author, optional community ID and authorized activity/listing references; comment parent post ID (optional parent comment ID with cycle/depth limits); content status active/hidden/removed; visibility cannot exceed its parent community. Report/hide reuse canonical content IDs. |
| Activity | Opaque ID, organizer account, optional community ID, city ID, venue visibility, local start date/time, IANA zone, resolved UTC start/end, version, capacity and draft/published/cancelled/completed state. Public venue is distinct from personal GPS. |
| Participation | Unique activity/account pair, pending/accepted/declined/waitlist/withdrawn; attendance stored per activity/account, not a globally reused participant ID. Acceptance reserves capacity transactionally; waitlist promotion is not automatic acceptance. |
| Invitation | ID, activity, inviter, invitee, pending/accepted/declined/revoked/expired, expires_at UTC; inviter capability, recipient preference, blocks and expiry checked on server. Invitation acceptance does not bypass capacity or organizer approval. |
| Interest | Account, topic code, manual city ID, availability interval/zone, expires_at UTC, withdrawn_at; expired interests do not count toward matching or create activities/invitations. DEMO counters remain fictional. |
| Notification/Outbox | Event ID/version, recipient account, type, referenced object, created_at, read_at, delivery attempts; transactional outbox and unique `(event_id, recipient_id, channel)` prevent duplicate effects. No private body/precise location in lock-screen pushes. |

Legacy mapping must be explicit and non-destructive: `(source_store, object_type, legacy_id) → canonical_id`. Never assume core Events `e1/e2/e3` and Plans `demo-football/p…`, community `c…`, Privacy group IDs or Shop IDs share an identity. Keep original status/domain values alongside mapped codes and migration version; unknown values remain preserved, not silently converted to pending/accepted. Synthetic fixtures are not migrated as real users/content. The DEMO's optional post `communityId` is an additive reference; existing posts without it remain valid.

### Proposed versioned API surface and negative tests

All routes below are **proposed contracts**, not reachable services. Reads use bounded cursor pagination; lists/search filter authorization before results/counts. Mutations validate input limits, server session, ownership, membership, blocks/suspension and object version. Return a stable error code, request ID and field errors without secret/private payloads. Domain errors include UNAUTHENTICATED, FORBIDDEN/NOT_FOUND according to privacy policy, VALIDATION_ERROR, CONFLICT, CAPACITY_FULL, EXPIRED, CANCELLED and RATE_LIMITED; never return success before durable commit.

- `GET /v1/communities`, `/communities/{id}/posts`, `/posts/{id}/comments`; `POST /communities/{id}/posts`, `/posts/{id}/comments`, `/reports`; membership decisions restricted to authorized community staff. Outsiders and blocked accounts must fail direct-object reads/writes, including search/deep links/realtime.
- `POST /v1/activities`, `PATCH /activities/{id}` with expected version; participation request/withdrawal, invitation response and organizer decision endpoints derive actor from session. Test two concurrent last-seat accepts; exactly one capacity allocation succeeds. Retried idempotent requests reuse their original result without replaying notifications.
- `GET /v1/activities?city_id=…` works with manual city and no geolocation permission. Optional nearby request supplies a coarse location only after explicit user action; precision/radius bounds, purpose and lifetime are enforced. No automatic public coordinates or movement history; revoke stops collection and clears transient coordinates. Feed, Shop, Messages and Plans remain usable without GPS.
- `GET /v1/notifications`, mark-read and authorized conversation/group-message endpoints check recipient/membership per object and subscription. Cancellation/acceptance/decline messages are generated from committed events through outbox, not client toast state. Push permission denial leaves in-app state usable.

Idempotency keys are scoped by authenticated actor + operation + payload digest, with approved retention; a reused key for a different payload conflicts. Rate/size limits and spam/report controls apply proportionately. Moderation decisions require capability, reason, immutable operational audit and appeal path. Client role switches, local messages and local reports prove none of these server controls.

### Time, recurrence and location acceptance

- Keep local date/time + IANA zone + UTC instant; changing display language or viewer timezone never changes the event instant. Do not interpret city activities with `Date.parse(localDateTime)` in the viewer's timezone. IANA rules/zone database and the submitted offset/version must be recorded by the real service.
- DST gaps and duplicated wall times need explicit resolution. The bounded DEMO rejects both rather than guessing; the real API must reject invalid times or require an explicit approved disambiguation/offset. Invalid historical records remain untouched and must not appear as actionable upcoming events.
- Recurrence is a separate future contract: series ID, zone, local start, recurrence rule, until/count, per-occurrence ID and exceptions. Generate bounded occurrences in the series zone across DST; one cancellation must not cancel all instances unless explicitly requested. Organizer edits, attendee lists and notifications use occurrence IDs/versioned semantics. **DEMO “Organizo sërish” only copies a draft with date/place/capacity requiring confirmation; no scheduler, auto-invite or recurring subscription exists.**
- Test viewer zones Europe/Rome, America/New_York and Asia/Tokyo; spring gap, autumn duplicate, midnight/date boundary, invalid leap/calendar date, expiry at exact instant, cancellation/waitlist, retry and concurrent changes. Device clock is untrusted for real enforcement; server time decides deadlines.
- Manual cities in Feed, Shop, Plans and Connections are presently separate scoped filters; do not silently overwrite one from another or publish them to profiles. A future shared preference is a product decision with versioned compatibility, not a destructive DEMO merge.

Implementation reference for explicit timezone formatting: [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). This specification does not certify GDPR/store compliance, mobile hardware performance or real authorization. Those remain separate release gates.

## 14. Knowledge preservation and DEMO/APK boundary — 26 October 2026

**Owner policy; documentation only.** ILLYRIAN DEMO is a prototype for the owner's private testing of design, navigation and functions. The GitHub repository is currently PUBLIC; “private prototype” does not mean confidential source or secure storage. Keep fictional data and no secrets. [AGENTS policy](../AGENTS.md#demo-vs-apk--permanent-owner-policy) governs subsequent agents until an explicit phase change.

### Information map established before simplification

| Information | Canonical destination / original evidence |
|---|---|
| Active state, blockers, next action | [CURRENT_STATE](../CURRENT_STATE.md); superseded text preserved at the immutable source in the [archive index](../docs/archive/continuity/README.md#consolidation-2026-10-26) |
| Owner decisions, permissions, stable keys and continuity | [MASTER_HANDOFF](../MASTER_HANDOFF.md); original text at the same archive source |
| Functional journeys and migration | This blueprint §7/§12 and the source-to-journey map below; runtime code remains the behavioral reference |
| Data/API/roles/privacy and acceptance | This blueprint §2–6/§8/§10/§12–13; [security architecture](../docs/security/SECURITY_ARCHITECTURE.md), [test matrix](../docs/security/SECURITY_TEST_MATRIX.md) and [device matrix](../docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md) remain authoritative in their scopes |
| Priority / sequence | [Existing roadmap](../demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md), Phase 7/8 and M0–M5; no new roadmap |
| Verified tests / findings / historical authorizations | Existing Phase 1/3 reports, SECURITY_REGISTER, Git commits/Actions and archive; no history deleted |

### Existing screen/action references for future specification

All runtime rows are **DEMO**, with bounded **VERIFIED** browser scenarios, not implemented server capabilities. Paths below are relative to this file. Preserve existing buttons/fields through these sources; expand a screen→action→API/error/permission acceptance matrix for the approved real slice before implementing it. This is traceability, not a claim that every button already has a complete signed-off APK specification.

| Screens / actions to preserve | Existing source / verification | Future status and existing contract |
|---|---|---|
| Home/Feed: Stories → existing composer → Shop → Feed; text/media creation and social actions | [Core HTML](../demo/ILLYRIAN_DEMO_v1.7.html), [flow QA](../qa/illyrian-v17-flows.spec.cjs) | BACKEND: content/visibility/media, §3/§5/§12 |
| Header: Calendar→Events; Opportunities: Businesses/Jobs→Explore, Marketplace/Services→Shop, Interest→intent, Activities→v10-my-plans, Plans→Events, Communities→Explore | Core HTML handler `data-ily-op-category`, [header QA](../qa/illyrian-v17.spec.cjs); eight entries | DEMO decisions preserved; BACKEND per referenced object, no parallel module |
| Onboarding/Profile/Settings: guest demo, profile fields, locale/theme, scoped reset | Core HTML, [i18n QA](../qa/illyrian-v17-i18n.spec.cjs) | BACKEND: identity/recovery/privacy/deletion, §2/§5/§12 |
| Stories/Reels/Messages: viewers, replies, send/draft/retry and return paths | Core HTML, [focus QA](../qa/illyrian-v17-focus.spec.cjs), i18n QA | BACKEND: authorized conversations/outbox/media lifecycle, §12 |
| Communities/Search: posts/comments/member links, School & University c4 and Plan drafts | Core HTML, [Phase 3 evidence](../docs/PHASE3_INTEGRATION_QA.md) | BACKEND: membership/visibility/post/communityId, §13; no separate Forum |
| Events/Plans/Connections: request/accept/withdraw/waitlist/chat, manual cities, expiring interest, repeat-as-draft | [Plans](../demo/ILLYRIAN_PLANS_v1.7.js), [Connections](../demo/ILLYRIAN_CONNECTIONS_v1.7.js), [time helper](../demo/ILLYRIAN_ACTIVITY_TIME_v1.7.js), i18n QA | BACKEND: canonical Activity/Participation/Invitation/Outbox and recurrence, §13; GPS optional |
| Shop/Shop Plus: category-specific listing forms, filters, cart/inquiry, needs and seller workflows | [Shop](../demo/ILLYRIAN_SHOP_v1.7.js), [Shop Plus](../demo/ILLYRIAN_SHOP_PLUS_v1.7.js), i18n/flow QA | BACKEND: canonical Seller→Shop→Listing, §3/§10/§12; payments PLANNED and separately gated |
| Privacy/Map/Governance/Notifications: visibility/block/report/appeal and local status | [Privacy](../demo/ILLYRIAN_PRIVACY_MAP_v1.7.js), [Governance](../demo/ILLYRIAN_GOVERNANCE_v1.7.js), core HTML | BACKEND: authorization/moderation/privacy lifecycle, §2/§5/§13 |

MVP/exclusions, platform/provider, complete field/API schemas, operational ownership and device acceptance remain open decisions/design work. Do not invent them, migrate fixtures into real accounts, or describe PLANNED/BACKEND as real implementation. Existing UGC, IDs, domain codes and storage shapes stay unchanged. Advanced native security, server transactions, load/restore/store requirements are documented now and implemented only in their approved phase.


## 15. Marketplace programme — phase 1 Shop (26 October 2026)

**Phase 1 scope at delivery (current phase 2 authorization is in §16):** that owner request superseded the previous CI-only scope. Five phases are preserved verbatim in the [existing roadmap](../demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md#marketplace-programme--owner-request-26-october-2026). Implement phase 1 only and stop before phase 2. This programme's numbering is independent of historical QA phases. Apply §14/AGENTS automatically. All changes are static DEMO unless explicitly BACKEND/PLANNED below.

### Phase 1 design and bounded execution plan

Keep the existing HTML/vanilla JS modules and independent storage keys. A destructive storage merge is ruled out by the owner's request; a third marketplace would duplicate existing features. Extend the two existing views with consistent category labels/search and reuse one presentation helper for business information. No new dependency, provider, GPS collection or backend.

- [x] Add focused browser regressions for discovery/profile/manual city, category filters, property/job save, unknown salary, literal historical data and separate storage. Verify the failure before implementation.
- [x] Extend `demo/ILLYRIAN_SHOP_v1.7.js`: business directory/profile, accent-insensitive multilingual category/name/product/city/description search, additive property/jobs fixtures and categories, optional job salary; preserve cart/inquiry/edit/delete/rollback.
- [x] Extend `demo/ILLYRIAN_SHOP_PLUS_v1.7.js`: reuse business profile presentation with its own catalog, add property/jobs categories, conditional filters, property fields and optional job salary. Preserve comparison/stock/Kërkoj/reporting/orders and category draft/locale behaviour.
- [x] Localize additions in mirrored sq/en/it catalogs, add only scoped CSS. Run relevant old/new regressions, syntax/secret/vendor checks, then full remote Chromium/WebKit and Security. Inspect Preview metadata and canonical continuity.

**List/Map assessment:** ship useful lists and manual city filtering now. No map mock, mandatory GPS, public precise address or geolocation calls. A real optional Map remains DECISION REQUIRED (provider/cost, location publication/consent, service-area-only sellers, clustered results and accessibility). List remains fully usable if permission is denied or coordinates are absent.

**Prior art, consulted 26 October 2026:** [Shopify filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering) supports product/vendor/availability facets; [Google business representation](https://support.google.com/business/answer/3038177?hl=en) distinguishes a visitable business address from a service area. These inform the proposed UI/optional-location separation, not proof of ILLYRIAN market demand. Existing strategic review O3/O5/O7 informs need discovery, availability honesty and multilingual search; no pilot/monetization assumptions become approved facts.

### Single real catalog — BACKEND specification, not deployed

Extend §3/§10 rather than building another domain. `Seller/Organization → Shop → Listing` is the only authoritative real catalog. Shop/Shop Plus become discovery/advanced/management views over the same records, search index and order IDs, never two production inventories. Product identity/variant is distinct from a seller's offer: compare only canonical `product_id`/variant/condition/unit, never a loose title match. No global comparison of the two DEMO catalogs is introduced.

| Record | Minimum logical fields / invariant |
|---|---|
| Seller/Organization | id, owner_account_id, display_name, business_state, status; existing identity/verification boundaries §2/§5; phase 4 designs verification, no verified claim now |
| Shop | id, seller_id, name, category_codes, city_id, description, contact_policy, service_area, nullable public_location, hours + IANA zone/exceptions, status, version |
| Listing | id, shop_id, category_code, title, description, amount_minor nullable, currency, price_basis, availability_state, declared_at, expires_at, version, status; salary absent is not free work |
| Category attributes | product: variant/SKU, unit, inventory quantity/version; vehicle: year/mileage/fuel; property: sale, area/rooms; rental: area/rooms/period; service: scope/area/request; job: employer/title/city, terms, nullable salary, closing date, inquiry only |
| BuyerNeed / Inquiry | id, author_id, category/city, title/details, optional budget, expires_at, state/version; inquiry references authoritative listing_id/shop_id and permitted conversation; contact is not order/payment/work completed |
| Legacy mapping | (source_store, object_type, legacy_id) → canonical_id + migration_version; retain originals. Same name or same `h1` in separate stores never establishes identity. Fictional fixtures never become real offers/accounts |

Stable category codes proposed for the real API: `product`, `vehicle`, `property_sale`, `rental`, `service`, `job`; display labels sq/en/it never become IDs. DEMO codes stay `Produkte`, `Makina`, `Prona`, `Banesa me qira`, `Shërbime`, `Punë`; existing rental records keep their old code. Additive fields/validation only; no raw rewrite on load or migration of local orders. Real offer/inventory/order records are linked by ID; views do not copy them.

### Screens, actions, states, permissions and acceptance — BACKEND / Android+iOS

| Screen / action | Contract and state | Access / acceptance |
|---|---|---|
| Discovery → search/category/city/sort → results or empty/error/retry | `GET /v1/listings?q=&category=&city_id=&shop_id=&availability=&cursor=` and `GET /v1/shops?q=&city_id=`; bounded facets/pagination, locale-independent IDs, stable results, no paid boost presented as organic | Public results include published/visible records only; manual city without GPS, literal UGC, locale/empty/offline/keyboard/screenreader on Android/iOS; unknown facets rejected |
| Business directory → profile → offers / contact | `GET /v1/shops/{id}`; public hours, optional location/service area, offers and seller-declared availability. Unknown/stale hours or stock explicitly unknown; hours are not guaranteed availability | Read only intentionally public fields; no owner's private account/contact data; contact policy/blocks checked. Time-zone/exception hours tests; missing location never blocks catalog |
| Listing detail → product cart or classified/service/job inquiry | `GET /v1/listings/{id}`, `POST /v1/inquiries` with idempotency key and authoritative IDs; draft→sent→answered→closed/withdrawn/expired; missing/deleted/unavailable produces clear state, preserves social link in future phase 2 | Server validates actor, target state, ownership, blocks/contact permissions and expiry. Never reservation/paid checkout for jobs/property; no CV upload/recruitment subsystem in this scope |
| Publish/edit/withdraw listing | `POST /v1/shops/{id}/listings`, `PATCH /v1/listings/{id}` with expected version; draft→published→paused/expired/withdrawn/removed; unavailable distinct from deleted; server timestamp/version | Owner/authorized seller scoped to that shop; reject cross-shop IDs, client role claims and wrong-category fields. Preserve draft on network/validation/version error; duplicate retry creates once |
| Kërkoj → need → permitted seller reply | `POST /v1/buyer-needs`, `POST /v1/buyer-needs/{id}/replies`; open→answered/closed/expired/withdrawn; server verifies expiry and access | Need owner edits/withdraws own need; authorized seller reply only; spam/contact restrictions enforced later with real service. Android/iOS expiry, retry and own-data access tests |
| Existing demo cart/order/return/promotion | DEMO only; real order/payment/refund and promotion surfaces retain §3/§5/§10/M4 gates | 5% illustrative, not approved. Inquiry ≠ order; simulated return ≠ refund; promoted ≠ verified. No real subscription, payment, advertising or pricing decision |

Real test matrix must cover two-account/shop isolation, denied/absent GPS, optional precise-location visibility, correct category fields, nullable salaries, stale stock/version conflicts, repeated inquiry/create idempotency, deleted/expired targets, private seller fields, malicious UGC, offline retry and Android/iOS screenreader/text scaling. Implement these only for an authorized real slice; current DEMO browser checks do not certify backend/native operation. Provider, actual taxonomy depth, real map, hiring-market policy, MVP breadth and commerce pricing remain DECISION REQUIRED.

### Phases 2–5 — planned at the phase 1 checkpoint

The complete original requirements (including all prohibitions and common verification/documentation rules) remain in the roadmap source above. Phase 2: tagged businesses/products/services in posts/photos, Reel/Story references and transparent promotions; authoritative IDs/ownership/privacy/consent/moderation and unavailable targets; no real ad spend. Phase 3: personal-account staff roles/invites/revocation, shared business inbox, assignments/dedup/notifications, optional public staff identity with internal actor audit; reuse existing admin. Phase 4: declared/verified identity independent of paid Pro; documented real verification, expiry/revocation/appeal and anti-impersonation; Pro pricing/legal/monetization proposals only. Phase 5: unified reports/review/decision/notice/appeal across all named targets/modules, block/mute/privacy/contact/spam/vulnerable-user/age policies; no wealth/spending score; audit/evidence/response deadlines, integration with task 6B support (resolve actual existing surface before any implementation). All are deferred; no phase 2–5 functionality is added during phase 1.


**Phase 1 delivery status:** DEMO implementation and bounded browser verification completed at `01e12709bae867d254f34be3d364c11fcaed74b3` (310 Chromium +16 Linux WebKit +12 classifier; Security PASS). Real catalog/API/permissions/Android+iOS rows above remain BACKEND specifications, not implemented services. List/Map and other listed decisions remain open; phases 2–5 remain PLANNED and were not started. Exact current evidence and Preview belong in CURRENT_STATE.

## 16. Marketplace programme — phase 2 social commerce (26 October 2026)

Owner now authorizes programme phase 2 only; phase 1 remains delivered. STOP before phase 3. Full original requirements remain in the roadmap; apply AGENTS DEMO→APK without expanding into real advertising, payments, subscriptions, verification, staff/inbox or moderation implementation.

**Design/plan:** add a bounded `ILLYRIAN_COMMERCE_v1.7.js` presentation/reference helper; it owns no inventory/order store. Small adapters in existing Shop/Shop Plus resolve/open their own targets. Core post/photo and local Story/Reel editors retain at most one business and one listing reference plus an explicit sponsored-DEMO flag in existing content records. Reuse existing activity linking. Missing/deleted/expired/out-of-stock targets render a clear disabled state, are rechecked on navigation/publication, and never open a similarly named listing from another source. Preserve caption/media/select drafts, quota rollback/Retry, locale, keyboard focus, scroll and return to source content. No URL-based tag navigation, GPS or new dependency.

- [x] Tests first: post/photo tags and source-specific business/listing navigation in sq/en/it; organic vs sponsored Feed/Profile; Story/Reel product and existing activity link, return/reply draft; missing/expired/no-stock/malformed references; quota/retry and deletion during edit; labelled Search placement.
- [x] Implement scoped adapters/helper/core hooks and mirrored locale additions; preserve all old data/IDs/functions without catalog migration.
- [x] Run changed and existing Shop/creator/focus regressions (51 local PASS, including 12 new), syntax/security/vendor/mirror checks, independent diff review; full remote 322 Chromium +16 Linux WebKit +12 classifier and Security PASS on `60bf624b2e8d9b4bdc21f8afe6712cba0897232f`, source-matched Preview READY. Exact links are in CURRENT_STATE. Phase 2 delivered within DEMO scope; stopped before phase 3. Real contracts/permissions below remain BACKEND specifications, physical acceptance OPEN.

### Placement and transparency decisions

| Surface | Safe DEMO mechanism | Real-app design, not enabled |
|---|---|---|
| Feed | Owner-created tagged post/photo; explicit “Sponsored · DEMO” plus paid≠verified disclosure | Sponsored insertion with advertiser identity/label, eligibility, targeting consent, placement limits/frequency, organic ranking separation and reporting |
| Search | One clearly labelled contextual example referencing existing Shop Plus promoted offer, only in Businesses search and matching query | Relevant paid slot separate from organic results; no misleading empty-search replacement; paid rank disclosure |
| Shop | Reuse existing promoted-DEMO listing chips/stock and catalog; no extra paid catalog | Same canonical listing and ad eligibility, no copied products/orders |
| Profiles | Existing own-post list renders the same tag/disclosure; no second promotional profile inventory | Business-owned eligible content/campaigns with same visibility/consent checks |
| Social photos/Story/Reel | Explicit caption-adjacent link, not inferred face/object recognition; product/service references; existing activity references retained | Optional positioned photo tags with accessible equivalent, canonical reference; invalid/deleted target never breaks media/story |

No cash ad auctions, payment activation, ad accounts, pricing, tracking pixels, subscriptions or arbitrary trust scores. A sponsorship flag is a simulated content label, not approval, identity verification or product-quality guarantee. Existing trust badges are a separate phase 4 review; sponsorship never sets them.

### Canonical real references / APIs / permissions — BACKEND, not deployed

`ContentReference(id, content_type, content_id, target_type, target_id, target_version, creator_id, approval_state, visibility, status, created_at)` links authoritative Shop/Listing/Activity IDs. No snapshot becomes a second product. `Promotion(id, advertiser_shop_id, content_id/listing_id, placement, disclosure, eligibility_state, schedule, status, audit_actor)` is separate from business verification/subscription. Monetary/billing/provider fields remain conditional on separate approval. Proposed states: reference draft→pending-consent→approved/rejected→revoked; promotion draft→pending-review→approved→active/paused→ended/removed; target published/unavailable/expired/withdrawn/deleted remains authoritative and independently checked.

| Screen / action | Proposed contract | Required permission / test |
|---|---|---|
| Compose/photo → select business/product/service → preview/publish | Existing content API with bounded target references; resolve through `GET /v1/reference-targets` and authoritative `POST /v1/content/{id}/references`, version/idempotency key | Content author only; check target visibility/existence, shop ownership or permitted mention, business consent where required, block/suspension and moderation both on publish and read. No client-owned role claims |
| Tap tag → profile/listing/activity → back | `GET /v1/references/{id}/target` checks access and current availability; opaque safe IDs, allowlisted in-app routes | Denied/deleted/private/expired target yields bounded state with no private title/price leak or fallback to unrelated ID; preserve source media position/reply draft/focus on Android/iOS |
| Story/Reel product/activity link | Same canonical reference contract and content visibility/lifecycle; references cannot extend Story expiry | Private activity/membership/consent checked before disclosure and navigation. Keep existing Activity IDs separate from legacy demo event IDs |
| Sponsored placement/notice/report | Policy-governed campaign eligibility/review, always rendered server-authoritative disclosure; shared report/support path in phase 5/6B | Paying cannot grant verification, bypass safety review, privacy or organic limits; report/appeal/revocation audit, no public verification documents |

**Android/iOS/backend acceptance before real delivery:** two-account/shop ownership isolation, forged/cross-source IDs, private/blocked/revoked consent, concurrent delete/stock/expiry between preview and publish/click, idempotent retry, unsafe deep links, literal UGC, offline retry, accessibility labels/focus/text scaling, returning to Story/Reel playback and preserving unsent replies, disclosure across every placement and organic-content exclusion. DEMO references use `{source:shop|shopPlus,type:listing|business,id}`; business IDs are the existing exact local store names, **DEMO-only**, not authoritative legal identity. Real migration requires §15's explicit source mapping; no name-based inference or fixture migration to real businesses.


## 17. Marketplace programme — phase 3 business team and shared inbox (26 October 2026)

Owner now explicitly authorizes phase 3 after phase 2; STOP before phase 4. Original requirements stay verbatim in the existing roadmap. Apply AGENTS automatically: practical UI in DEMO; real identity/authorization/concurrency in BACKEND specifications. No phase 4 verification/Pro or phase 5 moderation implementation.

**Design choice:** extend Governance → Work panels → Business, the existing administration surface, with a source-qualified shop selector and fictional personal-account selector. Shop/Plus business profiles link to that same panel and restore their underlying view on close. A separate admin app would duplicate Governance; modifying the personal Messages store would risk unrelated private content, so neither is used. Optional `businessTeams` lives in the existing governance store; no new catalog/order/private-DM store or password sharing. Local team fixtures are explicitly fictional and never imply real ownership. Role restrictions apply to this demonstration panel only, not authorization of the rest of the DEMO.

**Bounded execution plan (vanilla JS/CSS, current locked Playwright, no dependencies):**
- [x] Add 13 browser cases in `qa/illyrian-v17-i18n.spec.cjs` first: existing Shop/Plus → shared panel → back in sq/en/it; pending invite/self acceptance/role/revocation; assignment and shop sender with internal actor audit; public profile opt-in separation; quota/Retry exactly once; observed stale-tab rejection; malformed stored data/literal UGC; locale/draft/focus. Confirm expected RED before code.
- [x] Extend `demo/ILLYRIAN_GOVERNANCE_v1.7.js` state/persistence, existing business work panel and handlers; integrate source-qualified links/public staff presentation into existing Shop/Plus business profiles; small nested-dialog guards and existing Governance CSS. Add mirrored sq/en/it `businessTeam` semantic strings. No real messages, invitations or notifications leave the device.
- [ ] Run new and affected Governance/Shop/commerce/focus tests, syntax/vendor/mirrors/basic security and independent diff review; one coherent runtime commit on the authorized branch; full remote CI and same-SHA isolated Preview; update existing canonical evidence, report, STOP before phase 4.

### Screen/action/permission map

| Screen / action | DEMO | Real APK / backend contract, not implemented |
|---|---|---|
| Business team: invite existing personal identity, accept, change role, revoke | Fixed fictional IDs, owner-only staff management; invited person accepts as self; no email/password/account creation; owner cannot remove self | `ShopMembership(id,shop_id,user_id,role,status,public_opt_in,version,created_by,revoked_at)`; unique shop+user; `ShopInvitation(id,shop_id,invitee_id,role,status,expires_at,inviter_id)` with pending→accepted/declined/expired/revoked. `POST /shops/{id}/invitations`, `POST /invitations/{id}/accept`, `PATCH/DELETE /shops/{id}/members/{id}`. Authenticated subject + shop capability checked on every operation, invitations single-use, no self promotion/last-owner loss. Ownership transfer and recovery require a later explicit product decision |
| Role/capability preview | owner/admin: products, prices, orders, messages; catalog: products/prices; support: order read/messages; viewer: catalog read. Staff/sensitive management owner only; internal audit owner/admin. Existing catalog/order actions stay in their established modules | Server policy for `catalog.read/write`, `prices.write`, `orders.read/manage`, `messages.read/reply/assign`, `members.manage`, `audit.read`, sensitive data separate. Role names are a proposed starting matrix, granular delegated staffing/sensitive permissions require approval; UI hiding never authorizes API access |
| Shared inbox, assignment, reply | Fictional customer threads per source+business; claim/assign to active messaging member; reply only when assigned to self; answered state blocks repeat send. Pending count is local UI feedback, not delivered notification | `BusinessConversation(id,shop_id,customer_id,status,assignee_membership_id,version,last_message_at)` and `BusinessMessage(id,conversation_id,sender_type,sender_shop_id,internal_actor_id,body,client_message_id,created_at)`; open→assigned→awaiting_customer→closed/reopened. Existing canonical conversation infrastructure, with business principal, not parallel DM architecture. `GET /shops/{id}/conversations`, `PATCH /conversations/{id}/assignment`, `POST /conversations/{id}/messages` check member+customer scope; expected version/transaction and unique client_message_id prevent duplicate replies; lost claim returns 409 without losing draft |
| Customer-facing sender vs internal history | Customer preview shows shop name; actor recorded separately in local admin history and visible only to owner/admin in this panel | Customer projection omits internal actor identity, membership/admin metadata; shop name authoritative. Append-only authorized audit `AuditEvent(id,shop_id,actor_id,action,target_id,before_version,after_version,at,request_id)` for replies, assignments, staff/role/privacy changes. Retention/legal access and incident ownership must be decided before real data |
| Personal public-staff preference | Active member changes own opt-in only; business profile exposes only opted-in active fictional display names/role; never inbox/audit/invitation details | `PATCH /shops/{id}/members/me/public-profile`; public projection only consented profile fields with independent profile privacy/blocking. Opt-out/revocation clears caches/indexes, never erases owner/legal audit identity |
| Notifications and immediate revoke | Local pending count; revoked session loses panel access on next action/storage event, stale snapshot rejects writes; no atomic/security guarantee | Notification/outbox event with recipient membership/version, unread/read/dismissed, dedup and preferences. Revoke transaction invalidates membership/session subscriptions, push/websocket access and assignment eligibility immediately; all API/media reads and writes reauthorize current membership, no cached role authority or post-revocation queued reply |

**State/storage boundaries:** legacy governance cases/appeals/audits/drafts and both catalogs retain old IDs/keys. New content is bounded/escaped and normalized in memory without rewriting raw data on load. Failed storage writes roll back and preserve form/focus for Retry; observed sequential stale writes fail closed, not true CAS. LocalStorage and role switching are editable simulations, not security or private communication. No staff catalogue edits, real orders, push services, invitation delivery, tracking, authentication service or paid resource is built.

**Android/iOS/backend acceptance:** two real personal accounts and two shops; owner/admin/catalog/support/viewer denial matrix; forged IDs/role escalation/cross-shop inbox/audit/private-DM isolation; invite replay/expiry/decline/revoke/last-owner checks; assignment races, idempotent double-send, revoke between draft/claim/send/offline-retry; notification recipient/duplicate/read consistency; public opt-out/profile privacy/cache invalidation without hiding audit actor; unsafe UGC, accessibility, text scaling, nested focus/back and draft retention; server transaction/audit failure must not send or show success. Physical devices, real privacy/security, provider, retention, transfer/recovery and operational/legal policies remain OPEN/DECISION REQUIRED. Phases 4–5 remain PLANNED.
