# ILLYRIAN — Arkitektura i18n / l10n në DEMO v1.7

**Data:** 22 tetor 2026 · **Dega:** `demo/v1.7-illyrian-shop` · **Status:** Implementim fillestar; verifikimi i plotë i gjuhëve nuk është certifikuar.

## Gjendja që u verifikua

DEMO është HTML + JavaScript statik (pa React, TypeScript ose `tsconfig`). Tekstet shqiptare ekzistuese shpërndahen në skedarin e madh HTML dhe gjashtë module të veçanta. Para integrimit nuk kishte zgjedhës gjuhe të lidhur me ekranet. Konfigurimi Playwright përdor Chromium të automatizuar në GitHub Actions. Baza e fundit e konfirmuar para i18n: 32/32 teste Playwright PASS, duke përfshirë 126/126 QA Lab bazë dhe 147/147 QA Lab advanced (run #39839958152).

## Vendimi arkitekturor

**Biblioteka:** i18next **25.7.0**, UMD e ruajtur lokalisht te `demo/i18n/vendor/i18next.min.js` (MIT; LICENSE përfshihet). Nuk kërkohet CDN, shërbim përkthimi ose abonim. `i18n/illyrian-i18n.js` është adapteri i izoluar i aplikacionit. Kopjet te `demo/i18n/` përdoren nga serveri statik/Vercel; skedarët e burimit te rrënja `i18n/` mbeten referencë. Mbaji **identikë** kur korrigjon katalogët/adapterin.

**Locale:** Shqip `sq`, English `en`, Italiano `it`. Anglishtja është fallback teknik. Përzgjedhja sipas radhës: preferenca në `localStorage['illyrian_demo_ui_language_v1']`, pastaj gjuha e parë e përputhshme nga `navigator.languages`, pastaj anglishtja. Prefereca e gjuhës është e ndarë nga account/profile/feed state; ndërrimi nuk fshin apo ridimensionon përmbajtjen.

**Integrimi:** Profile → Settings → Language (Gjuha) ka tre butona që ndryshojnë gjuhën dhe ruajnë zgjedhjen. `document.documentElement.lang` dhe `dir` përditësohen. Kodi ekzistues emeton përkohësisht tekst shqip; adapteri lokalizon etiketat e njohura nga katalogët me tekst origjinal, duke ndjekur renderimet DOM përmes `MutationObserver`.

**Katalogët:** 206 çelësa semantikë **në secilën gjuhë** dhe 14 namespace: `common`, `navigation`, `settings`, `home`, `discover`, `reels`, `messages`, `plans`, `shop`, `shopPlus`, `connections`, `privacy`, `governance`, `onboarding`. Katalogët janë të ndarë nga komponentët/logjika. Identifikuesit, `data-act`, vlerat e filtrave, të dhënat e llogarisë dhe postimet/komentet/mesazhet e përdoruesve **nuk janë çelësa lokalizimi**.

## API për zhvilluesit

```js
IllyrianI18n.language
IllyrianI18n.changeLanguage('it');
IllyrianI18n.t('navigation:home');
IllyrianI18n.t('common:count', {count: 3}); // plural
IllyrianI18n.number(1234.5);
IllyrianI18n.currency(24.95, 'EUR');
IllyrianI18n.date(new Date(), {dateStyle: 'medium'});
```

**Rregull:** Për çdo veçori të re, përdor **çelësa semantikë** (`namespace:key`) dhe jo përkthim të bazuar në zëvendësim teksti. Mos përkthe përmbajtjen që shkruajnë përdoruesit: kjo do të jetë një funksion i ndryshëm, me pëlqim/kufij privatësie, në fazë të ardhshme. Rishiko gjithmonë gjatësinë e etiketave, mesazhet e gabimit dhe `aria-label`.

## Shtimi i gjuhëve të reja

1. Krijo katalogun e gjuhës duke nisur nga **të gjithë çelësat anglisht**, me pluralet dhe përkthim të shqyrtuar nga folës kompetentë.
2. Shto kodin te lista `supported` e adapterit, te Settings dhe te loader-i i DEMO-s; mbaj pasqyrën në `demo/i18n/` të sinkronizuar me burimin.
3. Përshtat `document.dir='rtl'` dhe gjeometrinë, ikonat, tipografinë e menutë **para** aktivizimit të gjuhëve arabe/hebraike/persiane. RTL nuk është ende aktiv.
4. Testo zbulimin e gjuhës së pajisjes, zgjedhjen manuale, rihapjen, fallback, pluralin, formatet, ekranet, modalet, tastierën, shop dhe orientimet portrait/landscape.
5. Shto kontroll automat të mbulimit të teksteve dhe aprovimin gjuhësor; mos deklaro 100% vetëm sepse katalogët kanë çelësa të njëjtë.

## Testet, kufijtë dhe porta e publikimit

- **Sintaksa:** i18next, adapteri dhe katalogët kaluan analizën JavaScript; 206/206 çelësa të përputhur në secilin lokal. Nuk ekziston pipeline TypeScript në repository.
- **E2E i shtuar:** `qa/illyrian-v17-i18n.spec.cjs`, me teste për locale `sq/en/it`, persistencën, zbulimin e gjuhës, fallback-un, pluralin, formatimin, Settings dhe përmbajtjen e postimeve.
- **Kufizim real:** teksti i vjetër në template të shumë moduleve është më i gjerë se 206 çelësat. Mungojnë përkthime për disa paragrafë, gabime, gjendje bosh dhe rrugë të avancuara të ndërfaqes. **Asnjë pretendim për përkthim të plotë në sq/en/it nuk është i justifikuar pa testim e inventar të shteruar.**
- Kërkohet CI jeshil pas commit-it të integrimit, audit i përkthimit të çdo ekrani, kontroll i skedave të gjata dhe audit manual në telefon nga pronari në fund të etapës. Nuk ka backend, përkthim të përmbajtjes së përdoruesve apo funksion pagese të aktivizuar.

## Hapat e radhës

Inventarizo të gjitha tekstet e dukshme dhe dinamikat, zgjero katalogët, përditëso komponentët me `t()` eksplicite, bëj audit kuptimor të përkthimit dhe testo regresionin e të gjitha moduleve në tre gjuhë. Pas kësaj përdoruesi do të bëjë QA e plotë në telefon dhe do të dërgojë screenshot-e. `main` dhe Production mbeten të paprekura.
