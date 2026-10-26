# ILLYRIAN — Agent instructions (scope-limited)

## DEMO vs APK — permanent owner policy

ILLYRIAN DEMO is a prototype for the owner's private testing of design, navigation and functions, not a production-grade service. The repository is PUBLIC: use fictional data, never secrets or real private content. This policy applies to every subsequent conversation/AI agent until the owner explicitly changes phase.

- Keep development simple, fast and proportional to actual DEMO risk. Do not add advanced security, tests, simulations, architecture or documentation solely to prepare the APK. Preserve existing functions, important regressions, stable data/IDs and approved decisions.
- Keep basic secret/dependency/vendor checks, safe DOM output, input validation, draft/error honesty, compatibility and relevant browser regressions. Do not remove tests/protections or change mandatory checks/release gates without analysis and the required authorization.
- Preserve real-app knowledge in the existing [blueprint §14 map](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#14-knowledge-preservation-and-demoapk-boundary--26-october-2026), roadmap and history. Label VERIFIED (bounded proof), DEMO (simulation), PLANNED (undelivered design) and BACKEND (requires real service). Future security/privacy/data/native requirements remain documented, implemented in the approved phase only.
- Documentation-only changes: verify information destinations, links, decisions/history and documentation-only diff; reuse passing runtime CI for unchanged code. Do not repeat Playwright or full manual audits locally without a technical reason. Remote browser CI may reuse an actual successful unchanged-runtime execution only through scripts/ci/browser_scope.py. Security CI always runs; uncertainty uses full browser checks. Light checks report evidence reuse, not new test execution.
- Runtime changes: run affected browser regressions; deepen tests for changed UGC/storage/permissions/media/dependencies/workflows. Physical tests belong to actual device/acceptance milestones, not every safe edit; untested cases remain OPEN.
- F06 administrative enforcement is deferred to the real-app phase by owner decision; absent rules are not a DEMO development blocker. No automatic merge/release or settings changes. Existing acceptance/release requirements are preserved; professional security/privacy/architecture/testing standards apply when real APK/backend development is explicitly authorized.

## Permanent security governance — 2026-10-25
Read [SECURITY_REGISTER](docs/security/SECURITY_REGISTER.md) before relevant changes. It is the canonical security state; [architecture](docs/security/SECURITY_ARCHITECTURE.md), [threat model](docs/security/THREAT_MODEL.md), [test matrix](docs/security/SECURITY_TEST_MATRIX.md), [release gates](docs/security/SECURITY_RELEASE_GATES.md) reference existing product/QA sources. Assess security impact, implement necessary defenses alongside changes, run risk-relevant checks, record exact-SHA evidence and update the register when status changes. Low-risk cosmetic work does not require a full audit. Never publish sensitive unresolved exploit details. Existing authorizations and protected scopes remain authoritative.
New security-baseline CI checks current-tree secret patterns, bounded static hazards, syntax, vendor parity and dependency advisories; it reuses existing browser QA for UGC/storage. Remote execution and weekly scheduling must be verified separately; schedule is inactive while workflow is absent from main. Branch protection remains approval-only, no automatic merge/release.

These are repository working rules, **not an independent grant of authority**. The current explicit owner instructions and [CURRENT_STATE.md](CURRENT_STATE.md) active authorization section override older notes; GitHub LIVE code/PR/CI takes priority for factual status.

## Identify the correct project
- Work only in `titanfit102-bit/Illyrian`. Current normal-development branch: `feat/i18n-shop-feedback-20261022`, open **Draft PR #1** to `demo/v1.7-illyrian-shop`. Before any action, verify repo, branch HEAD, PR base/state, affected modules and CI.
- Do **not** touch `main`, integration branch, Production, payments, live data, global auth/secrets/SSO, administrative branch protection, costly infrastructure or high-risk/mass changes without separate explicit owner approval. Never merge or publish merely because tests pass.
- This is a static HTML/JavaScript **DEMO v1.7** with fictional fixtures and browser `localStorage`; not an authenticated social service, live moderation/marketplace, deployed backend or Android/iOS package.

## Existing single sources of truth
- Current status/authorization: [CURRENT_STATE.md](CURRENT_STATE.md); operational handoff: [MASTER_HANDOFF.md](MASTER_HANDOFF.md).
- Product, logical data contracts, security/privacy and **future** architecture: [blueprint](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md); DEMO scope/roadmap: [v1.7 roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md).
- Localization: [i18n architecture](architecture/ILLYRIAN_I18N.md). Mobile QA and release HOLD: [acceptance matrix](docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md), [physical worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md); GitHub required-check proposal: [F06 decision](docs/F06_REQUIRED_CHECKS_DECISION.md).
- Do not create parallel copies of these subjects or move/replace the existing continuity paths. Historical sections are an audit archive, not current implementation or authorization.

## Per-change engineering gate
1. Define the smallest permitted change with risk, performance, i18n, privacy, user-generated content and regression impact. Preserve Stories/Reels and established flows; do not use changes in other projects as dependencies.
2. Make small reversible changes only in the authorized feature branch. Keep persisted **domain codes** independent of sq/en/it display text; never translate user-authored strings. Validate local inputs, escape untrusted output, preserve user drafts on errors and do not claim localStorage is secure persistence.
3. Check relevant Playwright coverage, actual `pull_request` GitHub Actions status and exact source SHA. Required-check enforcement (F06) is **not active** unless confirmed from GitHub settings. Do not treat Linux WebKit or viewport simulation as real iPhone, Android, TalkBack or VoiceOver evidence.
4. For performance changes, capture comparable before/after evidence. No fabricated threshold PASS, battery figure, API latency, APK size or benchmark. Future mobile performance budgets remain **proposed**, pending device-baseline selection and approval.
5. Review canonical documentation impact; update `CURRENT_STATE.md` and `MASTER_HANDOFF.md` after **material, verified** changes without duplicating archival history. Record PASS/FAIL/NOT RUN, issue and source SHA. If CI is unavailable, leave tests as NOT RUN/CI BLOCKED until genuinely passed.
6. Preserve Draft PR / isolated Preview only. M01–M18 physical Android/iPhone, real screenreaders and explicit final acceptance/release sign-off remain unverified milestones; no final PASS without proof. F06 settings are deferred as above; existing CI and release-gate mechanisms are unchanged.

**Foundation protocol v1.1:** a supplementary, selectively applicable work standard when supplied by the owner; it never authorizes backend, native development, new services, release or changes to protected scopes.
