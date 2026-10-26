# ILLYRIAN — CURRENT_STATE

Përditësuar: 26 tetor 2026 (Europe/Rome). **Faza 1: PARTIAL / RELEASE HOLD; Faza 3: integrim DEMO i verifikuar në scope-in e raportuar.** Ky skedar përmban vetëm gjendjen aktive; objektivat, arkitektura dhe autorizimet janë te [MASTER_HANDOFF](MASTER_HANDOFF.md#authorization). Faktet LIVE në GitHub dhe udhëzimi më i ri i pronarit kanë përparësi ndaj checkpoint-eve.

## Gjendja e verifikuar

| Elementi | Gjendja / prova |
|---|---|
| Repository | `titanfit102-bit/Illyrian`, PUBLIC; vetëm ky projekt |
| Dega e autorizuar | `feat/i18n-shop-feedback-20261022` |
| PR | [#1](https://github.com/titanfit102-bit/Illyrian/pull/1) OPEN / DRAFT / UNMERGED → `demo/v1.7-illyrian-shop` |
| Bazë para Fazës 3 | `d32a7c57692b5a2f20b2faa0b4c02ec39c373e9f`; historia para konsolidimit ruhet në arkiv. Ky checkpoint dokumenton integrimin pasues të Fazës 3. HEAD-i i ri merret nga GitHub, jo nga një SHA historike. |
| Kodi/testet | Menuja Mundësi 8 hyrje: 4 të reja nga Home. Kodi [676a1b8](https://github.com/titanfit102-bit/Illyrian/commit/676a1b8073b995656cea90a1e6a0abd57105e5b6), testet [7b8943](https://github.com/titanfit102-bit/Illyrian/commit/7b8943147fdd7a8189866b9d62257d279d63f531). [Browser QA #40331804926](https://github.com/titanfit102-bit/Illyrian/actions/runs/40331804926) **296/296 Chromium +16/16 WebKit PASS**, job logs verifikuar; baseline i fundit para ndryshimit 293 Chromium +16 WebKit PASS. |
| Siguria | [Security #40331804826](https://github.com/titanfit102-bit/Illyrian/actions/runs/40331804826) PASS te source 7b8943 (bounded); regjistri i sigurisë mbetet PARTIAL/UNKNOWN për fushat jashtë scope. |
| Kontrollet | 4 çelësa të rinj sq/en/it; mirrors root/demo identike, menu 8 butona, regressions Home/i18n/routing. Browser QA i kodit të ri 296 Chromium +16 WebKit PASS; F06 e shtyrë për aplikacionin real. |
| Preview për QA fizik | [Alias fiks](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/) → source 7b8943, [Preview immutable READY](https://illyrian-demo-3fbexoigq-un24.vercel.app/), deployment dpl_3qMP5GRzQcdzJNsSmoKe3CbJ4CDE, target:null; QA fizike dhe asset parity pas auth NOT TESTED. |
| Izolimi | Integrimi `015ce439e7c6d736149c6c300391586517664f62`; `main` `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge/Production |

Preview aktual i Home/Mundësi: source `7b8943`, READY, target Preview null; HTTP/asset parity dhe QA fizike nuk janë certifikuar. Nuk ka provë të certifikuar HTTP/asset parity pas login-it, as QA reale në Android/iPhone. Historiku: [Phase 3 QA](docs/PHASE3_INTEGRATION_QA.md), [Phase 1 QA](docs/PHASE1_QA_HANDOFF.md).

## Progresi i implementuar, në kufijtë e provave

- DEMO v1.7 është HTML/vanilla JS/localStorage; të gjitha modulet ekzistuese ruhen. Nuk ka backend, identitet/autorizim real, pagesa ose APK native.
- **629 çelësa për sq/en/it, 15 namespaces**, root/demo mirrors byte-identike për çelësat e header-it dhe njoftimin e konfliktit Connections (622 në baseline). Kontrollet e inventarit/çelësave kanë kaluar në CI të kandidatit; përkthimi i trashëguar/UGC nuk mbulohet globalisht. Përkthimi semantik, UGC dhe draft/fokus janë mbuluar në rrugët e testuara; jo çdo tekst/gjendje.
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

## Audit i pavarur — 26 tetor 2026, status final i korrigjimeve

- **IA-01/P1 Plans:** kapaciteti i ruajtur i pavlefshëm nuk ekzekutohet si HTML, nuk krijon vende fiktive dhe nuk rishkruhet automatikisht. Teste për markup, null, objekt, negativ, zero, jashtë kufirit, thyesë dhe string numerik.
- **IA-02/P1 Connections:** shkrimet e vjetra të dy skedave refuzohen pa mbishkruar qytetin/interesin e ruajtur; dy rendet e veprimeve dhe notice sq/en/it mbulohen. Mbetet kontroll i kufizuar, **jo atomic compare-and-swap**.
- **IA-03/P2 Connections/Governance:** ruajtja e dështuar mban vlerat e formularit, fokusin e rastit të testuar dhe mundëson Retry pa dublim. Jo çdo formular i aplikacionit është certifikuar.
- **IA-04/P2 Shop:** renditja toleron listime historike me `store` mungues/null/numerik, të përziera me listime valide; raw storage nuk ndryshohet gjatë load/sort.
- **IA-05/P2 Home i18n:** gjashtë etiketa semantike sq/en/it dhe menuja Biznese/Tregu/Punë/Shërbime mbeten të verifikuara me regresione. **IA-06/P2 CI:** runner-i i kyçur dhe SHA-pinning verifikohen nga të njëjtat suites.
- **IA-09/P1-A11Y-01:** ngjyra vetëm e tekstit Reels Light u përmirësua minimalisht (`#DC0C35`), testi i kontrastit ≥4.5 dhe kontrolli Dark **PASS në browser**, jo certifikim vizual/fizik.
- **Prova finale:** [source `15f3a0e`](https://github.com/titanfit102-bit/Illyrian/commit/15f3a0ee6c5c1039ad0c4588a2fd5be828f111f0), [291 Chromium +16 WebKit PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40319869757), [security PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40319869770); testet e browser-it janë scoped, jo provë e sigurisë absolute.
- **IA-08/P3 checkpoint:** burimi aktiv, CI dhe Preview u harmonizuan këtu; historia mbetet në arkiv. **IA-07/F06** OPEN: rulesets `[]`, `main protected:false`; për activation duhet miratim administrativ i veçantë.

## Hapi i saktë pasues

1. **Prioritet release HOLD:** testim fizik M01–M18 në Android Chrome dhe iPhone Safari (kur të jetë i disponueshëm), TalkBack/VoiceOver, safe area, keyboard/OS text scaling, orientim, scroll dhe review manual i pamjeve Light/Dark. Regjistro prova në [worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md); pa prova statusi mbetet NOT TESTED.
2. **F06:** sipas vendimit më të fundit të pronarit, enforcement i branch rules **nuk është i domosdoshëm për DEMO-n dhe shtyhet për aplikacionin real**. Kontrollet CI mbeten të detyrueshme në praktikën e zhvillimit; mos bëj merge pa autorizim.
3. **Përpara MVP-së reale:** review shtesë global i18n/UGC/a11y dhe zgjidhja e identitetit/backend/privatësisë sipas roadmap-it ekzistues. Mos e shëno DEMO-n release-ready ose të implementosh backend/native pa vendim.

## Home composer — 26 tetor 2026 (ndryshim i verifikuar)

- **Kërkesa:** composer-i ekzistues (avatar + `Çfarë po ndodh sot?` + ikonë media) të jetë **menjëherë poshtë Stories** në Home. Nuk krijohet composer paralel dhe nuk ndryshohet ruajtja ose navigimi i postimit.
- **Implementimi:** render-i kryesor siguron që Stories ndiqet nga composer-i ekzistues; injektimi i kartës ILLYRIAN Shop ruhet pas composer-it, përpara filtrave të Feed. Paneli ekzistues `v15-studio` Story/Reel nuk fshihet. Për ekranet e tjera nuk ka ndryshim në përmbajtje/navigim.
- **Provat:** commit-i i kodit/testeve [`fc3812b`](https://github.com/titanfit102-bit/Illyrian/commit/fc3812bd7f434087e810378d36b775768e728640), [CI 293 Chromium +16 WebKit PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40327148783), [security PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40327148842). QA e re kontrollon rendin, një composer, avatar/media, modalin ekzistues `v5-text`/`v5-file`, Shop dhe përkthimin sq/it pas navigimit. Pas regresioneve reale u korrigjuan pritshmëri testesh për elemente historike; **vetëm source final PASS** është provë e pranimit.
- **Kufijtë:** testet janë në Chromium/WebKit të automatizuar, jo certifikim i telefonit fizik. Review manual, M01–M18 dhe accessibility real mbeten OPEN; Draft PR #1 nuk është bashkuar.

## Home header / Mundësi — 26 tetor 2026

- **Vendimi aktiv:** U zhvendosën nga Home te Mundësi: **Çfarë kërkon tani?**, **Aktivitetet e tua**, **Plane**, **Komunitete**. Këto janë shtuar pas Biznese, Tregu, Punë, Shërbime: gjithsej **8 hyrje**. Karta e interesit, përmbledhja e aktiviteteve dhe shortcuts Plane/Komunitete nuk janë më në Home. Shortcuts Biznese/Punë janë ruajtur.
- **Funksionet:** Interesi hap modalin ekzistues `intent`; Aktivitetet ripërdor `v10-my-plans`; Plane hap Events; Komunitete hap Explore me filtrin ekzistues. Tregu/Shërbime mbeten në Shop, Biznese/Punë në Explore. Pa ndryshim të dataschema, backend, ruajtje apo rrjedhës së postimit.
- **a11y/i18n:** 4 keys të rinj `common:home*` në sq/en/it, mirrors root/demo byte-identike, menu scrollable në viewport të vogël, status Escape dhe fokus i ruajtur në rrugët e testuara. Testimi real TalkBack/VoiceOver mbetet NOT TESTED.
- **Prova:** commit kodi `676a1b8`, kandidat kod/test `7b8943`, security CI #40331804826 PASS, browser QA #40331804926 PASS. Fillimisht 294/296 teste kaluan; 2 teste të reja supozonin gjuhë parazgjedhje dhe navigation bar të vjetër, u korrigjuan në 7b8943 pa ndryshuar kodin e aplikacionit.
- **Ruhet:** Header `ILLYRIAN | Kalendari | Mundësi | Njoftime`, Home Stories → composer → Shop → Feed, v15 Studio dhe Draft PR #1. Pa merge/main/Production.

## Vercel Preview i vazhdueshëm — kërkesa e pronarit, 26 tetor 2026

**URL fikse për telefonin:** [ILLYRIAN — latest feature-branch Preview](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/). Është alias ekzistues Vercel i lidhur automatikisht me `feat/i18n-shop-feedback-20261022`, projekt `illyrian-demo` / team `un24`; më 26 tetor alias tregonte source `785a582`, READY, nga metadata Vercel; HTML/assets QA kërkojnë verifikim më vete. **Pas çdo commit-i** në degën e autorizuar verifiko që Preview i ri është READY, target **jo Production**, alias-i tregon commit-in e duhur, skedarët kryesorë shërbehen saktë dhe CI për SHA-në përkatëse raportohet veç. Nuk kërkohet manual deploy kur Git integration funksionon; nëse build-i dështon, mos thuaj që alias-i ka versionin e ri. Mbaj URL immutable/SHA të çdo sesioni QA si provë, sepse alias-i i telefonit ndryshon me deploy-et e reja. Vercel Authentication mund të kërkojë hyrje në telefon; mos dobëso mbrojtjen. Pa merge / `main` / Production.

## Rikuperimi dhe historia

Lexo këtë skedar → [MASTER_HANDOFF](MASTER_HANDOFF.md) → [AGENTS](AGENTS.md) dhe regjistrin e sigurisë për ndryshimin relevant; pastaj vetëm referencat e nevojshme. Verifiko HEAD/PR/diff/CI dhe, nëse preket Preview, source/target. Arkivi lexohet vetëm për pyetjen historike konkrete: [indeksi dhe kopjet e plota](docs/archive/continuity/README.md). Mos i rikthe checkpoint-et e vjetra si gjendje aktive.
