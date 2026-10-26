# ILLYRIAN DEMO v1.7 — Fleta praktike e testimit në telefon

> **Status fillestar: NOT TESTED.** Kjo fletë është për të mbledhur rezultate reale. Nuk është raport testi i kryer, certifikim i aksesueshmërisë apo autorizim për release.
> Repository: `titanfit102-bit/Illyrian` · Draft PR #1, target `demo/v1.7-illyrian-shop` · dega e autorizuar `feat/i18n-shop-feedback-20261022`.

### Kontroll shtesë i Home header-it (26 tetor 2026; JO QA fizike)
- Për testim manual përdor [Preview-in automatik](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/) dhe verifiko në krye `ILLYRIAN | Kalendari | Mundësi | Njoftime`; prekje e Kalendarit, menuja Mundësi (Biznese/Punë/Të gjitha), Escape/Back/fokus, Njoftimet, krijimin e postimeve nga Feed, zoom/landscape dhe safe areas. Raporto version/OS/screenshot pa të dhëna personale.
- Code/test SHA `9ba6fa6`; [CI #40251911500](https://github.com/titanfit102-bit/Illyrian/actions/runs/40251911500) ishte IN PROGRESS gjatë dokumentimit. **Asnjë sesion fizik nuk është kryer këtu.**

## 1. Hap versionin e saktë

### Kandidati aktual — Mobile UI precision (JO QA fizike)
- **Source/test SHA:** `08d773cca9398f7d454abb6ada2aed7b14cd2201`; [Chromium + WebKit #40246035137](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137) **267/267 + 16/16 PASS**; [security #40246035149](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035149) PASS. Kodet e Fazës 3/Connections përfshihen.
- **Preview immutable:** https://illyrian-demo-2gv5m563l-un24.vercel.app/ · `dpl_8RPq5bLRA8CwGQApSiCgDZJgjEJh`, READY, target Preview null, root HTML / responsive CSS / Shop JS HTTP 200, përputhje me GitHub në SHA.
- **Para/pas:** [screenshots para](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438045/artifacts/12617440183) dhe [screenshots pas](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137/artifacts/12618099658). Duhet krahasim vizual manual me screenshot-et e Instagramit/ILLYRIAN; ende **JO** pixel-diff i certifikuar.
- **M01/M02/M04/M16/M17:** në Android Chrome/iPhone Safari fizik verifiko renditjen Stories → Shop → Feed, unazat/etiketat, 5 tabs pa tekst të dukshëm por me emra te TalkBack/VoiceOver, 44+ px touch, header, portrait/landscape, 200% OS text; dallo homebar/statusbar e kodit (hidden) nga navigation bar-i real i sistemit dhe nga Vercel Preview wrapper. Shëno zonën e bardhë poshtë, model/OS/browser, screenshot-e pa të dhëna personale dhe hapat e riprodhimit. **Të gjitha rastet fizike mbeten NOT TESTED.**

### Kandidati historik — Connections feedback (para UI precision, JO QA fizike)
- Source/test `7418636ee271f305c4438600b03a8a63209914fd`; [CI](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438045): **263/263 Chromium + 16/16 Linux WebKit PASS**; [siguria](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438043) PASS.
- Preview immutable https://illyrian-demo-7n59yu29j-un24.vercel.app/ · `dpl_4SV68fRckbeJkPbmNdG7zBmWskfL`, READY/target null, projekt `illyrian-demo`, team `un24`, SHA e njëjtë. Root HTTP200/source-prefix +163 dhe Connections JS HTTP200/identik; 16 asete të tjera të pandryshuara nga prova e mëparshme.
- Për M16: te Connections/Hera e parë, testo njoftimin e ruajtjes/heqjes/gabimit me TalkBack/VoiceOver, fokusin dhe riprovimin. Provat browser nuk vërtetojnë njoftimin real të screenreader-it. M01–M18 mbeten NOT TESTED. Përdor këtë URL/deployment/SHA bashkë; referencat më poshtë janë histori. [Detajet](PHASE3_INTEGRATION_QA.md#follow-up-first-attendee-feedback).

### M16 historik — gjendja e regjistruar atëherë (2026-10-25)
- **HEAD i kodit:** `ec70a92c56b207a4bd5ccaa79f01d73f38bd36ac` ([PR Actions #40204447922](https://github.com/titanfit102-bit/Illyrian/actions/runs/40204447922)). **Chromium 227/227 PASS**; **WebKit IN PROGRESS**, kërko verifikim final të të dy job-eve përpara sesionit fizik.
- **Immutable Preview i po këtij SHA:** https://illyrian-demo-oezeqy5pq-un24.vercel.app/ · `dpl_3T57pMTAdvcCQs1cJRFyWP8poxVn` READY / Preview target null. Authenticated GET `/` HTTP 200 me HTML identik prefiks (+163 karaktere Vercel), Shop Plus JS HTTP 200 përputhje e saktë me GitHub.
- **M16 vetëm automatik:** u testua lidhja e gabimit të fushës me `aria-invalid`/`aria-describedby`, sq/en/it; **asnjë test TalkBack/VoiceOver në telefon real nuk është bërë**. Shëno të 18 rastet M01–M18 si NOT TESTED derisa të ketë rezultate reale.
- Nëse WebKit nuk përfundon PASS, ky version **nuk** është kandidat i miratuar sipas portës automatike. Mos e ngatërroni 227/227 browser PASS me QA fizike.

### Kandidati i mëparshëm i verifikuar automatikisht — 2026-10-25 (JO QA fizike)
- **Exact tested QA HEAD:** `54ae36cedbfdd894927ec18df96b2284eed3f518`, [PR Actions #40199056375](https://github.com/titanfit102-bit/Illyrian/actions/runs/40199056375): **224/224 Chromium + 16/16 Linux WebKit PASS**, job logs verified. The final commit changes **QA only**; last changed Shop Plus runtime was `898cb6c7deb928f8aaee97129e1418de9597b77a`.
- **Immutable same-SHA Vercel Preview:** https://illyrian-demo-jnumthype-un24.vercel.app/ · `dpl_3tnpupHeNS1fTSThTJ5KAt6Fi1CR` · `READY`, `target:null`, source SHA exactly `54ae36cedbfdd894927ec18df96b2284eed3f518`. Authenticated protected GET `/` HTTP 200: full committed DEMO HTML prefix +163-character Vercel feedback append. Shop Plus JavaScript GET 200 exact GitHub source match.
- **Not physical certification:** Android Chrome, iPhone Safari, TalkBack, VoiceOver and all M01–M18 remain `NOT TESTED`. A protected Preview can require authorized Vercel login; never disable SSO or disclose bypass credentials. Record device, software, language, orientation and failures using the blank session form below. Re-check current branch HEAD/CI/Preview if another commit is pushed.

### Kandidati historik i verifikuar automatikisht — 2026-10-25 (JO kandidati aktual)
- **Source/QA SHA:** `11bdf46b7e9736475a1081444b1a7bcaccad8aac`, [GitHub Actions #40188067150](https://github.com/titanfit102-bit/Illyrian/actions/runs/40188067150): **221/221 Chromium + 16/16 WebKit PASS**.
- **Immutable Preview:** https://illyrian-demo-hhqz5t4tp-un24.vercel.app/ · deployment `dpl_HAHRA1wQgwH7wjWDmiFyXdoTvGaD`, `READY`, target Preview, same code SHA. Authorized GET `/` HTTP 200 with source prefix + feedback script; Plans JS and `sq/en/it` locale assets exact source match.
- **Ky kandidat është referencë testimi vetëm nëse mbetet HEAD i fundit i testuar në fillim të sesionit.** Nëse dega avancon, verifiko dhe regjistro kandidatin e ri. Android Chrome/iPhone Safari/TalkBack/VoiceOver **NOT TESTED**. Protected/SSO preview mund të kërkojë identifikim; mos ul sigurinë.

**Shembull historik i Preview-it të kontrolluar më 2026-10-24 (JO domosdoshmërisht kandidati aktual):** https://illyrian-demo-2wmtumank-un24.vercel.app/

**Për çdo sesion të ri fizik:** verifiko HEAD-in LIVE të `feat/i18n-shop-feedback-20261022`, commit-in e fundit të kodit me **Chromium + WebKit PASS**, deployment-in **Preview READY** të atij commit-i dhe përputhjen e përmbajtjes së shërbyer me GitHub. Regjistro URL-në e pandryshueshme, `dpl_...` dhe SHA-në e **atij kandidati** në formularin e sesionit. Mos i përdor identifikuesit historikë më poshtë për të certifikuar një kandidat më të ri.

- Preview deployment `dpl_E85yYPXWuvWZ8t35WMTHLLGNJVKi`, HEAD i dokumentacionit `2b9c226bbd05b2ca7e9fcfced7aed2fd5d64b636`, kod/QA i fundit i verifikuar `b36708848d0b869ffa71238d81b0a35c007e82c6`. Në GitHub [Actions #40105377537](https://github.com/titanfit102-bit/Illyrian/actions/runs/40105377537), PR-triggered CI për docs HEAD është **success**; [Actions #40104667894](https://github.com/titanfit102-bit/Illyrian/actions/runs/40104667894) mbi SHA-në e kodit: **190/190 Chromium + 16/16 emulated WebKit PASS**.
- Vercel API e shënoi Preview `READY`, dhe leximi i autorizuar i rrugës `/` ktheu **HTTP 200** me HTML-në identike si prefiks i skedarit në GitHub (plus skriptin e feedback-ut të Vercel). Kjo nuk garanton hyrje anonime nga telefoni.
- Hape në **Android Chrome fizik**, pastaj në **iPhone Safari fizik** nëse është i disponueshëm. Nëse kërkohet identifikim Vercel, përdor llogarinë me leje; **mos** çaktivizo SSO/protection dhe mos shpërnda bypass token.
- Mos përdor Production ose URL të një deploy-i tjetër si provë. Nëse nuk hapet, shëno **BLOCKED — Vercel access**, me status dhe screenshot pa kredenciale.

## 2. Formulari i një sesioni

Plotëso një kopje të këtij blloku për çdo kombinim pajisjeje/shfletuesi. **Mos regjistro numra telefoni, adresa, fjalëkalime, identitete apo të dhëna personale.**

```text
Kodi i sesionit: MOBILE-________
Data/ora lokale: ____________
Pajisja/modeli: ____________
Sistemi/Versioni: ____________
Browser/Versioni: ____________
Orientimi: Portrait / Landscape
Gjuha e DEMO-s: sq / en / it
Preview deployment (kandidati LIVE): dpl_________________
Preview URL e pandryshueshme: https://________________
Test code SHA (exact-SHA CI PASS): ________________________________
Chromium + WebKit run ID: __________________
QA operator: ____________ (mund të përdoret pseudonim)
Rezultati total: PASS / FAIL / BLOCKED / NOT TESTED
Problemet e gjetura / screenshot-et: ____________
```

## 3. Rruga prioritare (rreth 10–15 minuta për sesion, pa garantuar kohë)

- [ ] **P01 / M01–M02 — Hapja dhe orientimi:** hyr si vizitor, kalo turin, vizito tab-et Home/Explore/Events/Profile; ktheje telefonin landscape dhe portrait. Pa ekrane bosh, scroll horizontal të dokumentit apo butona të paarritshëm.
- [ ] **P02 / M04 — Stories/Reels:** hap Story dhe Reel nga Home; kalo te Story/Reel tjetër, mbylli me **X**. Për Reel, testo edhe kalimin në profil/bisedë dhe **Kthehu te Reel**. Fokusi i tastierës verifikohet vetëm nëse pajisja ka tastierë të lidhur; prekja nuk e certifikon fokusin.
- [ ] **P03 / M10–M12 — Shop + Shop Plus:** hap Shop → Shop Plus → Kërkoj… → Katalog → Krijo. Ndrysho kategorinë Produkte/Makina/Banesa me qira/Shërbime; shiko që fushat e papërshtatshme zhduken dhe butoni mbyll dialogun. Mos e publiko listimin.
- [ ] **P04 / M06–M09 — Plans/Connections/Privacy/Governance:** hap dhe mbyll panelet, testo kthimin te tab-i i mëparshëm, ruajtjen e tekstit të draftit dhe gjuhën sq/en/it pa ndryshuar vlerat e futura. Mos dërgo raportime reale.
- [ ] **P05 / M16–M17 — Aksesueshmëria:** aktivizo TalkBack në Android ose VoiceOver në iOS dhe lëviz në butonat e modalit. A lexohen emrat, etiketat, gabimet? A mund të dalësh nga modali? Provo madhësinë e tekstit të rritur. Nëse nuk mund të realizohet, shëno **NOT TESTED**, jo PASS.
- [ ] **P06 / M15/M18 — Rreziku i ruajtjes:** kryeje vetëm në një sesion prove me të dhëna fiktive, duke ndjekur checklist-in e plotë për ruajtjen e dështuar dhe tab-et konkurrente. Mos e simulo fshirjen e të dhënave reale.

**Ky është kontrolli fillestar; M01–M18 në [checklist-in e plotë](DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md) mbeten kriteret detyruese para sign-off.** Nuk mjaftojnë vetëm P01–P06 për release.

## 4. Regjistrimi i rezultateve për çdo rast

Kopjo rreshtin dhe plotëso për çdo test. Statuset e lejuara: `PASS`, `FAIL`, `BLOCKED`, `NOT TESTED`.

| Case | Device/session | Locale | Orientation | Status | Sjellja reale / problemi | Evidenca |
| --- | --- | --- | --- | --- | --- | --- |
| P01 | — | — | — | NOT TESTED | — | — |
| P02 | — | — | — | NOT TESTED | — | — |
| P03 | — | — | — | NOT TESTED | — | — |
| P04 | — | — | — | NOT TESTED | — | — |
| P05 | — | — | — | NOT TESTED | — | — |
| P06 | — | — | — | NOT TESTED | — | — |

Foto/video të problemit: emri `MOBILE-<session>-<case>-<portrait-or-landscape>-<01>.png`. Shëno hapat që e riprodhojnë. Për P0/P1 (të dhëna të humbura, veprim i bllokuar, sukses i rremë, gabim serioz privatësie), mos vazhdo me miratimin; regjistro issue në degën e autorizuar. Mos dërgo screenshot-e me të dhëna personale apo token-e Vercel.

## 5. Kur konsiderohet plotësuar

- Android Chrome fizik: **NOT TESTED** derisa të dorëzohet sesioni dhe provat.
- iPhone Safari fizik: **NOT TESTED** derisa të dorëzohet sesioni dhe provat.
- TalkBack / VoiceOver: **NOT TESTED** derisa të provohen praktikisht.
- F05: kontrollet e rrugës HTTP dhe integritetit të Preview janë të verifikuara; **jo** funksionaliteti fizik ose akses anonim universal.
- F06: `browser-smoke-pull_request` dhe `webkit-smoke-pull_request` janë checks të suksesshme, por dega integruese mbetet e pambrojtur. Shiko [propozimin F06](F06_REQUIRED_CHECKS_DECISION.md); zbatimi kërkon miratim të qartë.
- **Release HOLD**: asnjë merge, Production, APK ose deklarim "gati" pa rezultatin manual M01–M18, zgjidhjen e defekteve reale, vendimin F06 dhe sign-off e pronarit.

## Phase 1 supplement — 2026-10-25 (NOT TESTED physically)
Historical Phase 1 report: [PHASE1_QA_HANDOFF.md](PHASE1_QA_HANDOFF.md); latest integration/candidate: [PHASE3_INTEGRATION_QA.md](PHASE3_INTEGRATION_QA.md) and the final candidate section below. Baseline Preview `dpl_4Fr38nkGv4YE7Yw12hFN8g5o259c` / `183a802…` has protected HTTP root and 16/16 asset parity evidence. It predates Governance fix `00fdf019…`; **do not mark it as the final candidate**. Replace session URL/deployment/source together after the free Preview limit allows a verified new candidate.

Additional observations to record with M04/M15/M16/M18: type a Story reply and wait beyond 8 seconds; confirm draft/focus and explicit resume, storage failure/retry/reload without duplicates; compare two-tab Messages/Plans/Shop Plus behavior, copying drafts before a required reload. Check the light-mode Home Reels button contrast finding from the report. For performance, record device/build, cold/warm entry, keyboard/scroll response and interruptions using repeatable fictional content; numeric budgets are unapproved until baselines are selected. These instructions do not record a test result.

### Historical initial Phase 3 device candidate (superseded by the candidate above)
Use https://illyrian-demo-hwa3rchfw-un24.vercel.app/ ; deployment `dpl_12TbBhUTKxeWYY6EWUKNPb3R2fM1`, source/test SHA `a9a380cfa570a2a07c3c7b0ae814817e630e8e99`, [CI 40234873355](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234873355): **257/257 Chromium + 16/16 Linux WebKit PASS**. READY/Preview; protected root HTTP200 and exact source prefix; 3 updated locale catalogs were fetched HTTP200/exact parity; the other 14 referenced assets are unchanged from the verified 17/17 HTTP200/parity at initial Phase 3 source `27da842`. Replace the session deployment/URL/source fields together before testing. The prior `a789357` candidate remains historical evidence in [Phase 1 report](PHASE1_QA_HANDOFF.md); it lacks Phase 3 integration. All physical PASS/FAIL rows remain NOT TESTED; never record temporary authentication tokens.

Add Phase 3 scenarios from [integration QA](PHASE3_INTEGRATION_QA.md): School & University community → discussion → comment → Feed/Profile/report; quota rollback/Retry and single activity log; manual city with location denied/revoked; city-time/DST boundaries, expired interests and repeat-as-draft. Browser results do not fill these physical rows.
