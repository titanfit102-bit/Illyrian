# ILLYRIAN — Agent instructions (scope-limited)

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
6. Preserve Draft PR / isolated Preview only. M01–M18 physical Android/iPhone, real screenreaders, F06 owner permission and explicit final release sign-off remain HOLD gates.

**Foundation protocol v1.1:** a supplementary, selectively applicable work standard when supplied by the owner; it never authorizes backend, native development, new services, release or changes to protected scopes.
