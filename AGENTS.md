# ILLYRIAN — Agent instructions (scope-limited)

## DEMO vs APK — permanent owner policy

ILLYRIAN DEMO is a prototype for the owner's private testing of design, navigation and functions, not a production-grade service. The repository is PUBLIC: use fictional data, never secrets or real private content. This policy applies to every subsequent conversation/AI agent until the owner explicitly changes phase.

- Keep development simple, fast and proportional to actual DEMO risk. Do not add advanced security, tests, simulations, architecture or documentation solely to prepare the APK. Preserve existing functions, important regressions, stable data/IDs and approved decisions.
- Keep basic secret/dependency/vendor checks, safe DOM output, input validation, draft/error honesty, compatibility and relevant browser regressions. Do not remove tests/protections or change mandatory checks/release gates without analysis and the required authorization.
- Preserve real-app knowledge in the existing [blueprint §14 map](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#14-knowledge-preservation-and-demoapk-boundary--26-october-2026), roadmap and history. Label VERIFIED (bounded proof), DEMO (simulation), PLANNED (undelivered design) and BACKEND (requires real service). Future security/privacy/data/native requirements remain documented, implemented in the approved phase only.
- Për çdo kërkesë të re të pronarit, ChatGPT duhet të analizojë automatikisht cilat funksione duhen implementuar në DEMO për testim praktik të dizajnit dhe përdorimit, cilat kërkojnë vetëm specifikime në dokumentacionin kanonik për APK-në reale dhe cilat kërkojnë vendim të mëvonshëm. Implemento vetëm pjesën e nevojshme të DEMO-s, pa kompleksitet artificial, dhe ruaj të gjitha kërkesat e ardhshme për APK-në pa humbje informacioni. Mos kërko që pronari ta bëjë këtë ndarje manualisht. Mos ndrysho vendime të miratuara ose kryej ndryshime me rrezik të lartë pa autorizim.
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
- [AGENTS.md](AGENTS.md): working rules and permanent policies.
- [CURRENT_STATE.md](CURRENT_STATE.md): current status, active scope, evidence/blockers and next step.
- [MASTER_HANDOFF.md](MASTER_HANDOFF.md): durable decisions, authorizations and long-term context.
- [Blueprint](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md): architecture and technical/data/security/privacy contracts, including future APK design.
- [Roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md): requirements, priorities, phases, dependencies and acceptance criteria.
- Git history: change traceability and recoverable original sources; canonical documents link exact source commits instead of copying prompts.
- Localization: [i18n architecture](architecture/ILLYRIAN_I18N.md). Mobile QA and release HOLD: [acceptance matrix](docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md), [physical worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md); GitHub required-check proposal: [F06 decision](docs/F06_REQUIRED_CHECKS_DECISION.md).
- Do not create parallel copies of these subjects or move/replace the existing continuity paths. Historical sections are an audit archive, not current implementation or authorization.

## Lossless documentation and traceability

Ruajtja pa humbje informacioni do të thotë ruajtja e **100% të kërkesave unike, funksioneve, specifikimeve, vendimeve, autorizimeve, kufizimeve, kontratave dhe kritereve të pranimit**, jo kopjimi fjalë për fjalë i komandave të pronarit. Ktheji në kërkesa të strukturuara e koncize me identifikues, varësi dhe status të qartë: implementuar/verifikuar brenda provave, DEMO, planifikuar/BACKEND ose në pritje vendimi. Mos ndrysho kuptimin ose nivelin e autorizimit gjatë përmbledhjes.

Çdo ndryshim domethënës dokumentohet dhe lidhet me Git commit-in, testet/provat përkatëse dhe destinacionin kanonik sipas roleve më sipër. Regjistro vendimin/arsyen, kufizimet dhe çështjet e hapura; PASS/FAIL/NOT RUN dhe matjet duhet të jenë reale. Përditëso CURRENT_STATE për gjendjen/hapin pasues, MASTER_HANDOFF vetëm për vendime/kontekst afatgjatë dhe kontratat/roadmap-in kur preken. Përdor referenca; mos përsërit të njëjtin informacion në disa dokumente pa arsye teknike.

Përpara konsolidimit verifiko rikuperimin e burimeve në Git history me commit të saktë dhe dokumento krahasimin burim → kërkesë/destinacion kanonik. Pas redaktimit kontrollo diff-in dhe matricën e gjurmueshmërisë për çdo kërkesë unike. Ruaj matricën te dokumenti ekzistues përkatës, pa dosje paralele. Mos fshi histori me vlerë unike dhe mos rishkruaj commit-et; kërkesat e paqarta ose të pasigurta për t'u përmbledhur mbeten të ruajtura e të shënuara për shqyrtim.

**Specifikimi aktual ka përparësi ndaj historikut.** Kur pronari autorizon përmirësimin ose zëvendësimin e një vendimi/funksioni, përditëso specifikimin kanonik në vend me versionin më të fundit të miratuar; mos grumbullo specifikime kronologjike kontradiktore. Ruaj arsyen, provat, testet, commit-in dhe referencën e vendimit të zëvendësuar, pa kopjuar përmbajtjen e vjetër. Dokumentacioni aktiv përcakton çfarë duhet implementuar në DEMO dhe APK, brenda autorizimeve; Git history ruan evolucionin historik.

**Dokumentacion preciz, pa teori dhe fryrje të panevojshme.** Shkruaj vetëm informacion me vlerë praktike për zhvillimin, mirëmbajtjen dhe APK-në: kërkesa, vendime, specifikime, kontrata, kufizime, kritere pranimi, rezultate testesh dhe hapa pasues. Përdor formulime të shkurtra, të sakta dhe të strukturuara; shmang teori të përgjithshme, shpjegime të gjata, përsëritje, transkripte komandash dhe tekst që nuk ndihmon implementimin ose vendimmarrjen. Refero informacionin ekzistues në dokumente të tjera dhe përditëso seksionet në vend, pa shtuar vazhdimisht seksione kronologjike. Shkurtësia nuk duhet të humbasë kërkesa unike, funksione, detaje teknike, vendime, autorizime, kontrata ose kritere pranimi.

## Per-change engineering gate
1. Define the smallest permitted change with risk, performance, i18n, privacy, user-generated content and regression impact. Preserve Stories/Reels and established flows; do not use changes in other projects as dependencies.
2. Make small reversible changes only in the authorized feature branch. Keep persisted **domain codes** independent of sq/en/it display text; never translate user-authored strings. Validate local inputs, escape untrusted output, preserve user drafts on errors and do not claim localStorage is secure persistence.
3. Check relevant Playwright coverage, actual `pull_request` GitHub Actions status and exact source SHA. Required-check enforcement (F06) is **not active** unless confirmed from GitHub settings. Do not treat Linux WebKit or viewport simulation as real iPhone, Android, TalkBack or VoiceOver evidence.
4. For performance changes, capture comparable before/after evidence. No fabricated threshold PASS, battery figure, API latency, APK size or benchmark. Future mobile performance budgets remain **proposed**, pending device-baseline selection and approval.
5. Review canonical documentation impact after **material, verified** changes and update each affected document according to its role above; do not duplicate archival history or touch an unchanged subject merely to update both continuity files. Record PASS/FAIL/NOT RUN, issue and source SHA. If CI is unavailable, leave tests as NOT RUN/CI BLOCKED until genuinely passed.
6. Preserve Draft PR / isolated Preview only. M01–M18 physical Android/iPhone, real screenreaders and explicit final acceptance/release sign-off remain unverified milestones; no final PASS without proof. F06 settings are deferred as above; existing CI and release-gate mechanisms are unchanged.

**Foundation protocol v1.1:** a supplementary, selectively applicable work standard when supplied by the owner; it never authorizes backend, native development, new services, release or changes to protected scopes.


## PERFORMANCE FIRST — permanent owner standard (27 October 2026)

Speed, efficiency and stability are requirements throughout development. For each feature/change assess UI responsiveness/rendering, memory, battery and network impact proportionately to actual DEMO risk. Measure the current bottleneck before optimizing; use comparable before/after evidence for performance claims. Reuse existing flows and avoid unnecessary renders, work or dependencies. Never trade security, privacy, accessibility, data correctness or approved functionality for speed. Record material results/limitations once in the relevant canonical document and reference them from continuity documents according to their roles; no parallel performance dossier. Unavailable physical Android/iPhone, battery or native measurements remain NOT RUN/OPEN, never inferred from Chromium or a 60 FPS aspiration. Future APK budgets and devices require explicit baselines. This standard does not authorize task 5.2–5.4, architecture changes, paid services, merge or Production.
