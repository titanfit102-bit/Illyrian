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

**Përfundim:** v1.6 është krijuar dhe kalon kontrollin e sintaksës plus 28 teste të simuluara; **nuk është ende e verifikuar në shfletues real dhe nuk është gati të quhet e miratuar për Production**.
