# ILLYRIAN

**Social, community and marketplace platform for Albanian-speaking people and diaspora, with international expansion as a product ambition.** The goal is to connect community content, plans, conversations and useful listings through one coherent identity and domain model. Current repository work is the **v1.7 static browser DEMO**, not a released Android/iOS app, live backend or real payment platform. It uses fictional content and browser `localStorage`.

## Start here — reading order and authoritative documents

A new developer or ChatGPT session should follow this order, verify GitHub LIVE, and apply the latest explicit owner scope before editing. Dated QA/research reports and archived checkpoints are evidence/history, not new authorization or the current task.

| Order / purpose | Existing source |
| --- | --- |
| 1. Working rules, DEMO → APK policy and protected scopes | [AGENTS.md](AGENTS.md) |
| 2. Live checkpoint, active authorization, CI/Preview and exact next step | [CURRENT_STATE.md](CURRENT_STATE.md) |
| 3. Durable product decisions, authorization history and continuity | [MASTER_HANDOFF.md](MASTER_HANDOFF.md) |
| 4. Requirements, programmes and MVP IN/OUT/LATER decisions | [DEMO v1.7 roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md); [Programme7](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md#programme-7) |
| 5. Product/architecture/domain contracts and source of APK knowledge | [Blueprint](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md): [MVP/map §24](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-61), [notifications §25](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-62), [recovery/Help §26](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-63), [private staff §27](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-64), [readiness/contracts §28](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-65), [documentation audit §29](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-71) |
| 6. Relevant implementation and evidence | [DEMO HTML](demo/ILLYRIAN_DEMO_v1.7.html), module sources below, [i18n architecture](architecture/ILLYRIAN_I18N.md), [security register](docs/security/SECURITY_REGISTER.md), [security design](docs/security/SECURITY_ARCHITECTURE.md) and [test matrix](docs/security/SECURITY_TEST_MATRIX.md) |
| Browser QA and classifier/security checks | [Browser workflow](.github/workflows/illyrian-v17-browser-qa.yml), [security workflow](.github/workflows/illyrian-security.yml), [Chromium configuration](playwright.config.cjs), [WebKit configuration](playwright.webkit.config.cjs) and `qa/` |
| Manual mobile/accessibility and release gates | [M01–M18 acceptance](docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md), [physical worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md), [security release gates](docs/security/SECURITY_RELEASE_GATES.md) and [F06 proposal](docs/F06_REQUIRED_CHECKS_DECISION.md) |
| Recover earlier decisions and full checkpoints | [Continuity archive](docs/archive/continuity/README.md), original Git commits referenced there, historical demo notes/roadmap and [research review](docs/research/ILLYRIAN_PRODUCT_INNOVATION_STRATEGIC_REVIEW_2026-10-23.md). Research recommendations are not owner approvals. |

## Architecture and repository structure

The running DEMO is HTML/vanilla JavaScript/CSS plus mirrored sq/en/it catalogs and locally vendored i18next. Independent browser stores and role selectors demonstrate flows; they do not enforce real ownership, authentication, moderation or synchronization. The real-app design uses canonical Account, Listing, Activity and Conversation/Message authorities with scoped server permissions. Client/backend/provider choices remain OPEN; logical contracts are not deployed services.

| Path | Responsibility |
| --- | --- |
| `demo/` | Entry HTML, Shop/Shop Plus, Plans, Connections, Privacy/Map, Governance, commerce/time helpers, styles, local QA views and historical version notes; roadmap remains the requirements source. |
| `i18n/` and `demo/i18n/` | Root locale/adapter reference and served mirrors; keep matching files identical. User content/domain codes are not UI translations. |
| `architecture/` | Canonical product/domain/API/privacy/native plans, i18n architecture and static notification illustrations. |
| `docs/` | Existing device/integration/visual QA, F06 proposal, security register/threat/test/release documents, research and continuity archive. |
| `qa/`, `playwright*.cjs` | Executable bounded browser regressions and measurement helpers/configuration; not native/API test certification. |
| `scripts/`, `.github/workflows/` | Fail-closed documentation scope classifier, bounded security/syntax checks and PR CI. Security always runs; allowed Markdown changes can reuse proven unchanged browser execution. |
| `security/` | Locked npm audit/test inventory and vendor integrity metadata; not a native app or backend project. |
| Root Markdown / `SECURITY.md` | Project entry, active state, durable handoff, agent rules and responsible-disclosure limits. |

## Continue development without chat history

Work only in `titanfit102-bit/Illyrian`, branch `feat/i18n-shop-feedback-20261022`, through [Draft PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1) into `demo/v1.7-illyrian-shop`. Read CURRENT_STATE for the latest verified parent/head and current phase; do not treat a hardcoded old SHA or a dated report as LIVE. Confirm PR base/draft/unmerged state, affected paths, CI and isolated Preview before recording results.

Preserve the public name ILLYRIAN, original identity/icon/design and the accepted principles in [blueprint §10](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#10-consolidated-architecture-decisions--23-october-2026-approved-direction-not-implementation). Current product/navigation decisions are in MASTER_HANDOFF; full history remains in Git/archive. Do not import another project's code/accounts/infrastructure, silently merge DEMO stores or invent native features from fixtures.

For a permitted change, use existing canonical destinations, preserve IDs/UGC/drafts and review the diff. Run only relevant checks according to AGENTS; executable DEMO/test commands and dependencies are in the checked-in configurations/workflows/security matrix. Record actual PASS/FAIL/NOT RUN, source SHA, decisions/OPEN gaps and next step; save to the authorized branch and read back GitHub content. Evidence reuse is not a newly executed browser suite. Do not repeat a verified runtime audit for a Markdown-only change.

## DEMO → real Android/iOS boundary

Programme6 is delivered as documentation with explicit OPEN gaps; [§28](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#task-65) records **APK readiness HOLD**. The54-family map is not every control's final schema/test contract. Approved MVP IN/OUT/LATER, platform phases, stack/provider, policy/retention/operations and executable per-action schemas are still required before an authorized real build.

Existing Android/iOS planning starts in blueprint §12 and the §28 gates. A complete environment/build/signing/release guide is **planned for7.2**, public privacy-policy draft for7.3 and legal/commerce drafts for7.4; their absence is recorded in §29/Programme7, not hidden by this README. No native build/install commands, framework, SDK or paid account are selected by this document.7.5 will audit the resulting package and remaining evidence; it has not run.

**No automatic merge or release.** `main`, integration and Production remain protected by authorization; do not rely on unconfigured branch rules as enforcement. Physical Android/iPhone, actual TalkBack/VoiceOver, F06 review/enforcement when separately authorized, and owner sign-off remain real release gates; F06 is deferred, not a blocker for ordinary DEMO documentation. No real backend/account/reset/push/payment, infrastructure spend or public policy activation is authorized here. This is a public repository: never commit passwords, tokens, private personal data or sensitive unresolved exploit details.
