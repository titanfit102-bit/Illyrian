# ILLYRIAN — CURRENT_STATE

Përditësuar: 25 tetor 2026 (Europe/Rome). **Faza 1: PARTIAL / RELEASE HOLD; Faza 3: integrim DEMO i verifikuar në scope-in e raportuar.** Ky skedar përmban vetëm gjendjen aktive; objektivat, arkitektura dhe autorizimet janë te [MASTER_HANDOFF](MASTER_HANDOFF.md#authorization). Faktet LIVE në GitHub dhe udhëzimi më i ri i pronarit kanë përparësi ndaj checkpoint-eve.

## Gjendja e verifikuar

| Elementi | Gjendja / prova |
|---|---|
| Repository | `titanfit102-bit/Illyrian`, PUBLIC; vetëm ky projekt |
| Dega e autorizuar | `feat/i18n-shop-feedback-20261022` |
| PR | [#1](https://github.com/titanfit102-bit/Illyrian/pull/1) OPEN / DRAFT / UNMERGED → `demo/v1.7-illyrian-shop` |
| Bazë para Fazës 3 | `d32a7c57692b5a2f20b2faa0b4c02ec39c373e9f`; historia para konsolidimit ruhet në arkiv. Ky checkpoint dokumenton integrimin pasues të Fazës 3. HEAD-i i ri merret nga GitHub, jo nga një SHA historike. |
| Kodi/testet | **HEAD kodi/testit** `9ba6fa6523bcf8e023edb0a7d4d0f40e971ab521`; [QA #40251911500](https://github.com/titanfit102-bit/Illyrian/actions/runs/40251911500) **IN PROGRESS në checkpoint-in dokumentues** — kontrollo LIVE për rezultatin; **267 Chromium +16 WebKit PASS** i mëparshëm vlen vetëm për `08d773c`. Një run paraprak për `c298a5a` kishte 267 PASS +3 teste të reja FAIL nga pritshmëria e ngurtë e përkthimit “Njoftime”→“Notifications”; u korrigjua vetëm testi te `9ba6fa6`. |
| Siguria | [40251911473](https://github.com/titanfit102-bit/Illyrian/actions/runs/40251911473) **PASS** në code/test SHA `9ba6fa6`; kontroll i kufizuar, jo SAST/audit global. [Regjistri kanonik](docs/security/SECURITY_REGISTER.md). |
| Kontrollet | `browser-smoke-pull_request`, `webkit-smoke-pull_request`, `security-baseline`: completed/success mbi source SHA; logjet e të tri job-eve u inspektuan. Kontrollo veçmas CI-në e çdo HEAD-i të ri. |
| Preview për QA fizik | [Preview e përhershme e degës](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/) → deploy i kodit `9ba6fa6523bcf8e023edb0a7d4d0f40e971ab521`, `dpl_DYGghuGZtMP2AXytWHYxvxEsX8Ji`, READY, target null; QA fizike NOT TESTED. |
| Izolimi | Integrimi `015ce439e7c6d736149c6c300391586517664f62`; `main` `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge/Production |

Preview aktual: alias-i i degës auto-updated te source `9ba6fa6`; source e header-it `c298a5a`, test i ndrequr në `9ba6fa6`. Verifikimi i mëparshëm të këtij ndryshimi në Vercel kishte root HTML HTTP 200/prefix source (+163), CSS responsive HTTP 200 byte-identik; pas commit-it të testit, alias-i tregoi të njëjtin kod demo. Preview është i izoluar, jo Production; Faza 3/Connections ruhen. Aksesi anonim, status bar-i real, Android/iPhone dhe screenreader janë NOT TESTED fizikisht. Historiku: [Phase 3 QA](docs/PHASE3_INTEGRATION_QA.md), [Phase 1 QA](docs/PHASE1_QA_HANDOFF.md).

## Progresi i implementuar, në kufijtë e provave

- DEMO v1.7 është HTML/vanilla JS/localStorage; të gjitha modulet ekzistuese ruhen. Nuk ka backend, identitet/autorizim real, pagesa ose APK native.
- **622 çelësa për sq/en/it, 15 namespaces**, root/demo mirrors identike në checkpoint-in e testuar. Përkthimi semantik, UGC dhe draft/fokus janë mbuluar në rrugët e testuara; jo çdo tekst/gjendje.
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
| P1-A11Y-01 | **OPEN**: Reels në Home Light, kontrast 4.36:1 kundrejt 4.5:1; pa ndryshim ngjyrash/dizajni. Korrigjimi vizual pret vendim të veçantë. |
| i18n / UGC / a11y globale | **OPEN**: gjendjet e rralla, teksti i gjatë, ARIA/empty/error, legacy adapter dhe sinks jashtë rrugëve të mbuluara |
| F06 / A1-09 | **OPEN, miratim administrativ kërkohet**: lista LIVE e degëve `protected:false`, rulesets `[]`; checks PASS nuk bllokojnë vetë merge |
| Ruajtja | **PARTIAL**: legacy core writers, own-media drafts dhe shkrime vërtet njëkohësisht ende jo të certifikuara globalisht |
| Siguria / release | Regjistri ka PARTIAL/UNKNOWN; schedule javor jo aktiv pa workflow në default branch; private disclosure dhe operacionet reale të paprovuara. Sign-off i pronarit mungon. |

## Hapi i saktë pasues

**Scope i fundit:** përmirësim i kufizuar vizual Instagram-inspired vetëm për Stories/Feed, pesë tabs, header dhe shell mobile. Nuk është ridizajnimi A/B/C; ruaj ILLYRIAN, logon, paletën dhe funksionet. Pa backend/native, migrime destruktive, pagesa ose ndryshime të main/Production.

**Hapi pasues:** shqyrto pamjet [para](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438045/artifacts/12617440183) / [pas](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137/artifacts/12618099658) krah për krah me screenshot-et referencë të pronarit dhe regjistro çdo devijim të riprodhueshëm. Testo [kandidatin e ri](https://illyrian-demo-2gv5m563l-un24.vercel.app/) me [worksheet-in fizik](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md) për M01–M18, duke dalluar CSS-in dhe Preview wrapper-in nga Android OS navigation bar/safe area; statuset reale mbeten NOT TESTED. P1-A11Y-01 kontrast, global i18n/a11y, F06 miratim dhe sign-off mbeten OPEN; pas korrigjimeve reale, verifiko CI në SHA të ri. Mos bëj merge/release vetëm nga browser PASS.

## Home header — 26 tetor 2026 (scope i autorizuar)

- **Renditja vetëm në Home:** identiteti `ILLYRIAN` → `Kalendari` (events ekzistuese) → `Mundësi` (popover vertikal: Biznese, Punë, Të gjitha → `explore` dhe kategori ekzistuese) → `Njoftime` (modal dhe badge ekzistues). Butoni plus i krijimit fshihet vetëm në header-in Home; shkrimi/Story në Feed dhe plusi në ekranet e tjera ruhen.
- **A11y/QA:** menu me `aria-expanded`, `aria-controls`, 44+px prekje, fokus, mbyllje me Escape/jashtë dhe pa ruajtje/API të re. Tre teste të reja mobile 320×568 / 390×844 / 844×390, [CI #40251911500](https://github.com/titanfit102-bit/Illyrian/actions/runs/40251911500) **në proces** në këtë checkpoint, prandaj mos e quaj PASS deri në log-un final. Testi pranon korrekt përkthimin ekzistues të Njoftimeve në gjuhën aktive.
- **Source:** [`9ba6fa6`](https://github.com/titanfit102-bit/Illyrian/commit/9ba6fa6523bcf8e023edb0a7d4d0f40e971ab521) (UI [`c298a5a`](https://github.com/titanfit102-bit/Illyrian/commit/c298a5afca04341337157807b98c8aa3dd469630)), [security PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40251911473). Immutable Preview https://illyrian-demo-agyllbr2n-un24.vercel.app/ (READY, `dpl_DYGghuGZtMP2AXytWHYxvxEsX8Ji`, target null); URL e përhershme e telefonit është te seksioni i Preview më poshtë. OS mobile, VoiceOver/TalkBack dhe sign-off **NOT TESTED**; asnjë merge/main/Production.

## Vercel Preview i vazhdueshëm — kërkesa e pronarit, 26 tetor 2026

**URL fikse për telefonin:** [ILLYRIAN — latest feature-branch Preview](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/). Është alias ekzistues Vercel i lidhur automatikisht me `feat/i18n-shop-feedback-20261022`, projekt `illyrian-demo` / team `un24`; më 26 tetor alias tregonte source `f017c996`, READY, dhe HTML u verifikua ndaj GitHub. **Pas çdo commit-i** në degën e autorizuar verifiko që Preview i ri është READY, target **jo Production**, alias-i tregon commit-in e duhur, skedarët kryesorë shërbehen saktë dhe CI për SHA-në përkatëse raportohet veç. Nuk kërkohet manual deploy kur Git integration funksionon; nëse build-i dështon, mos thuaj që alias-i ka versionin e ri. Mbaj URL immutable/SHA të çdo sesioni QA si provë, sepse alias-i i telefonit ndryshon me deploy-et e reja. Vercel Authentication mund të kërkojë hyrje në telefon; mos dobëso mbrojtjen. Pa merge / `main` / Production.

## Rikuperimi dhe historia

Lexo këtë skedar → [MASTER_HANDOFF](MASTER_HANDOFF.md) → [AGENTS](AGENTS.md) dhe regjistrin e sigurisë për ndryshimin relevant; pastaj vetëm referencat e nevojshme. Verifiko HEAD/PR/diff/CI dhe, nëse preket Preview, source/target. Arkivi lexohet vetëm për pyetjen historike konkrete: [indeksi dhe kopjet e plota](docs/archive/continuity/README.md). Mos i rikthe checkpoint-et e vjetra si gjendje aktive.
