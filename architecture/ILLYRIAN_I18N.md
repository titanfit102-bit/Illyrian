# ILLYRIAN — Arkitektura i18n / l10n në DEMO v1.7

**Data:** 22 tetor 2026 · **Dega:** `demo/v1.7-illyrian-shop` · **Status:** Implementim fillestar; verifikimi i plotë i gjuhëve nuk është certifikuar.

## Gjendja që u verifikua

DEMO është HTML + JavaScript statik (pa React, TypeScript ose `tsconfig`). Tekstet shqiptare ekzistuese shpërndahen në skedarin e madh HTML dhe gjashtë module të veçanta. Para integrimit nuk kishte zgjedhës gjuhe të lidhur me ekranet. Konfigurimi Playwright përdor Chromium të automatizuar në GitHub Actions. Baza e fundit e konfirmuar para i18n: 32/32 teste Playwright PASS, duke përfshirë 126/126 QA Lab bazë dhe 147/147 QA Lab advanced (run #39839958152).

## Vendimi arkitekturor

**Biblioteka:** i18next **25.7.0**, UMD e ruajtur lokalisht te `demo/i18n/vendor/i18next.min.js` (MIT; LICENSE përfshihet). Nuk kërkohet CDN, shërbim përkthimi ose abonim. `i18n/illyrian-i18n.js` është adapteri i izoluar i aplikacionit. Kopjet te `demo/i18n/` përdoren nga serveri statik/Vercel; skedarët e burimit te rrënja `i18n/` mbeten referencë. Mbaji **identikë** kur korrigjon katalogët/adapterin.

**Locale:** Shqip `sq`, English `en`, Italiano `it`. Anglishtja është fallback teknik. Përzgjedhja sipas radhës: preferenca në `localStorage['illyrian_demo_ui_language_v1']`, pastaj gjuha e parë e përputhshme nga `navigator.languages`, pastaj anglishtja. Prefereca e gjuhës është e ndarë nga account/profile/feed state; ndërrimi nuk fshin apo ridimensionon përmbajtjen.

**Integrimi:** Profile → Settings → Language (Gjuha) ka tre butona që ndryshojnë gjuhën dhe ruajnë zgjedhjen. `document.documentElement.lang` dhe `dir` përditësohen. Kodi ekzistues emeton përkohësisht tekst shqip; adapteri lokalizon etiketat e njohura nga katalogët me tekst origjinal, duke ndjekur renderimet DOM përmes `MutationObserver`.

**Katalogët:** 290 çelësa semantikë **në secilën gjuhë** dhe 15 namespace: `common`, `navigation`, `settings`, `home`, `discover`, `reels`, `messages`, `plans`, `shop`, `shopPlus`, `connections`, `privacy`, `governance`, `onboarding`, `profile`. Katalogët janë të ndarë nga komponentët/logjika. Identifikuesit, `data-act`, vlerat e filtrave, të dhënat e llogarisë dhe postimet/komentet/mesazhet e përdoruesve **nuk janë çelësa lokalizimi**.

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

- **Sintaksa:** i18next, adapteri dhe katalogët kaluan analizën JavaScript; 290/290 çelësa të përputhur në secilin lokal. Nuk ekziston pipeline TypeScript në repository.
- **E2E i shtuar:** `qa/illyrian-v17-i18n.spec.cjs`, me teste për locale `sq/en/it`, persistencën, zbulimin e gjuhës, fallback-un, pluralin, formatimin, Settings dhe përmbajtjen e postimeve.
- **Kufizim real:** teksti i vjetër në template të shumë moduleve është më i gjerë se 206 çelësat. Mungojnë përkthime për disa paragrafë, gabime, gjendje bosh dhe rrugë të avancuara të ndërfaqes. **Asnjë pretendim për përkthim të plotë në sq/en/it nuk është i justifikuar pa testim e inventar të shteruar.**
- Kërkohet CI jeshil pas commit-it të integrimit, audit i përkthimit të çdo ekrani, kontroll i skedave të gjata dhe audit manual në telefon nga pronari në fund të etapës. Nuk ka backend, përkthim të përmbajtjes së përdoruesve apo funksion pagese të aktivizuar.

## Hapat e radhës

Inventarizo të gjitha tekstet e dukshme dhe dinamikat, zgjero katalogët, përditëso komponentët me `t()` eksplicite, bëj audit kuptimor të përkthimit dhe testo regresionin e të gjitha moduleve në tre gjuhë. Pas kësaj përdoruesi do të bëjë QA e plotë në telefon dhe do të dërgojë screenshot-e. `main` dhe Production mbeten të paprekura.


## Cikli i lokalizimit 2 — mbulimi i katalogëve (22 tetor 2026)

- U shtuan **84 çelësa semantikë për secilën gjuhë**, për Shop, Shop Plus, Reels, Plans, Discover, Home, Profile dhe Common. Tani ka **290/290/290 çelësa** në **15 namespace** (`profile` i ri). Leximi me JavaScript konfirmoi paritet 100% të emrave të çelësave; të gjitha 3 kopjet `i18n/locales/` janë **bit-për-bit identike** me `demo/i18n/locales/`. Commit: `fbd04ad37c653a233617a7464ad6a15a550c9b4a`.
- QA inventory i vërtetë në Chromium (run #39852230406) për 12 pamje të kampionuara: **238 etiketa të vrojtuara**, nga **150 të pambuluara** në raportin e parë, në **81 të pambuluara** pas shtimit të katalogëve. Shumica e 81 janë tituj personash, përshkrime/listime shembull, bashkime të etiketa-ve `select`, emra qytetesh ose përmbajtje e krijuar — nuk do të përkthehen automatikisht pa klasifikim të saktë. **Ky rezultat nuk provon 100% mbulim të UI** sepse nuk përfshin çdo gjendje gabimi, dialog, formular dhe rrugë kushtore.
- Funksionet e formatimit të çmimeve në `ILLYRIAN_SHOP_v1.7.js` dhe `ILLYRIAN_SHOP_PLUS_v1.7.js` përdorin tani **Intl.NumberFormat për gjuhën aktive** (EUR); shuma dhe çmimi i ruajtur mbeten të pandryshuar. Commit: `9e40d6dd7c2e11b053b6f80ed87bf8af7d842776`. GitHub Actions #39852521431 përfundoi `success`.
- E2E i ri: 3 teste për EUR formati lokal dhe 3 skenarë për titujt e Shop, Plans, Privacy dhe Governance në `sq/en/it`; testet e fundit janë shtuar te `qa/illyrian-v17-i18n.spec.cjs` në commit `7d7b3dbf3ae7a4744c5dad4e2f75fac548b00dcb`. Resultado final i run #39852708170 duhet regjistruar veçmas pas mbylljes (në çastin e shkrimit ishte ende në ekzekutim).
- **Borxhi arkitekturor i njohur:** për tekstet historike përdoret një adapter tranzitor `MutationObserver` + fjalor frazash të njohura; gjatë zhvillimit të ri duhet përdorur `IllyrianI18n.t('namespace:key')` direkt në template dhe rregullat semantike. Vlera e filtrave, mesazhet, postimet, emrat e përdoruesve, listimet dhe përmbajtja e shkruar nga përdoruesit duhet të jenë jashtë përkthimit të UI. Për të arritur 100% mbulim duhen etiketuar të gjitha rrugët e trashëguara, jo thjesht shtuar gjuhë.
- RTL mbetet përgatitje në API `lang/dir`, por kërkon audit të strukturës, CSS logical properties dhe test me arabisht përpara aktivizimit. Nuk ekziston pipeline TypeScript në këtë repo statik; nuk është pretenduar test TS.


## CIKLI i18n 2 — rezultati final i verifikuar në GitHub Actions (22 tetor 2026)

- GitHub Actions run [#39852708170](https://github.com/titanfit102-bit/Illyrian/actions/runs/39852708170), commit `7d7b3dbf3ae7a4744c5dad4e2f75fac548b00dcb`, **completed/success: 53/53 teste Playwright PASS (1.9m)**. Kjo suitë përfshin teste të reja për formatimin EUR në sq/en/it, titujt e Shop/Plans/Privacy/Governance në secilën gjuhë, ruajtjen e preferencës, fallback, pluralizimin dhe regresionet e mëparshme. Nuk është certifikim i 100% të çdo teksti historik në DEMO.
- **Vercel Preview nuk është sinkronizuar me kodin më të ri:** statusi i Vercel për commit-in dokumentues `bb2794e67c1f8cf68ea5eeb4325f38813645682b` është `failure` me destinacion `upgradeToPro=build-rate-limit`. Preview-i i verifikuar READY ishte ende mbi commit-in `fbd04ad37c653a233617a7464ad6a15a550c9b4a`; kështu ndryshimet e formatimit EUR dhe testet shtesë mund të mos jenë publikuar atje. Ky është **kufizim deploy/plan**, jo dështim i suite-s Chromium. Nuk u ndryshuan pagesa, plan, domain apo Production për ta anashkaluar kufirin.
- **Kufiri i mbulimit gjuhësor:** 290 çelësa secila nga 3 gjuhët dhe 15 namespace janë të verifikuar, por nuk është mbyllur lokalizimi i çdo dialogu, formulari, gjendjeje bosh ose gabimi. Ka nevojë për inspektim më të thellë të përmbajtjes UI në gjuhët en/it, migrim nga lookup trashëgimie në çelësa direkt dhe testim final në telefon.


## Cikli i18n 3 — Shop runtime feedback (22 tetor 2026; audit i pavarur)

- Audit i lidhur me HEAD bazë `015ce439e7c6d736149c6c300391586517664f62`; dega `main` e pandryshuar në `9f91b5c083b4482a70a2149483cc799360e6102c` në çastin e auditit. Repository u konfirmua **PUBLIC**, ndryshe nga përshkrimi i vjetër “private”: kontrolli i ekspozimit është detyrë sigurie para backend-it real.
- CI historike #39852708170 u verifikua nga logu: **53 passed (1.9m)** mbi SHA `7d7b3db...`. Nuk certifikon të gjitha rrugët e UI.
- Vercel READY i fundit i verifikuar ishte SHA `fbd04ad...`, jo HEAD; statusi Vercel në HEAD është **failure / build-rate-limit**. Nuk ka deployment të ri të deklaruar.
- Zbulim konkret: `demo/ILLYRIAN_SHOP_v1.7.js` kishte gjashtë mesazhe runtime (toast, validim, ruajtje, konfirmim fshirjeje) vetëm në shqip. U migruan në `IllyrianI18n.t('shop:*')` pa prekur kategoritë, produktet, ruajtjen lokale, vlerat e filtrave ose emrat e përdoruesve.
- U shtuan gjashtë çelësa semantikë në çdo katalog `en/sq/it` (296 total në secilën gjuhë), me pasqyra te `demo/i18n` identike. U shtuan tre skenarë Chromium për mesazhin e shtimit në shportë, validimin e formularit dhe ruajtjen e listimit në `sq/en/it`; totali i parashikuar është 56 teste, por rezultati final duhet marrë nga run i commit-it të ri.
- Kodi dhe workflow i testimit u vendosën vetëm te `feat/i18n-shop-feedback-20261022` (commit `3e3e651e1bc8a7cb07e1561f9b194bf300c81042`). Asnjë merge në demo/main, asnjë Production. CI e veçuar: https://github.com/titanfit102-bit/Illyrian/actions/runs/39857060705 .
- **Për vazhdim:** kërko rezultatin final të CI; nëse dështon, rregullo testin/kodin në këtë degë dhe ri-verifiko. Pastaj vazhdo me përkthimin direkt të formave/erroreve në Plans, Connections, Shop Plus, Privacy, Governance dhe UI kryesore. Audit i plotë visual/a11y dhe telefon fizik mbeten OPEN.



## P0-D regression hardening (23 October 2026; branch-only)
Cross-language bug class: implicit `<option>` values were translated with UI text, causing mismatches against immutable domain literals. Existing persisted Albanian values were preserved and controls now declare `value` explicitly in Shop, Shop Plus request/reports, Connections timeslots, and Governance report reasons. UI text remains localizable; an actual canonical enum/code migration needs a versioned data contract and separate tests.
Shop user-authored titles, seller and descriptions are explicitly marked `data-user-content` in tested detail/tile paths so phrase-based DOM replacement does not rewrite their display. Full UI vs UGC inventory is OPEN; adapter is transitional.
Storage-related i18n paths now return localized Shop error notices and avoid false successful feedback when browser persistence fails. Other modules retain their existing Albanian error strings: complete locale coverage remains OPEN.
Chromium regression #39868919668 at code SHA `b0a85f1119149d092328ae912d79299a87b9862f`: 65 PASS / 0 FAIL in 2.1m. This test evidence is scoped to browser flows, **not** every text string or real Android/iOS. Draft PR #1 unmerged.



### Phase 7 i18n migration checkpoint — 23 October 2026
Added explicit `IllyrianI18n.t('connections:*')` and `IllyrianI18n.t('governance:*')` for 23 runtime feedback keys in sq/en/it, with UTF-8 catalog parity **319 keys per locale / 15 namespaces** and exact `i18n/locales` and `demo/i18n/locales` mirrors. This protects storage-error and form-validation language without mutating domain codes (`home`, `origin`, report `reason`).
Scoped UGC exclusions in Governance mark user report targets/details, moderator explanation, and local draft text with `data-user-content`; this does not prove all user text in other modules is excluded.
Chromium run #39930979544 at `f5478b1716289bec575dfd5e23cd4294132dfcad` = **71 PASS / 0 FAIL**. Six locale-specific tests check Connections, Governance, unchanged persisted values and language-agnostic user report text. Two historical storage tests now explicitly select sq as part of the test setup rather than assume browser language.
Browser-only scope: does not certify every UI phrase, accessibility, native phone browsers or translated operational flows. The workflow must include `i18n/**` in path filters to catch root catalog-only changes; that isolated CI configuration change is tracked in the same documentation update.



### Phase 7 — Shop Plus semantic feedback and form preservation (23 October 2026)
Added 18 direct `IllyrianI18n.t('shopPlus:*')` feedback keys across sq/en/it; locale catalogs now contain **337 keys per language, 15 namespaces** and root/demo mirrors are identical. Runtime code/locale errors, form validation and simulated outcome notices follow the active language without translating persisted business enums. On quota failure, Shop Plus preserves user-filled fields and shows localized error in the open form; view transitions happen after persistence succeeds. Expanded DOM-based `data-user-content` exemptions for user-defined listing titles/store descriptions, requests/replies and report targets.
Validation: **80/80** Chromium Playwright PASS on code/tests SHA `893538c33dd7cdecf9aa77e359a999d649a7a247`, [run #39935174398](https://github.com/titanfit102-bit/Illyrian/actions/runs/39935174398). Static screen copy, select display-label translations, comprehensive UI/UGC separation, open-dialog language switch and phone-based accessibility/visual checks remain OPEN; no full localization readiness claim.


### P1-D UI phrase adapter checkpoint — Shop Plus form fields (23 October 2026)
Thirty-seven **new curated phrase-to-semantic-key entries** were added to `shopPlus` in sq/en/it, raising synchronized catalogs to 374 keys/locale / 15 namespaces. This is a **transitional compatibility approach**: the DOM i18n adapter maps label text to semantic keys, rather than the Shop Plus form template calling `t()` for each static label. It preserves original `select.value` for listing kind, location, rental period, deadline and reporting reasons. The current adapter only paints user-interface text/limited attributes and explicitly excludes selected UGC regions; further elimination of phrase matching remains architecturally preferable.
New Chromium coverage checks create/request/report form strings in three languages, live locale switching without clearing entered text, and stable original persisted option values. [Actions #39937253596](https://github.com/titanfit102-bit/Illyrian/actions/runs/39937253596) = **89/89 PASS** at code+tests SHA `429927296870ea6b6d6ca1e90ab3cb4726cb307d`. Remaining: direct bindings and global UGC audit, comprehensive text inventory, phone/browser/keyboard/screenreader checks.


### Phase 7 — Plans direct-key feedback and quota rollback (23 October 2026)
Plans now invokes `IllyrianI18n.t('plans:<key>')` through a scoped `feedback()` wrapper for 18 new dynamic and validation notices, reusing existing `plans:localStorageError`. Catalogs are synchronized at **392 keys per locale / 15 namespaces** for sq/en/it. It does not alter city, activity type, privacy, participant/status codes or user-authored values. Browser localStorage failures restore the last stored Plans state and avoid a false save confirmation; failed activity creation/edit keeps the existing form and entered text. Selected event title nodes are marked `data-user-content`. Full UGC inventory and screen translations remain open.
CI #39938445963 on code/test SHA `8c2ebfd57227f6f4f22ffa377a2067f83022c072`: **95/95 Chromium PASS (2.7m)**, including en/it locale and quota tests. This is browser QA only, not Android/a11y or backend security proof.


### P1-D Privacy and Map notices — 23 October 2026
Added 26 direct semantic `privacy:*` keys for sq/en/it; aligned locale catalogs at **418 keys/language in 15 namespaces**. Follow/membership persisted states and map-kind `all/activity/business` remain stable codes while status and visible option labels translate. On local-storage rejection, Privacy restores previous stored follow/membership state and displays an explicit localized error. User-generated names of displayed plan events and map listings are excluded from phrase replacement in the patched views. Duplicate plan-state notice removed.
**Evidence:** [Actions #39939993711](https://github.com/titanfit102-bit/Illyrian/actions/runs/39939993711), code/tests SHA `2048ca78c9d062cb2afa8028251a6f600456c36a`, **101/101 Playwright Chromium PASS (2.7m)**. Six new QA cases since 95 baseline validate persistence rejection/retry, translated state messages, enum immutability and UGC. The prior 98/101 run revealed duplicate status notices and was corrected without removing tests. Coverage is limited to tested simulated browser flows; access control is not real backend security. Static texts, accessibility and physical-device tests remain open.


### P1-D direct semantics vs phrase adapter boundary (23 October 2026)
Current partial migration makes explicit semantic i18n available in Privacy navigation, map UI and key static warnings. The old phrase-matching DOM translator remains for legacy screens; it must not run on direct-bound nodes. Both root and demo adapters now honor `[data-i18n-direct]` in their exclusion selector, alongside separate `[data-user-content]` for user text. The distinction matters: `data-i18n-direct` protects machine-localized UI, while `data-user-content` protects author-entered content from all UI translation. An observed Italian collision transformed correct direct `Profili` into `Profilo`; explicit marker fixes it and a dedicated Playwright test prevents recurrence.
Privacy dialog re-renders after `illyrian:language-changed` while preserving unsubmitted map `city/kind/q` and focus. Persisted domain code values stay unchanged.
Catalogs: **435 keys per sq/en/it locale**, 15 namespaces, exact root/demo mirrors, 17 new `privacy:*` static keys. Evidence: [Actions #39944600826](https://github.com/titanfit102-bit/Illyrian/actions/runs/39944600826) on code/test SHA `d803758ee14cfaa26bc5cab4eee8e27571d5a535`: **110/110 PASS (2.9m)**. This does not prove complete translation coverage or screen-reader/phone functionality. Remaining: migrate other modules to direct bindings, preserve per-dialog editable state, audit keyboard focus and live region announcements, and inventory all UGC strings.


### P1-D Plans form direct-binding checkpoint — 23 October 2026
Form markup now uses direct semantic `plans:*` translations for 25 newly added keys in sq/en/it. `choose(values,current,keyOf)` decouples the translated option label from canonical stored domain values, and `data-i18n-direct` stops the transitional phrase adapter from rewriting these elements. The open Plans dialog listens to `illyrian:language-changed`, rerenders the locale-aware form, restores unsaved form/chat fields and keyboard focus, with no write to persistent Plans state. Event user content (titles, venue, conditions, group messages) is protected in targeted DOM paths using `data-user-content`.
Catalog parity: **460 keys per language / 15 namespaces**, main and demo mirrors identical. Verified on exact SHA `5961a1d90a25b8d7768fe022ec3de3f3760e78a7` by [Actions #39946187468](https://github.com/titanfit102-bit/Illyrian/actions/runs/39946187468): **115/115 Chromium PASS (3.0m)**. This is browser-only evidence, not complete localization, accessibility or native-device certification. Audit remaining Plans strings, Shop Plus direct-key migration, and global UGC/visual regressions before release.
