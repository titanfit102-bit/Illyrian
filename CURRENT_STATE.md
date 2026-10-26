# ILLYRIAN — CURRENT_STATE

Përditësuar: 26 tetor 2026 (Europe/Rome). **Faza 1: PARTIAL / RELEASE HOLD; Faza 3: integrim DEMO i verifikuar në scope-in e raportuar.** Ky skedar përmban vetëm gjendjen aktive; objektivat, arkitektura dhe autorizimet janë te [MASTER_HANDOFF](MASTER_HANDOFF.md#authorization). Faktet LIVE në GitHub dhe udhëzimi më i ri i pronarit kanë përparësi ndaj checkpoint-eve.

## Gjendja e verifikuar

| Elementi | Gjendja / prova |
|---|---|
| Repository | `titanfit102-bit/Illyrian`, PUBLIC; vetëm ky projekt |
| Dega e autorizuar | `feat/i18n-shop-feedback-20261022` |
| PR | [#1](https://github.com/titanfit102-bit/Illyrian/pull/1) OPEN / DRAFT / UNMERGED → `demo/v1.7-illyrian-shop` |
| Bazë para Fazës 3 | `d32a7c57692b5a2f20b2faa0b4c02ec39c373e9f`; historia para konsolidimit ruhet në arkiv. Ky checkpoint dokumenton integrimin pasues të Fazës 3. HEAD-i i ri merret nga GitHub, jo nga një SHA historike. |
| Kodi/testet | Remediation i auditit në feature source [`2716216`](https://github.com/titanfit102-bit/Illyrian/commit/2716216cb5f21077ced9aa3cb8396bddb7fffbfb); [QA 40315582660](https://github.com/titanfit102-bit/Illyrian/actions/runs/40315582660) **275/275 Chromium +16/16 Linux WebKit PASS**, logjet e të dy jobs kontrolluar për source `f0e4912`. Testet shtesë IA-02/03, CI hardening dhe kontrasti i kandidatit 271 kërkojnë verifikimin LIVE të job-eve të tij. |
| Siguria | [Security 40317320796](https://github.com/titanfit102-bit/Illyrian/actions/runs/40317320796) PASS në source `704365b` (kontroll i kufizuar); në SHA më të fundit verifiko statusin LIVE. [SECURITY_REGISTER](docs/security/SECURITY_REGISTER.md) mbetet PARTIAL/UNKNOWN për mbulimin real. |
| Kontrollet | Baseline i riprovuar `f0e4912`: 275 Chromium +16 WebKit + security PASS; `d0c0d53` browser QA FAIL nga përdorimi i metodës `check()` për checkbox-in që rikthehet me qëllim; testi u korrigjua në `2716216`. GitHub Actions të kandidatit final kërkojnë PASS të ri mbi atë SHA, jo transferim të statusit. |
| Preview për QA fizik | [Alias-i i degës për telefon](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/) → source `2716216`, deployment [READY](https://illyrian-demo-5mmj6jdcp-un24.vercel.app/) (`target:null`, Vercel metadata të verifikuara). HTTP/assets pas Vercel Authentication dhe QA fizike janë NOT TESTED. |
| Izolimi | Integrimi `015ce439e7c6d736149c6c300391586517664f62`; `main` `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge/Production |

Preview aktual i kandidatit pas korrigjimeve: Vercel Git integration e ka lidhur alias-in me source `2716216`, READY, Preview `target:null`. Nuk ka provë të certifikuar HTTP/asset parity pas login-it, as QA reale në Android/iPhone. Historiku: [Phase 3 QA](docs/PHASE3_INTEGRATION_QA.md), [Phase 1 QA](docs/PHASE1_QA_HANDOFF.md).

## Progresi i implementuar, në kufijtë e provave

- DEMO v1.7 është HTML/vanilla JS/localStorage; të gjitha modulet ekzistuese ruhen. Nuk ka backend, identitet/autorizim real, pagesa ose APK native.
- **629 çelësa për sq/en/it, 15 namespaces**, root/demo mirrors byte-identike për çelësat e header-it dhe njoftimin e konfliktit Connections (622 në baseline). Kontrollet e plota të locale/inventory për kandidatin duhet verifikuar me CI; përkthimi i trashëguar/UGC nuk mbulohet globalisht. Përkthimi semantik, UGC dhe draft/fokus janë mbuluar në rrugët e testuara; jo çdo tekst/gjendje.
- A1-01–A1-07 janë korrigjuar në skenarët e verifikuar; [indeksi i provave](MASTER_HANDOFF.md#evidence) ruan SHA/CI. Mos i rihap nga raportet e vjetra. A1-08 metadata u rifreskua; përshkrimi i PR-së ka ende checkpoint historik dhe nuk është burimi i statusit aktual.
- Messages/Stories: quota failure, ruajtje draft-i, Retry pa dublim/reload dhe stale-tab të vrojtuar janë testuar; input-i ndalon Story clock. Governance ruan statuset historike të panjohura si tekst origjinal të escape-uar. Mbrojtjet lokale **nuk janë atomic CAS** ose mbulim global i çdo writer-i.
- Faza 3: Communities ripërdor postime/komente/Feed/Profile dhe raportime ekzistuese; shtohet `c4` Shkolla & Universiteti, kërkim sq/en/it dhe lidhje draft/objekt me Plans. U korrigjuan quota/stale-comment, anëtarësimi dhe qyteti manual; oraret përdorin zonën e qytetit, jo shfletuesit. GPS nuk kërkohet. 22/22 teste të reja lokale +6 prova responsive/fokus PASS; [raporti](docs/PHASE3_INTEGRATION_QA.md). Intereset me skadim të saktë/të pavlefshëm nuk japin match; repeat mbetet draft manual.
- Connections → Hera e parë: u korrigjua mungesa e njoftimit të parë të ruajtjes/gabimit; checkbox-i dhe fokusi ruhen, quota rikthehet pa sukses të rremë. 6 teste të reja sq/en/it +4 regresione ekzistuese lokale PASS; jo provë TalkBack/VoiceOver.
- Kontratat e backend-it social/activities/notification/timezone/recurrence janë te [blueprint §13](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#13-social-community-and-activity-api-contracts--phase-3-design), **BACKEND/design**, jo implementim. Nuk u gjet checkpoint i veçantë 3.2 në bazën e verifikuar.
- **Mobile UI precision (scope eksplicit i pronarit, 25 tetor):** Stories zhvendosen fizikisht në krye të Feed; Shop entry vendoset pas tyre (gabimi u riprodhua nga 3 teste red dhe u korrigjua). Unaza responsive `clamp(74px,21vw,82px)`, pesë tabs `Home/Reels/Messages/Zbulo/Profile` në këtë rend, label-e të fshehura vetëm vizualisht në telefon me `aria-label` të ruajtura; zona prekjeje 44+ px, header/Feed spacing dhe `env(safe-area-inset-*)`. Fake `9:41`/home indicator fshihen vetëm në fullscreen mobile; mockup desktop mbetet. [QA 40246035137](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137) **267 Chromium +16 WebKit PASS** dhe [security 40246035149](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035149) PASS. Pamjet para/pas ruhen si artefakte: [para — 7418636](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438045/artifacts/12617440183) / [pas — 08d773c](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137/artifacts/12618099658). Screenshot capture **nuk është pixel-diff apo shqyrtim manual i çdo imazhi**; përdoruesi nuk ka bashkëngjitur në këtë mesazh screenshot-et referencë. Identiteti/ngjyrat/modules/ruajtja nuk ndryshojnë.
- CI PR dhe security-baseline funksionojnë. F06 automatizimi i kontrolleve ekziston, por **enforcement administrativ mungon**. Detajet funksionale/testuese mbeten te [raporti i Fazës 1](docs/PHASE1_QA_HANDOFF.md).

## Bllokuesit dhe çështjet e hapura

| ID / fushë | Statusi / çfarë mbetet |
|---|---|
| M01–M18 | **NOT TESTED fizikisht**: Android/iPhone, portrait/landscape, tastierë virtuale, safe areas, Light/Dark, sq/en/it, OS text scaling, TalkBack/VoiceOver dhe performancë |
| P1-A11Y-01 | **CODE FIXED / CI+REVIEW PENDING**: vetëm ngjyra e tekstit `See all` në Home Light është errësuar minimalisht në `#DC0C35` (llogaritje 4.67:1 kundrejt pragut 4.5:1). Test automatik Light/Dark i shtuar; kontrolli final vizual/real mbetet OPEN. |
| i18n / UGC / a11y globale | **OPEN**: gjendjet e rralla, teksti i gjatë, ARIA/empty/error, legacy adapter dhe sinks jashtë rrugëve të mbuluara |
| F06 / A1-09 | **OPEN, miratim administrativ kërkohet**: lista LIVE e degëve `protected:false`, rulesets `[]`; checks PASS nuk bllokojnë vetë merge |
| Ruajtja | **PARTIAL**: legacy core writers, own-media drafts dhe shkrime vërtet njëkohësisht ende jo të certifikuara globalisht |
| Siguria / release | Regjistri ka PARTIAL/UNKNOWN; schedule javor jo aktiv pa workflow në default branch; private disclosure dhe operacionet reale të paprovuara. Sign-off i pronarit mungon. |

## Audit i pavarur — korrigjimet e 26 tetorit

- Auditimi në source `399ef0b` identifikoi IA-01–IA-09. **IA-05** i18n i Home ishte korrigjuar më herët në `785a582`, me teste PASS.
- **IA-01/P1 Plans** dhe **IA-04/P2 Shop**: [kodi+provat `f0e4912`](https://github.com/titanfit102-bit/Illyrian/commit/f0e4912aa7d509292427a5c3c0ea424273a4f603); 275/275 Chromium +16/16 WebKit + security PASS në atë source. Reader-i Plans nuk paraqet kapacitet të pavlefshëm si HTML dhe nuk prek raw storage nga load; Shop toleron `store` historik të munguar.
- **IA-02/P1 Connections** dhe **IA-03/P2 Governance/Connections**: [patch `d0c0d53`](https://github.com/titanfit102-bit/Illyrian/commit/d0c0d531b56b4f03bb3763b5a0a8728648da5795) shtoi refuzim të snapshot-it të vjetruar, rollback dhe ruajtje të input-eve kur ruajtja dështon, plus njoftim sq/en/it. Run-i `40316735126` dështoi në një test IA-02 që përdorte gabimisht Playwright `check()` ndërsa checkbox-i rikthehet; [testi u korrigjua `2716216`](https://github.com/titanfit102-bit/Illyrian/commit/2716216cb5f21077ced9aa3cb8396bddb7fffbfb). Këto skenare mbeten **PENDING final QA** derisa run-i i saktë të kalojë. Nuk premtohet atomic cross-tab CAS.
- **IA-06/P2**: [workflow i përforcuar `291eb91`](https://github.com/titanfit102-bit/Illyrian/commit/291eb91056bea322a9913e2601273e90048f62eb) fikson Actions në SHA të verifikuara dhe Playwright në `security/package-lock.json`; instalimi dhe starti i testeve në GitHub CI u vëzhguan, rezultatet finale të kandidatit kërkojnë kontroll.
- **IA-09/P1-A11Y-01**: [korrigjim minimal teksti + regresion `704365b`](https://github.com/titanfit102-bit/Illyrian/commit/704365b9bce62d253f5470578b49e49d7d4ea106), Light-only. Prova e pajisjeve, fotografive dhe CI final ende e nevojshme. **IA-08**: u hoq nga hapi aktiv lidhja e Preview-it historik.
- **IA-07/F06**: OPEN, branch protection/rulesets kërkojnë miratim të veçantë administrativ. M01–M18, TalkBack/VoiceOver, performance reale dhe release sign-off mbeten OPEN. Asnjë merge/backend/native/Production.

## Hapi i saktë pasues

1. Verifiko workflow runs për **source aktual të PR #1**, përfshirë testin IA-02, njoftimet sq/en/it, WebKit dhe testin e kontrastit; riparo çdo regresion të riprodhueshëm para polish-it të ri.
2. Rikonfirmo Vercel Preview alias/source/READY/`target:null`; testimin e HTTP/assets pas hyrjes dhe M01–M18 në telefon real trajtoji si prova të veçanta, jo si të kryera nga emulimi.
3. Vetëm pas testimit, trajto auditin global i18n/UGC/a11y dhe kërko vendim të veçantë për F06 + sign-off. Mos merge/publiko ose ndërto backend/native.

## Home header — 26 tetor 2026 (scope i autorizuar)

- **Aktualisht në feature:** `ILLYRIAN | Kalendari | Mundësi | Njoftime`; plusi i Home është i fshehur, krijimi në Feed dhe ekrane të tjera ruhet. Menuja vertikale ka **Biznese, Tregu, Punë, Shërbime** (në këtë rend), jo më hyrjen e vjetër `Të gjitha`.
- **Rrugët:** Biznese/Punë përdorin filtrat ekzistues të Explore; Tregu hap Shop-in ekzistues (kategoria e përgjithshme), Shërbime hap Shop me kategorinë Shërbime. Pa marketplace paralel, server, pagesa ose format të ri ruajtjeje. U korrigjua mbyllja e menusë në hapjen e Njoftimeve.
- **i18n/a11y:** gjashtë keys `common:home*` sq/en/it, root/demo mirrors byte-identike, `data-i18n-direct`, përditësim në ndërrim gjuhe, `aria-expanded` dhe Escape/fokus të ruajtur. Tre teste Chromium të reja krahasuar me baseline 270.
- **Prova:** [korrigjimi i menusë `18bb834`](https://github.com/titanfit102-bit/Illyrian/commit/18bb8341bd8350573f37b6cf63244a6042dc105b); [kandidati i katër hyrjeve `785a582`](https://github.com/titanfit102-bit/Illyrian/commit/785a582135371f1722e90239b4652f2317d69227); [security PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40300249776); [Chromium/WebKit CI](https://github.com/titanfit102-bit/Illyrian/actions/runs/40300249782) **Chromium 273/273 PASS, 16/16 WebKit PASS**. Vercel Preview immutable: https://illyrian-demo-m9nct6u05-un24.vercel.app/ READY / `target:null`. Chromium PASS për këtë SHA është verifikuar; WebKit 16/16 PASS gjithashtu; pajisjet fizike/VoiceOver/TalkBack/sign-off mbeten OPEN.

## Vercel Preview i vazhdueshëm — kërkesa e pronarit, 26 tetor 2026

**URL fikse për telefonin:** [ILLYRIAN — latest feature-branch Preview](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/). Është alias ekzistues Vercel i lidhur automatikisht me `feat/i18n-shop-feedback-20261022`, projekt `illyrian-demo` / team `un24`; më 26 tetor alias tregonte source `785a582`, READY, nga metadata Vercel; HTML/assets QA kërkojnë verifikim më vete. **Pas çdo commit-i** në degën e autorizuar verifiko që Preview i ri është READY, target **jo Production**, alias-i tregon commit-in e duhur, skedarët kryesorë shërbehen saktë dhe CI për SHA-në përkatëse raportohet veç. Nuk kërkohet manual deploy kur Git integration funksionon; nëse build-i dështon, mos thuaj që alias-i ka versionin e ri. Mbaj URL immutable/SHA të çdo sesioni QA si provë, sepse alias-i i telefonit ndryshon me deploy-et e reja. Vercel Authentication mund të kërkojë hyrje në telefon; mos dobëso mbrojtjen. Pa merge / `main` / Production.

## Rikuperimi dhe historia

Lexo këtë skedar → [MASTER_HANDOFF](MASTER_HANDOFF.md) → [AGENTS](AGENTS.md) dhe regjistrin e sigurisë për ndryshimin relevant; pastaj vetëm referencat e nevojshme. Verifiko HEAD/PR/diff/CI dhe, nëse preket Preview, source/target. Arkivi lexohet vetëm për pyetjen historike konkrete: [indeksi dhe kopjet e plota](docs/archive/continuity/README.md). Mos i rikthe checkpoint-et e vjetra si gjendje aktive.
