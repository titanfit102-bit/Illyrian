# ILLYRIAN — Demo v1.6 | Stories & Reels Viewer

**Data:** 21 tetor 2026  
**Status:** Version eksperimental në degë të izoluar; jo i publikuar si Production.  
**Dega:** `demo/v1.6-stories-reels`  
**Burimi:** `demo/ILLYRIAN_DEMO_v1.5.html` në `main`, blob SHA `7ccaf85d5df3c86ebb4a6d2883b955e7de0ac693`.  
**Skedari i ri:** `demo/ILLYRIAN_DEMO_v1.6.html`  
**Commit i krijimit të v1.6:** `2e37c6993b48c6aa5b599e6e78dc146548dcede5`.

## Kufiri i autorizuar

- Krijimi i izoluar i HTML-së v1.6 dhe i këtij raporti në GitHub; auditim dhe teste jodestruktive.
- **Nuk** ndryshohen skedarët v0.7–v1.5, `main`, `demo/vercel.json`, Google Drive, ose Vercel Production.
- **Nuk** krijohet APK/Expo, backend, përdorues realë, video encoder ose publikim real i përmbajtjes.

## Çfarë ndryshoi në v1.6

1. **Krijimet personale v1.5 shfaqen në viewer të plotë:** Story me progres 8 sekonda dhe pause/resume; Reel me fotografi të animuar e etiketuar shprehimisht si jo-video.
2. **Navigimi:** para/mbrapa me kontrolle; tastierë (`Escape`, shigjeta); rrëshqitje horizontale për Stories dhe vertikale për Reels. Të njëjtat ndërveprime plotësojnë viewer-at ekzistues të përmbajtjeve shembull.
3. **Rrjedha te planet:** Story/Reel personal → aktivitet demonstrues → kthim te e njëjta përmbajtje. Ruhet origjina Home ose Profile dhe pozicioni i ekranit gjatë kësaj rrjedhe.
4. **Ndërveprimet:** pëlqim lokal, ruajtje lokale e Reels personale, komente të shkurtra demonstrative për Reels shembull/personale; komente të krijimeve personale edhe në Story. Butoni 'Ndaj' sqaron se nuk ka URL publike të krijimit lokal.
5. **Ruajtje më e sigurt:** e njëjta key `illyrian_demo_v15_creator` vazhdon të lexohet; publikimi/fshirja/pëlqimi bëhen me rikthim të gjendjes nëse shkrimi dështon (p.sh. quota). Kufiri mbetet 6 Stories + 6 Reels personale.
6. **Identiteti dhe funksionet:** nuk modifikohen SVG-të e navigimit v1.2, logoja e aprovuar, pesë ngjyrat bazë, tre temat, rrjedhat e tjera sociale dhe navigimi ekzistues. Nuk ndryshohet asnjë skedar i mëparshëm.

## Verifikim i realizuar realisht në këtë punë

### 1. Kontroll i kodit

- JavaScript-i inline i **skedarit të ri v1.6** u parsua me sukses në V8 (`new Function`): **PASS**.
- Vlerësimet strukturore të ruajtjes së versionit të mëparshëm, çelësit të të dhënave v1.5, ikonave të navigimit dhe mungesës së videos reale: **PASS**.
- Kontrolli në GitHub pas shkrimit verifikoi ekzistencën e v1.6 në degën e re dhe se `main` mbetet në commit `9f91b5c083b4482a70a2149483cc799360e6102c`.
- `demo/vercel.json` në `main` vazhdon të drejtojë `/` te `/ILLYRIAN_DEMO_v1.5.html`.
- Vercel Production vazhdon të raportojë deployment-in `dpl_a9wJ8nGy8SQ54mzDRmcLnQ1qD31U`, gjendja `READY`, commit-i i v1.5.

### 2. Teste runtime të simuluara — 28/28 të kaluara

JavaScript-i i ri u **ekzekutua** në një mjedis V8 me `document`, `localStorage`, kontrolle dhe event listeners të imituara në memorie (mock DOM). Nuk u përdor shfletues real për këto prova.

**Seria A (18 kontrolle):** ngarkimi i gjashtë Stories të v1.5; quota failure gjatë publikimit pa humbje të të dhënave; qëndrimi te forma pas dështimit; publikim me sukses dhe kufizim 6; renditja e krijimit; largimi i të vjetrës vetëm pas shkrimit; pëlqimi i ruajtur; komenti lokal; escape i HTML-së së komentit; quota failure gjatë fshirjes dhe ruajtja e gjendjes; fshirja me sukses; mbyllja; shfaqja e Reel ekzistues; Reels shembull, kalimi te Reel pasues; Stories shembull dhe kalimi te Story pasues.

**Seria B (10 kontrolle):** hapja e Story personale; para/mbrapa; pause/resume; kthimi te Profile; shigjeta e tastierës për Reels; `Escape` për dalje; swipe horizontal për kalimin e Story.

**Prova të rrjedhës shtesë gjatë simulimit:** Story personal → plan → kthim te Story; reagimet dhe ruajtja në viewer; Reel shembull → komente → kthim te Reel.

### 3. Kufizimet që NUK duhen raportuar si PASS

- Nuk është kryer test E2E në Chrome/Chromium real apo në telefon Android/iOS.
- Nuk është verifikuar pamja vizuale reale, kontrasti, fokusi, overflow, animacionet dhe madhësitë 360–430 px në browser real.
- Nuk është ekzekutuar një seri timersh me kohë reale për progresin 8s, as testuar swipe në pajisje me ekran me prekje.
- Nuk është audituar përputhja piksel-me-piksel e PNG-së zyrtare të logos me ikonën e embeduar të browser-it.
- Testet me DOM të imituar nuk provojnë siguri production, aksesueshmëri të plotë, integrim backend, apo sjelljen e browser storage në çdo pajisje.
- Nuk është kontrolluar hapja e v1.6 përmes Vercel Production, pasi publikimi nuk është autorizuar.

## Testet e detyrueshme PARA miratimit të publikimit

1. Hapja e skedarit të v1.6 në browser real; verifikimi i konsolës pa exceptions dhe pa overflow horizontal në madhësitë 360, 390, 430 px.
2. Stories standarde dhe personale: next/prev, pause/resume, 8s, close, touch/swipe dhe refresh.
3. Reels standarde dhe personale: scroll/swipe, like, koment, ruaj, profil, plan, kthim.
4. Kontrolli Light/Dark/Automatik dhe `prefers-reduced-motion`, me kontroll kontrasti.
5. Regresioni: Home/Search/Reels/Messages/Profile, njoftimet, krijimi, eventet, komunitetet, profil privat, onboarding një-herësh dhe krijimet e v1.5.
6. Verifikim vizual me logon V-001 pa e modifikuar; kontroll i ikonave të v1.2.
7. Vetëm pas miratimit të përdoruesit: vendim i veçantë për integrim në `main` dhe më pas publikimin në Vercel.

## Rikthimi dhe gjendja

- v1.5 mbetet në `main`, nuk është mbishkruar dhe vazhdon të jetë rruga e Vercel Production.
- v1.6 është i izoluar në degën `demo/v1.6-stories-reels`, kështu që mund të krahasohet pa prekur v1.5.
- **Pa miratim të mëtejshëm nuk bëhet merge, update i `vercel.json`, ose ndryshim në Drive.**

## Korrigjimet e autorizuara — v1.6 (21 tetor 2026)

**Autorizimi:** përdoruesi kërkoi “vazhdo” pas propozimit për korrigjimin e dy problemeve, vetëm në këtë skedar HTML dhe raportin e tij në degën e testimit.

**Commit i korrigjimit:** `6f5402328e58a3c9db2908efe4f4ee9f1632d98d`.

### Korrigjimi A — Reel → profil/mesazh → i njëjti Reel

- Për Reel-in demonstrues ruhet indeksi, tab-i i origjinës dhe pozicioni i ekranit përpara hapjes së profilit të autorit ose bisedës.
- Paneli i profilit/bisedës ka veprimin «Kthehu te Reel». Edhe mbyllja normale dhe prekja e sfondit të modalit kthejnë te Reel-i nga u nis përdoruesi.
- Kur përdoruesi lundron në një tab ose modal tjetër të palidhur, konteksti i kthimit pastrohet. Nuk ka navigim të serverit ose llogari reale.

### Korrigjimi B — Fundi i Stories

- Pas Story të fundit **personal**, kalimi me «Tjetra» ose mbarimi i progresit 8s e mbyll viewer-in dhe rikthen origjinën Home/Profile, në vend të kalimit ciklik te Story i parë.
- Në Story e parë personale, «Më parë» nuk e çon përdoruesin automatikisht në fund.
- Për katër Stories demonstrative ekzistuese, veprimi manual «Tjetra» te Story i fundit tani e mbyll viewer-in; kalimi automatik e mbyllte tashmë.
- Kalimi ciklik i Reels është i pandryshuar.

### Testimi pas korrigjimeve

**17/17 kontrolle të reja të simuluara — PASS**, me V8 dhe DOM/localStorage/timers të imituar:

1. Hapja e Story personale; kalimi te Story tjetër.
2. Story personal i fundit: mbyllje manuale dhe automatike; ruhet pozicioni i origjinës.
3. Story personal i parë: «Më parë» nuk rrotullohet në fund.
4. Story demonstrativ i fundit: mbyllje manuale.
5. Hapja e Reel-it të dytë demonstrues dhe rikthimi te i njëjti Reel nga profili i autorit me «Mbyll», duke ruajtur scroll.
6. Kthimi nga biseda me butonin e ri; kthimi nga profili me butonin e ri dhe nga mbyllja e overlay-t.
7. Kalimi te Reel pasues funksionon; Reel personal funksionon.
8. Komentet demonstrative të Reels dhe kthimi nga paneli i komenteve vazhdojnë të funksionojnë.

**Totali historik i kontrolleve të simuluara të raportuara për v1.6: 57** (28 fillestare + 12 të mëtejshme + 17 për këto korrigjime). Këto janë ekzekutime me simulim, jo 57 teste end-to-end në Chrome ose në telefon.

**Kufizimet:** Nuk është realizuar test me browser grafik real apo telefon fizik. SSO/aksesi në Preview dhe testimi vizual 360/390/430 px mbeten të hapur. Nuk deklarohet readiness për Production.

**Kufiri i ndryshimit:** v1.5 në `main`, `demo/vercel.json`, Google Drive dhe Vercel Production nuk ndryshohen. Preview i degës mund të rifreskohet automatikisht nga Vercel.

**Përfundim:** v1.6 përmban dy korrigjimet dhe ka kaluar kontrollet e sintaksës plus 57 teste të simuluara të raportuara; **ende kërkon verifikim real në shfletues/telefon përpara miratimit për Production**.


## Korrigjimi i gjesteve dhe etiketave — 21 tetor 2026

**Autorizimi:** pas raportit të testimit real të demos, përdoruesi tha “vazhdo”, duke miratuar vetëm dy korrigjimet e propozuara: rrëshqitjen te Stories/Reels demonstrative dhe etiketat e vjetra të versionit.

**Commit HTML:** `94562744b2fd1da70ae4885bb900ef42ff841d45`.

### Ndryshime minimale në v1.6

1. `.story-overlay` merr `touch-action:pan-y`, që lejon lëvizjet normale vertikale të shfletuesit por ia lë aplikacionit gjestin horizontal për Stories demonstrative.
2. `.v4-reel-overlay` merr `touch-action:pan-x`, që ruan gjestet horizontale të shfletuesit por ia lë aplikacionit gjestin vertikal për Reels demonstrative.
3. Etiketa prezantuese ndryshon nga `VERSIONI 1.5 · PROTOTIP` në `VERSIONI 1.6 · PROTOTIP`.
4. Etiketa e ekranit të hyrjes ndryshon nga `DEMO v1.5 · Vetëm simulim` në `DEMO v1.6 · Vetëm simulim`.

Nuk modifikohet përmbajtja, identiteti grafik, logjika e ruajtjes lokale, çelësat e localStorage, komponentët e videove apo programimi i aplikacionit real.

### Prova krahasuese në Chromium — para / pas

U ngarkua e njëjta HTML në Chromium real përmes `page.set_content`, me `localStorage` të imituar në memorie (për shkak të kufizimit të navigimit lokal). Gjesti u simulua nga Chrome DevTools Protocol (`Input.dispatchTouchEvent`, ngjarje `touchStart`/`touchMove`/`touchEnd`), në mënyrën e pajisjes me prekje.

| Gjerësia | Story demonstrative (Arta → Leon) para / pas | Reel demonstrues (1/3 → 2/3) para / pas |
|---|---|---|
| 360 px | FAIL / PASS | FAIL / PASS |
| 390 px | FAIL / PASS | FAIL / PASS |
| 430 px | FAIL / PASS | FAIL / PASS |

- Në versionin fillestar të dy overlay-t kishin vlerën CSS `touch-action:auto`. Pas korrigjimit shfaqin përkatësisht `pan-y` dhe `pan-x`.
- Në të gjashta ekzekutimet krahasuese nuk u regjistruan gabime të JavaScript gjatë skenarit.
- Etiketa `VERSIONI 1.6 · PROTOTIP` u konfirmua në të tre testet e versionit të korrigjuar.
- JavaScript-i inline u kontrollua sërish për sintaksë: **PASS**.

**Kufizimet e mbetura:** Prova përdor ngjarje prekjesh të emuluara në Chromium, jo telefon Android/iOS fizik. `localStorage` ishte i imituar gjatë QA-së, kështu që ky test nuk certifikon sjelljen e ruajtjes reale. Aksesueshmëria e plotë, auditimi i performancës dhe regresioni i plotë ndërshfletues mbeten për t'u kryer. Një Preview READY nuk provon që të gjitha rrjedhat janë verifikuar.

**Izolimi:** vetëm `demo/ILLYRIAN_DEMO_v1.6.html` dhe ky raport në degën `demo/v1.6-stories-reels`. Nuk ka merge në `main`, ndryshim të `demo/vercel.json`, Google Drive ose Vercel Production.

## Korrigjim i autorizuar — Enter dërgon mesazhin në grup (21 tetor 2026)

**Kufiri i ndryshimit:** vetëm `demo/ILLYRIAN_DEMO_v1.6.html` dhe ky raport në degën `demo/v1.6-stories-reels`. Nuk janë ndryshuar skedarë të tjerë, `main`, `demo/vercel.json`, Google Drive apo Vercel Production.

**Commit i HTML-së:** `b71cfb3bec5847062af8f1581cdf59e37f800269`.

### Problemi dhe zgjidhja

- **Problemi:** Në panelin demonstrues `group-chat`, futja e mesazhit me `Enter` në fushën `#group-input` nuk e niste veprimin, megjithëse butoni `data-act="group-send"` funksiononte.
- **Ndryshimi minimal:** Një event listener `keydown` që ndërhyn **vetëm** kur fusha aktive është `#group-input`, modali është `group-chat`, dhe indeksi i aktivitetit përputhet me butonin `group-send`. `Enter` përdor saktësisht të njëjtin buton ekzistues, pa kopjuar logjikën e dërgimit.
- Dërgimi me `Enter` nuk aktivizohet nëse përdoruesi mban `Shift`, `Ctrl`, `Alt` ose `Meta`, ose gjatë kompozimit të tekstit (`isComposing` / `keyCode===229`).
- Pas dërgimit me tastierë rikthehet fokusi te `#group-input`.
- Nuk është ndryshuar logjika e bisedave private, e komenteve ose e ruajtjes.

### Verifikimi para shkrimit në GitHub

Kodi i GitHub-it para korrigjimit u rikrijua nga skedari origjinal i përdoruesit dhe katër korrigjimet e miratuara të mëparshme. Hash-i Git i tij përputhej me `954081b234e6b07afc7719fc99cf0d93f035d1e2`, hash-i i versionit të fundit para këtij ndryshimi.

**Testi A — Chromium real, versioni fillestar:** Shkrimi i mesazhit në `group-chat` dhe shtypja e `Enter` nuk krijonin mesazh. Problemi u riprodhua pa gabime JavaScript.

**Testi B — Chromium real, versioni i korrigjuar:** **9/9 kontrolle të fokusuara kaluan**:

1. `Enter` dërgon mesazhin në bisedën e grupit.
2. Mesazhi shfaqet vetëm një herë (pa dyfishim).
3. Fokusi mbetet te fusha e mesazhit pas dërgimit.
4. `Enter` në fushë bosh nuk krijon mesazh.
5. `Shift+Enter` nuk e dërgon mesazhin.
6. `Ctrl+Enter` nuk e dërgon mesazhin.
7. `Enter` gjatë kompozimit IME nuk e dërgon mesazhin.
8. Butoni origjinal `group-send` vazhdon të punojë.
9. Mesazhet e të dy mekanizmave shfaqen në gjendjen e persistuar të demos.

**Gabime JavaScript gjatë provave:** asnjë. Script-i inline u kontrollua edhe sintaksisht (PASS).

**Kufizimi i verifikimit:** Testimi u ekzekutua në Chromium headless me HTML të ngarkuar në memorie dhe me një implementim të imituar të `localStorage`; nuk është kryer provë me telefon fizik ose navigim në Vercel Production. Rezultatet nuk duhet të paraqiten si test i plotë E2E me backend real.

**Gjendja:** korrigjimi është i verifikuar në Chromium dhe i ruajtur në degën e testimit. Nuk është autorizuar bashkimi në `main` ose publikimi i versionit në Production.


## Përmirësimet e aksesueshmërisë — 21 tetor 2026

**Autorizimi:** pas raportit të auditimit të aksesueshmërisë, përdoruesi kërkoi “vazhdo”, duke miratuar vetëm menaxhimin e fokusit të dialogëve, zonat e prekjes dhe përmirësimin e kontrastit të tekstit dytësor.

**Commit i HTML-së:** `206a148ff139d0672bbfe0de611c8a0e9a3be5e7`.

### Çfarë u ndryshua

1. **Dialogët (shtresë e izoluar v1.6):** Kur hapet një `[role="dialog"][aria-modal="true"]` në `#layer`, fokusi kalon brenda tij; ndërveprimet pas dialogut vendosen `inert`. `Tab` dhe `Shift+Tab` mbeten brenda dialogut; kur mbyllet, fokusi rikthehet te butoni i origjinës, edhe nëse renderimi ka krijuar një element të ri. Mbulon edhe viewer-in personal të Stories.
2. **Targetet e prekjes:** shtresë CSS që siguron të paktën `44×44 CSS px` për butonat brenda `#phone`, pa ndryshuar përmasat e ikonave SVG.
3. **Kontrasti Light:** ndryshojnë vetëm dy vlerat e `--muted` nga `#807680` dhe `#7F747F` në `#706570`. Ngjyrat zyrtare të markës nuk ndryshojnë. Tema Dark ruan `--muted:#B0A3AE`.

### Provat e kryera para shkrimit

Kontrolli u bë në **Chromium real** me një kandidat lokal, i ndërtuar nga kopja identike e commit-it paraprak të GitHub-it (Git blob SHA `20dd44aabd83f8af361fe46a9a9e6b5717fab85a`). Faqja u ngarkua me `set_content` dhe `localStorage` testues në memorie, jo përmes URL-së së mbrojtur të Vercel-it.

- **360 / 390 / 430 px:** hapja e dialogut të krijimit të Story; verifikimi i fokusit fillestar brenda; përmbajtja e Kryefaqes `inert`; `Tab` nga fundi te fillimi; `Shift+Tab` nga fillimi te fundi; `Escape` dhe rikthimi i fokusit te butoni që hapi dialogun. Kaluan në të tria përmasat.
- **320 / 390 px:** kontroll i veçantë për panelin e njoftimeve — hapje, mbajtje e fokusit, dalje me `Escape`, çaktivizim i `inert` pas mbylljes, fokus i restauruar. Kaloi.
- **320 / 390 px:** viewer personal i Story — fokus brenda, një `Tab` i sigurt, mbyllje me `Escape` dhe kthim te miniatura e Story. Kaloi.
- **320 / 390 px:** në Kryefaqe 53 butona të dukshëm u matën me `getBoundingClientRect()`; **53/53** kishin të dy dimensionet të paktën 44 px pas ndryshimit. Këto janë kontrolle të butonave të Kryefaqes, jo çdo kontroll i çdo ekrani.
- **320 / 360 / 390 / 430 px:** nuk u gjet scroll horizontal i dokumentit gjatë kontrolleve të kryera. Në 320 px formularët modalë kishin scroll vertikal të brendshëm, që është sjellje e pritshme për përmbajtje të gjatë.
- **Kontrasti matematikor (WCAG):** teksti `#706570` kundrejt `#FFFFFF` jep rreth **5.55:1**, kundrejt `#F8F5F6` rreth **5.12:1**, kundrejt `#F3EDF1` rreth **4.81:1** dhe kundrejt `#F2EBEF` rreth **4.73:1**. Këto raporte vlerësojnë këtë çift ngjyrash, jo çdo tekst të aplikacionit.
- **Dark:** vlera e `--muted` u verifikua e pandryshuar `#B0A3AE`; nuk u gjetën gabime JavaScript në këta skenarë. Sintaksa e JavaScript-it u verifikua.

### Çfarë ende nuk është verifikuar

- Nuk është kryer auditim i plotë WCAG, test NVDA/VoiceOver, apo provë fizike Android/iOS.
- Nuk janë matur të gjitha kombinimet tekst/sfond, të gjitha gjestet në çdo ekran, apo të gjitha gjendjet me zoom 200–400%.
- Nuk është matur performanca e rrjetit celular ose Lighthouse. Ky ndryshim **nuk** e certifikon aplikacionin si të aksesueshëm në mënyrë të plotë.
- Kodi i publikuar në GitHub ka një implementim funksionalisht ekuivalent me kandidatin lokal të testuar; për shkak të kufizimit të aksesit SSO, nuk është testuar me navigim real te URL-ja e Vercel Preview pas commit-it.

**Izolimi:** janë ndryshuar vetëm skedari HTML i v1.6 dhe ky raport në degën `demo/v1.6-stories-reels`. Nuk ka autorizim për merge, ndryshim `vercel.json`, Google Drive apo Vercel Production.


## Fokus i sigurt në ekranin fillestar — 21 tetor 2026

**Autorizimi:** Përdoruesi kërkoi “vazhdo” pas propozimit për të korrigjuar vetëm rrjedhën me tastierë të ekranit fillestar të mirëseardhjes.

**Commit HTML:** `a7d3c33568c2a069e809aee0de3ce9179d72827e`. Ndryshimi është i izoluar në fund të skriptit të v1.6 dhe mbështjell vetëm funksionin ekzistues `v7Render`, pa rishkruar logjikën e hyrjes.

### Problemi

Në hapjen e parë, ekranit `#v7-auth` i mungonte menaxhimi modal i fokusit; shtypja e `Tab` e çonte fokusin te butonat e fshehur të Kryefaqes, edhe pse vizualisht ishte i hapur ekrani i mirëseardhjes.

### Korrigjimi

- Kur `#v7-auth` është i dukshëm, i caktohet roli `dialog`, `aria-modal="true"` dhe një emër i aksesueshëm; përmbajtja pas tij vendoset `inert`.
- Fokusi fillestar shkon te kontrolli i parë i ekranit. `Tab` dhe `Shift+Tab` qarkullojnë vetëm midis kontrolleve të dukshme dhe aktive të hyrjes.
- Fokusi ruhet te zgjedhja përkatëse gjatë rirenderimit të të njëjtit hap (p.sh. te interesat e onboarding).
- Pas përfundimit si vizitor ose pas krijimit të profilit demonstrues, `inert` hiqet; fokusi kthehet te kontrolli i origjinës kur ekziston, përndryshe te navigimi i aplikacionit.
- Funksionet e vjetra të Story/Reel, mesazheve, përmbajtjes dhe ruajtjes lokale nuk ndryshohen.

### Testet para commit-it

Rrjedha fillestare u testua në Chromium përmes `page.set_content` dhe ruajtjes së simuluar në memorie, në **320, 360, 390 dhe 430 CSS px**.

Në secilën gjerësi kaluan **12 kontrolle të fokusuara**: dialogu dhe `aria-modal`, fokusimi fillestar, `Tab` përpara, qarkullimi pas elementit të fundit, `Shift+Tab` prapa, mbrojtja nga fokusimi programatik i sfondit, hapja e regjistrimit demo, kthimi te mirëseardhja, hyrja demo, rikuperimi demonstrues, turneu i vizitorit dhe lirimi i fokusit/`inert` pas përfundimit. **48/48** në total; asnjë gabim JavaScript.

Veçmas, kaloi rruga e plotë e regjistrimit të një profili demonstrues me tri hapa dhe përzgjedhje interesi, përfshirë mbajtjen e fokusit në të njëjtin interes pas klikimit.

**Kufizim:** testimi është bërë në kopjen lokale me këtë shtresë të izoluar të aplikuar në burimin v1.6; është verifikuar edhe sintaksa e plotë JS në GitHub para commit-it. Nuk përbën test në telefon fizik, auditim të plotë WCAG apo testim E2E direkt te domeni i mbrojtur Preview.

**Izolimi:** vetëm `demo/ILLYRIAN_DEMO_v1.6.html` dhe `demo/ILLYRIAN_DEMO_v1.6_NOTES.md` në degën `demo/v1.6-stories-reels`. Nuk ndryshohen `main`, Google Drive ose Vercel Production.
