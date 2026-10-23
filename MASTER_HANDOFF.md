# ILLYRIAN — MASTER HANDOFF
## CONTINUITY PROTOCOL — ACTIVE SNAPSHOT (2026-10-23)

**Ky seksion është përmbledhja autoritative aktuale për rikuperim.** Për statusin e shpejtë lexo së pari [CURRENT_STATE.md](CURRENT_STATE.md). Seksionet pas ndarësit “HISTORICAL RECORD” janë ruajtur **pa humbje** nga dokumenti i mëparshëm dhe përmbajnë checkpoint-e kronologjike, përfshirë konstatime të vjetruara. Në konflikt, verifiko GitHub LIVE. Këto dokumente **nuk** dëshmojnë se janë lexuar të gjitha bisedat historike; bazohen te historia e disponueshme, dokumentet e repository-t dhe evidenca GitHub.

### A. Identiteti, vizioni dhe kufijtë [VENDIM / FAKT]
- Projekti: [`titanfit102-bit/Illyrian`](https://github.com/titanfit102-bit/Illyrian) — **PUBLIC i verifikuar**, jo private siç thuhej në hyrjen e vjetër. Projekti është i ndarë nga PRESSA SMART, Builder System, Protesto, ShqipShop dhe çdo repository tjetër; mos huazo kode/kredenciale pa leje.
- Vizioni: ILLYRIAN si një ekosistem i vetëm komunitar/social për përdoruesit shqiptarë dhe diasporën: profile, postime, Stories/Reels, komunitete, plane/aktivitete dhe komunikim; brenda platformës **IllyrianShop** për produkte, dyqane, makina, banesa, qira dhe shërbime. Vlera duhet të provohet nga përdorimi real, jo numri i funksioneve.
- Fillimi i orientuar drejt tregut shqiptar, me arkitekturë për treg ndërkombëtar; **tregu i parë dhe vendi i pilotimit real nuk janë firmosur përfundimisht**. i18n sq/en/it tani, 100+ gjuhë si aftësi e arkitekturës, jo si rezultat i përfunduar.
- Shop nuk është Play Store/APK store. Produktet fizike, klasifikimet (makina/prona) dhe shërbime/qira kanë rrjedha të ndryshme; marketplace real duhet të përdorë katalog dhe identitet kanonik, jo dy inventare të pavarura.
- Norma **5%** është vetëm shembull në DEMO; pagesat, komisionet, faturimi, refunderat, verifikimi i shitësve dhe compliance nuk janë miratuar ose implementuar.
- DEMO = provë browser me përdorues e listime sintetike/localStorage. Nuk ka garanci server-side privatësie, kontroll rolesh, moderimi, pagesash, backend, DB apo aplikacion native të certifikuar.

### B. Preferencat, rregullat e pronarit [VENDIM]
- Vepro si arkitekt kritik dhe bazohu në kod/PR/teste reale; **mos hamendëso çfarë është implementuar**. Ruaj funksionet ekzistuese; punë inkrementale, testim në commit-in e saktë dhe raporte me kufijtë e mbulimit.
- Përdor degë të izoluar dhe Draft PR; **asnjë merge** në `demo/v1.7-illyrian-shop` apo `main`, asnjë ndryshim Vercel Production, deploy, licencë/pagesë, infrastrukturë apo veprim destruktiv pa autorizim të veçantë. Mos prek projektet e tjera.
- Pronari e teston **DEMO-n e plotë në telefon pas stabilizimit** dhe dërgon screenshot-e; ky është gate i domosdoshëm para miratimit final.
- **Autorizim i vazhdueshëm i dokumentacionit (2026-10-23):** krijo/përditëso vetëm `CURRENT_STATE.md` dhe `MASTER_HANDOFF.md` në degën `feat/i18n-shop-feedback-20261022` pas çdo ndryshimi domethënës të verifikuar, pa kërkuar përsëri leje. Nuk shtrihet te kodi, skedarë të tjerë, merge, deployments, shpenzime, sekrete ose ndryshim dege. Me humbjen e aksesit/ndryshimin e degës, ndalo dhe shpjego.
- Dokumentet janë memoria e qëndrueshme; pas një ndërprerjeje përdorimi i tyre kërkon **ri-verifikim të gjendjes live**, jo besim mekanik te një SHA i shkruar më parë. Përditësime bëhen në sesione aktive; nuk ka proces në sfond.

### C. Teknologjia dhe arkitektura [FAKT / DREJTIM I MIRATUAR]
- DEMO aktuale: `demo/ILLYRIAN_DEMO_v1.7.html`, HTML statik, vanilla JS/CSS, module Shop, Shop Plus, Plans, Connections, Privacy/Map, Governance, social UI bazë; ruajtja e shumë gjendjeve në `localStorage`. Testet `qa/*.spec.cjs` në Chromium/Playwright, [GitHub Actions workflow](.github/workflows/illyrian-v17-browser-qa.yml).
- i18next **v25.7.0**, vendor lokal, locale `sq/en/it`, fallback `en`, preferenca e ruajtur në pajisje para zbulimit të gjuhës, formatim numër/EUR/date. Katalogët root/demo të pasqyruar: **499 keys/locale, 15 namespace**, `shopPlus` 115; verifikuar si çelësa identikë midis gjuhëve dhe pasqyrave.
- Kërko **`t('namespace:key')` / semantic binding**; përdor `data-i18n-direct` për elemente të përkthyera drejtpërdrejt, `data-user-content` për tekste të shkruara nga përdoruesi. Adapteri `MutationObserver` sipas frazave ekziston ende për UI legacy dhe nuk duhet të shkelë këta kufij.
- Ruaj `option.value`, kode statusi, city/type IDs dhe përmbajtjen e UGC të pandryshuar nga gjuha; të dhënat lokale të ruajtura nuk përkthehen. Përdor rollback të gjendjes pas refuzimit të ruajtjes në modulet e testuara.
- Produkti **real**: drejtimi i miratuar në [Blueprint §10](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md): identitet i përbashkët dhe autorizim në server, privatësi, social/community/plans/messaging/Shop, modele domain të përbashkëta, event taxonomy/analytics, role dashboards vetëm kur mbështeten nga funksionet, moderim/reportim, media, notifications, deep links, lifecycle, observability dhe siguri. Fillim me module të qarta, **jo microservices premature**.
- **Ende të hapura (JO vendime të miratuara):** React Native/Expo vs Web/PWA, Postgres/Supabase/hosted backend, tregu i parë real, auth, PSP, monetizimi, kushtet ligjore, prioriteti exact i Shop në MVP, videot/messaging/dashboards në shkallë. Nuk krijohen shërbime në bazë të këtij handoff-i.

### D. Çfarë është implementuar dhe çfarë është verifikuar [FAKT]
- DEMO ka module funksionale UI të social/Shop/Plans/Connections/Privacy/Governance; funksionet e simuluara janë dokumentuar në roadmap, pa pretendim për funksione reale multi-user.
- Deri te SHA i testuar `5fe384f89c5ad958825b52c81c6599dd055e1ad2`: i18n sq/en/it dhe përmirësime të formave, mesazheve dinamike, ruajtjes/failure-retry, katalogut të Shop Plus, dyqaneve dhe porosive simuluese.
- Shop Plus: UI direkt me çelësa semantikë për formularët, filtrat, kategoritë, stoku, etiketat sponsored, krahasimet, katalogët e shitësve dhe komisionin ilustrues. Shfaqje e lokalizuar e statuseve të njohura të porosive **pa ndryshim të kodeve të ruajtura**; kodet e panjohura shfaqen siç janë.
- Plans/Privacy: etiketa dhe feedback shumëgjuhësh, ruajtja e inputit/fokusit në ndërrim gjuhe në rrugët e trajtuara; dështimet localStorage nuk duhet të pretendohen sukses në testet e mbuluara. Connections/Governance kanë status/mesazhe dhe mbrojtje UGC në rrugët e trajtuara.
- **CI i fundit i verifikuar:** [Actions #39968158271](https://github.com/titanfit102-bit/Illyrian/actions/runs/39968158271), `5fe384f89c5ad958825b52c81c6599dd055e1ad2`, **131/131 Chromium Playwright PASS (3.3m)**; logu u rilexua. Testet historike (53/53, 57/57, 65/65, 71/71, 80/80, 89/89, 95/95, 101/101, 110/110, 115/115, 123/123, 130/130) janë kronologji, jo statusi final. Kjo nuk është QA mobile, a11y totale, audit sigurie apo certifikim publikimi.
- HEAD live para checkpoint-it: `534098b6b5194175e78193614debe1bb0ea773cb`, një commit **vetëm dokumentacioni** mbi SHA-në e testuar (diff e verifikuar: `MASTER_HANDOFF.md`, `architecture/ILLYRIAN_I18N.md`, `demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md`). HEAD ndryshon pas këtij commit-i dokumentacioni, prandaj bisedat e reja duhet ta lexojnë LIVE.
- Branch `feat/i18n-shop-feedback-20261022` → Draft PR [#1](https://github.com/titanfit102-bit/Illyrian/pull/1), target `demo/v1.7-illyrian-shop` `015ce439e7c6d736149c6c300391586517664f62`; `main` `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge sipas statusit të verifikuar.
- Vercel `illyrian-demo`: ekzistenca e projektit u gjet; statusi aktual Preview **NUK u lexua** (403 team scope). Preview READY i vjetër në dokumentet historike nuk provon deploy të SHA-së aktuale.

### E. Problemet, rreziqet, pasiguritë [OPEN / E PAVERIFIKUAR]
1. i18n e plotë në Shop Plus detail / buyer requests & replies / moderation dhe rental, plus tekste statike të mbetura të Plans/Privacy/Settings, dhe inventar për të gjitha module/ekrane/empty-error states.
2. Audit global i UGC në DOM, escape/HTML injection, bllokimi nga adapteri legacy, formatet locale/currency, tekstet e gjata, live-switch pa humbje të formave.
3. A11y e plotë me tastierë, screenreader, ARIA, navigim fokus, pamje responsive portrait/landscape dhe verifikim vizual/performance në pajisje reale.
4. Vercel Preview i SHA-së aktuale i paverifikuar për mungesë autorizimi; mos bëj deploy/upgrade pa leje.
5. Repository PUBLIC: ekspozimi/licencimi përpara prurjes së secrets dhe backend-it; nuk është kryer audit publik i sekretit apo review ligjor gjithëpërfshirës.
6. Arkitektura reale, drejtimi platformë, backend, tregu, shpenzimet dhe lejet ligjore nuk janë firmosur; Shop bazë dhe Shop Plus kanë modele demo të ndara deri te unifikimi real.
7. Disa vendime nga biseda të mëparshme dhe dokumentet origjinale Work mund të mos jenë të ripërsëritshme nga kjo përmbledhje: [Blueprint §10](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md) regjistron parimet e miratuara; burimet origjinale të propozimeve/Work nuk u rihapën në këtë sesion. Mos shpik përmbajtje të tyre.

### F. Roadmap i konsoliduar [PLAN, JO PUNË E KRYER]
- **P0-D / Faza 7:** mbaj suite Chromium jeshile mbi SHA e saktë; zgjidh regression reale; ruaj domain codes dhe UGC; asgjë në main/Production.
- **P1-D / Faza 7:** lokalizimi direkt dhe inventari i mbetur; testet e të gjitha modalëve/formave/statusit; QA e fokusit, aksesueshmërisë, visuals dhe renditjes; verifiko versionin Vercel; **phone QA nga pronari me screenshot-e**; miratimi i veçantë i DEMO.
- **P0-R/M0–M1 / Faza 8:** validim i nevojës/tregut, PRD/threat-model, vendim platformë/backend, identity/auth/privacy/role access të garantuara në server; proof që një përdorues nuk lexon/shkruan privatësinë e një tjetri.
- **P1-R/M2–M3:** community/plan/capacity, messaging sipas scope të aprovuar, media/notifications dhe discovery/inquiry Shop me seller ownership dhe moderim real; prova të rrjedhave vertikale e metrika për përdoruesit.
- **P2/M4:** vetëm pas pilotit dhe kontrollit ligjor/e ekonomik, shqyrto pagesat, KYC/KYB, komisionin, rimbursimet dhe liability; asnjë vendim implicit 5%.
- **P3/M5:** security/a11y/device testing, ops/observability/backup-restore, staged release dhe sign-off; zgjerim gjeografik/gjuhësor vetëm mbi metrika.

### G. Pika e saktë e rifillimit dhe kriteret [PLAN]
**Pika e fundit e verifikuar:** `5fe384...`, 131/131 Chromium PASS; dokumentacioni i mëpasshëm HEAD `534098b6b5194175e78193614debe1bb0ea773cb` vetëm tekst, PR #1 i pambashkuar.

**Detyra e ardhshme e zhvillimit:** lexo Shop Plus current-source, inventarizo item-detail, request/reply, report/moderation, rental/time labels; zgjidh 1 grup të vogël të verifikueshëm, lidh me semantic i18n, mos ndrysho `option.value` ose UGC, shto teste, merr CI PASS me SHA të saktë; pastaj përditëso `CURRENT_STATE.md` dhe këtë snapshot pa fshirë seksionet historike. Mos e nis zhvillimin në këtë task të protokollit, i cili është dokumentacion-only.

**Definition of Done për çdo etapë:** kod/kontrata sipas autorizimit, teste të reja dhe të vjetra PASS mbi SHA ekzakte, kontroll i diff-it dhe depencave, pa merge të paautorizuar, dokumentim i problemit/ndryshimit/provës/OPEN, rilexim GitHub i dy dokumenteve. Mos deklaro 100% me numër çelësash ose vetëm browser tests.

### G.1 — Audit i kodit Shop Plus pas checkpoint-it (23 October 2026) [FAKT / PLAN]
- U verifikua live HEAD `2c9cff9fd2cdad64e9813c80f47f2d2b38ec8dc5`, PR #1 draft/open/unmerged, target `demo/v1.7-illyrian-shop` (SHA `015ce439...`), `main` `9f91b5c...`, repository PUBLIC. Krahasimi me source/test SHA `5fe384f...`: vetëm dy commits dokumentacioni në katër skedarë; run #39968158271 = 131/131 Chromium PASS mbi **SHA e kodit**, jo QA e veçantë për HEAD dokumentues.
- Inventari në `demo/ILLYRIAN_SHOP_PLUS_v1.7.js` zbuloi direct-i18n të papërfunduar: `itemView()` (detaj, makinë, qira, stok, butona, paralajmërime), `period()/card()` (shfaqja e `muaj/javë` sipas locale), `board()` (tituj/lista/afate/empty/replies), `respond()` (formulari/placeholder), `moderation()` (etiketa/status/arsye); `render()` ka `aria-label` dhe close hardcoded, `inject()` ka etiketë hyrjeje hardcoded. Mundësia e përkthimit nga adapteri legacy nuk përbën provë për direct semantic bindings.
- Suite `qa/illyrian-v17-i18n.spec.cjs` mbulon pjesë të katalogut, seller directory, forms, UGC, saved enum/order, por jo assertions e plotë të prezantimit të rrugëve më sipër. `qa/illyrian-v17-i18n-inventory.spec.cjs` kap Shop Plus vetëm në tab-in inicial; gjendjet conditionale nuk janë inventarizuar.
- **Next isolated coding slice (not executed, code authorization required):** item detail + rental/period labels -> buyer request board/respond -> moderation/report status -> modal a11y. Use sq/en/it direct semantic keys, unchanged `option.value`/stored reason and order codes, UGC exclusion, mirrored locale catalogs, targeted en/it regression; require exact-SHA CI before docs checkpoint. No merge, deployment, or external services.

### Shop Plus Phase 7 incremental slice — verified 134/134 (23 October 2026)
- `40396a7342221a244391d5416a7df1b11a8e5835` lokalizoi `itemView()` me direct semantic keys për produkt/makinë/qira dhe 22 keys/locale sq/en/it; `period()/card()` përkthejnë etiketat mujore/javore pa ndryshuar kodet e ruajtura ose UGC. Mirror `i18n/locales` dhe `demo/i18n/locales` të njëjta. +3 raste Playwright.
- CI [#39981149744](https://github.com/titanfit102-bit/Illyrian/actions/runs/39981149744) = **134/134 PASS (3.3m)** në SHA e saktë, i kontrolluar edhe nga logu. Nuk provon a11y të plotë, telefona apo Vercel preview.
- Next: i18n e `board()/respond()/moderation()`, dialog dhe entry labels, me regressive tests, pastaj visual/UGC/a11y audit. Pa merge/deploy/Production.

### H. MASTER CONTINUITY PROTOCOL — mënyra e punës [VENDIM]
- `CURRENT_STATE.md` = gjendja e fundit e shkurtër / indeksi i rifillimit.
- `MASTER_HANDOFF.md` = vizioni, vendimet, arkitektura, evidenca dhe kufijtë; seksioni ACTIVE SNAPSHOT përditësohet inkrementalisht; **HISTORICAL RECORD poshtë ruhet pa fshirë ose falsifikuar eventet**.
- Vendimet e arkitekturës të detajuara jetojnë te [Blueprint §10](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md), implementimi i i18n te [ADR](architecture/ILLYRIAN_I18N.md), kronologjia e DEMO-s te [roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md).
- Pronari autorizoi që pas çdo ndryshimi material të verifikuar të përditësohen **automatikisht gjatë punës aktive** vetëm këta dy dokumente, vetëm në `feat/i18n-shop-feedback-20261022`, pa pyetje të përsëritura. **Jo** punë në sfond, **jo** kod/PR merge/deploy/main/Production, **jo** sekrete. Për një detyrë të re të kodit duhen autorizime sipas rregullave përkatëse.
- Commit-et e dokumentimit nuk janë ekuivalente me CI jeshil mbi HEAD nëse workflow nuk teston `*.md`; linko SHA-në më të fundit të **kodit/testeve** me logun CI. Nëse shkruan dokumente pas atij SHA, shëno `docs-only`.
- Pas ndërprerjes: lexo CURRENT_STATE → ACTIVE SNAPSHOT → Blueprint/ADR/Roadmap, kontrollo GitHub HEAD/PR/CI dhe Vercel (nëse ke akses); krahaso live me checkpoint-in dhe bëj veprimin e parë të pambyllur. Raporto shkurt `u bë / mbetet / vijon / handoff ruajtur?`.

---

## HISTORICAL RECORD — dokumenti i mëparshëm, i ruajtur plotësisht

> **KUJDES:** pjesa poshtë ruhet historikisht **verbatim**. Data, numra dhe formulime në krye (p.sh. “repository private” ose “290 çelësa”) kanë qenë të sakta vetëm sipas checkpoint-eve të tyre ose janë korrigjuar më vonë. Mos i përdor për statusin aktual pa kontrolluar ACTIVE SNAPSHOT dhe GitHub.

# ILLYRIAN — MASTER HANDOFF (Status i18n, 22 tetor 2026)

## Për të vazhduar në një bisedë tjetër

**Repository:** `titanfit102-bit/Illyrian` (private) · **Dega aktive:** `demo/v1.7-illyrian-shop` · **Mbrojtja:** mos ndrysho `main` ose Vercel Production pa miratimin e pronarit. Mos përziej projektet e tjera.

**Qëllimi i produktit:** komunitet/rrjet social shqiptar global + aktivitete dhe njohje + marketplace `ILLYRIAN Shop` (produkte, dyqane, makina, banesa me qira, shërbime). Kërkimi, shporta dhe komisioni ilustrues 5% janë **DEMO lokale**, jo pagesa/inventar/përdorues realë.

**Kodi:** HTML + vanilla JS (demo/ILLYRIAN_DEMO_v1.7.html) dhe module Shop, Shop Plus, Plans, Connections, Privacy/Map, Governance. Teknologjia e re i18n: i18next 25.7.0 me katalogë en/sq/it dhe fallback en. Lexo `architecture/ILLYRIAN_I18N.md` për API, vendim teknik, dublimin e katalogëve te demo/, testet dhe kufijtë. Lexo `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` për produktin real të Fazës 8 dhe `demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md` për historikun e plotë.

**Evidencë historike:** GitHub Actions run #39839958152: 32/32 Playwright PASS në Chromium dhe 273/273 kontrolle të brendshme QA Lab (126 bazë + 147 advanced), para shtimit të i18n. U krijuan 42 screenshots të QA për 7 përmasa × 6 ekrane, jo certifikim vizual.

**i18n:** Katalogët kanë 290 çelësa/15 namespace për secilën gjuhë. Anglishtja është baza teknike. Locale e ruajtur prevalon mbi gjuhën e telefonit; UI përzgjedh gjuhën në Profile → Settings → Gjuha. Nuk preket llogaria e përdoruesit, postimet, komentet apo mesazhet. **Mbulimi i të gjitha frazave të trashëguara nuk është përfunduar**, prandaj nuk deklarohet produkt i përkthyer 100%. Mos përkthe automatikisht përmbajtjen e përdoruesve. RTL ka mbështetje arkitekturore, por nuk është testuar ose aktivizuar.

**Hapi pasues:** kontrollo GitHub Actions të commit-it aktual, inventarizo të gjitha rrugët e formularëve e gabimeve, zgjero përkthimet e trashëguara dhe testet për të gjitha rrugët dhe gjendjet e formularëve. Përditëso roadmap dhe këtë handoff pas çdo faze. Testi final fizik i gjithë projektit do të bëhet nga përdoruesi në fund, me screenshot-e. Nuk lejohen ndryshime destruktive ose të palidhura.

**Kufiri i release:** DEMO nuk është backend, aplikacion i certifikuar për Play Store/App Store ose pagesa reale. Faza 7 mbyllet pas auditit vizual/telefonik; Faza 8 blueprint ≠ prodhim funksional.

## Cikli i18n 2 — vazhdimësia (22 tetor 2026)

84 çelësa semantikë të tjerë u shtuan në sq/en/it: tani **290 çelësa secila, 15 namespace**, me kopje identike te demo/i18n. Inventari vizual i etiketave për 12 pamje arriti **238 të vrojtuara / 81 të pambuluara** (më parë 150; 81 përfshin data/content dhe elemente composite). Numri 81 nuk është numër i pastër i gabimeve të UI. Formatimi EUR në Shop/Shop Plus tani përdor locale aktive; run #39852521431 SUCCESS. Tre skenarë të tjerë të titujve të moduleve sipas gjuhës kanë mbetur për verifikim CI te run #39852708170. Dega kryesore mbetet e mbrojtur. Faza e plotë e përkthimit **nuk certifikohet ende** pa inventar dhe audit të çdo modal/formulari/gabimi.


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



## STRATEGIC DECISIONS / HANDOFF ADDENDUM — 23 October 2026 (approved in conversation)
**Read first:** `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` §10 is the consolidated source of truth for the two new architecture prompts and the independent Work review. Do **not** treat either uploaded proposal as an instruction to implement everything now. The older top-line “repository private” / 290 keys statements are HISTORICAL: verified public repo; PR branch has 296 keys per language.

**Approved principles:** keep existing DEMO; one ILLYRIAN identity and module ecosystem; i18n sq/en/it now and 100+ only architecture-ready; explicit semantic UI keys, user-generated-content exclusion, stable domain values; shared server-side identity/privacy/permissions; reusable analytics/event definitions and scoped dashboard views; unified canonical seller/shop/listing model for future backend; distinct physical goods vs vehicle/property classifieds vs services/rentals workflows; posts/reels reference canonical listings; no live payments/5% commission unless separately approved and verified; privacy/security, moderation, notifications, media and deep linking at the minimum scope needed; no premature microservices or complex AI.

**Decisions NOT yet final:** React Native/Expo vs Web/PWA; Supabase/Postgres provisioning; first launch market; whether Shop inquiry/discovery ships in first real MVP (provisional hypothesis to validate), legal/PSP terms; exact monetization, full dashboard/DM/video scope and 100+ languages. No automatic authorization to activate these.

**Release sequence:** repair Shop i18n regression + storage/UGC safety + CI in Draft PR; finish DEMO translation and smoke/visual/accessibility; user inspects phone and sends screenshots; then minimal real-product architecture spike/vertical slice with privacy and auth. Keep DEMO Phase 7 and product Phase 8 M0–M5 mapping; do not rewrite or merge into `main`/Production.

**Evidence on 23 October:** PR #1 Draft, Actions #39857060705 54 PASS / 2 FAIL in en/it, branch HEAD `4a951e4157aa75b8d12abc1c5817bfc3885e7055` prior to this documentation; issue: unpinned `option.value` derives translated `textContent`. Earlier 53/53 is historical. Vercel preview not current. Recheck after fixes. This section supersedes older chronological status summaries only where they conflict, without deleting their history.


### P0 Shop i18n — verifikimi i korrigjimit (23 tetor 2026)
- Korrigjimi në degën `feat/i18n-shop-feedback-20261022` u bë në `demo/ILLYRIAN_SHOP_v1.7.js`: `<option value="...">` eksplicit për kategori/qytete; vlera në `FormData` dhe localStorage nuk varen nga gjuha e shfaqur. U shënuan `data-user-content` për titullin, shitësin dhe përshkrimin e listimeve.
- Testet shtuan prova për code/value stable në sq/en/it dhe për UGC të pandryshuar në ekran pas ndryshimit të gjuhës.
- **CI E VERIFIKUAR:** [Actions #39865986736](https://github.com/titanfit102-bit/Illyrian/actions/runs/39865986736), commit kodi `db574224d4849775224fb6ee4df0247aa2f18c46`: **57/57 PASS (2.0m, Chromium)**. Dështimi i mëparshëm 54 PASS/2 FAIL është historik, jo statusi i fundit i testuar.
- PR #1 është ende DRAFT/unmerged. Kjo suite nuk certifikon 100% i18n, Vercel Preview, a11y, Android ose testin fizik të pronarit. Rruga pasuese: ruajtja e gabimeve localStorage, inventari i formave të Shop Plus/Connections/Governance, direkt keys i18n dhe QA në telefon. Nuk preket `main`/Production.



## P0-D — Shop/form i18n + storage rollback — 23 October 2026, verified follow-up
- Source: Draft PR #1, branch `feat/i18n-shop-feedback-20261022`, last code/test SHA `b0a85f1119149d092328ae912d79299a87b9862f`. This is **not merged** into `demo/v1.7-illyrian-shop`, `main` or Production.
- Shop base: all persistent modifications (create/edit/delete listing, add/remove cart, demo checkout/inquiry) now use transactional `transact(change)`; if `localStorage.setItem` fails, memory state rolls back and no success/confirmation is shown. Failed new/edit form stays on the input screen to permit retry.
- Shop Plus, Connections and Governance: retain last successfully serialized state and restore it if persistence fails; checkbox/interest messages in Connections no longer claim saved data on failure. This is DEMO storage reliability, **not** server transactionality. Shop Plus/Governance may still need improvements for preserving unsaved form input after failed writes.
- i18n: explicit stable `<option value>` on relevant Shop Plus request/report options, Connections timeslots, Governance report reasons; historical Albanian codes remain valid in stored data even when labels change language.
- **CI proof:** GitHub Actions [#39868919668](https://github.com/titanfit102-bit/Illyrian/actions/runs/39868919668) on exact code+test SHA `b0a85f1119149d092328ae912d79299a87b9862f`: **65/65 Playwright Chromium PASS (2.1m)**. Includes 8 new quota/error and multilingual form tests beyond prior 57. The earlier 60/62 failure was QA selector targeting backdrop instead of actual close button; corrected without deleting coverage. Baseline 53/53 and 57/57 are historical.
- Coverage boundary: Chromium E2E is not certification of every i18n string, localStorage edge case, mobile browser, a11y or physical phone. Remaining work: complete explicit UI translation & UGC exclusion, audit all forms/controllers beyond selected paths, fuller QA/visual/a11y, resolve Vercel preview/version route and owner phone screenshots; Shop and Shop Plus remain separate demo storage models until planned domain consolidation.
- Owner-accepted vision/architecture prompts and conditional decisions remain recorded in Product Blueprint §10; do not implement new business features automatically. Keep projects isolated and no merges/deployments to main/production without owner approval.



## Handoff — i18n Connections + Governance, 23 Oct 2026 (verified)
- Branch-only integration: `feat/i18n-shop-feedback-20261022`, Draft PR #1 to DEMO branch, `main` and Production untouched.
- Added **23 semantic i18n feedback keys** across `connections` (9) and `governance` (14) in sq/en/it. Catalog parity and exact root/demo mirrors validated; now **319 keys/locale across 15 namespaces**. Runtime messages cover storage failures, validation, success, interest/cities, private notes, reports, appeal/review and local drafts.
- Governance user-authored report titles/details, moderation notes, and local draft names/notes have explicit `data-user-content` on relevant DOM paths, preventing phrase translator from changing user text. Canonical persisted report reasons and selected city codes are NOT localized.
- Added six Chromium browser scenarios (two per locale), including report content `Mbyll` surviving locale changes; adjusted two existing storage quota tests to explicitly select sq rather than assume the browser locale. No test removed.
- **VERIFIED: Actions #39930979544**, code+tests SHA `f5478b1716289bec575dfd5e23cd4294132dfcad`, **71/71 Chromium Playwright PASS (2.1m)**. An earlier run #39930560220 had 69 pass/2 fail because historic quota assertions expected Albanian with an English browser; fixed by pinning the intended test locale.
- CI workflow `.github/workflows/illyrian-v17-browser-qa.yml` now listens to `i18n/**` root source catalog changes as well as `demo/**` and `qa/**` (new workflow commit later than tested code). Keep per-SHA CI evidence distinct.
- OPEN: Shop Plus, Plans, Privacy and remaining conditional UI strings; UGC inventory beyond patched paths; screens/a11y/phone/Preview verification, required PR checks, real backend/MVP work. Keep original M0–M5 release gates and previously agreed architecture decisions.



## P1-D Shop Plus localization and retry-state checkpoint — 23 October 2026
- **Branch only, Draft PR #1:** `feat/i18n-shop-feedback-20261022`; code/tests SHA `893538c33dd7cdecf9aa77e359a999d649a7a247`. Demo integration, main and Production were NOT changed.
- Shop Plus: **18** new semantic `shopPlus:*` messages for validation and status (filters, listings, stock, vehicles, rentals, requests, answers, reports, simulated orders and quota failure), all in **sq/en/it**. Total catalogs: **337 identical keys/locale in 15 namespaces** at `i18n/locales` and `demo/i18n/locales`. Do not alter legacy `type`, `city`, `reason` or stored domain values.
- On failed `localStorage.setItem`, Shop Plus restores its last persisted data snapshot, retains user-entered form DOM/values and shows localized failure rather than navigating to a false success screen. Only after successful save does the create/request/response/report workflow change screen. This is DEMO client-side safety, not an ACID backend.
- UGC protection expanded to Shop Plus listing title/store/description, request title/details, answers, report targets, and shop identifiers in relevant views via `data-user-content`. This does NOT claim full UGC isolation in other modules.
- Added **9 Chromium tests** after 71 baseline: 3-language request feedback/canonical data (3), 3-language listing validation (3), storage failure with input retention/retry (1), listing UGC across locale changes (1), request UGC across locale changes (1).
- **VERIFIED**: [Actions #39935174398](https://github.com/titanfit102-bit/Illyrian/actions/runs/39935174398) on `893538c33dd7cdecf9aa77e359a999d649a7a247`: **80 / 80 passed (2.4m)**, Chromium. Previous run #39934891160 (70/71) failed because an older quota test presumed Albanian in an English browser; fixed by explicitly selecting sq. No test removed.
- OPEN: Shop Plus remaining *static* and generated UI copy, i18n form option display labels while keeping canonical values, Plans, Privacy, Settings audits, comprehensive UGC protection, live switching in every open dialog, visual/a11y/Android checks, Vercel Preview candidate. 80/80 is only controlled Chromium suite success, not production/mobile sign-off.
- Next: continue semantic i18n localization in Plans & Privacy, then full demo QA, owner phone screenshots, and Phase 8 design gates M0–M5; maintain approved architecture decisions in blueprint §10. No merge to main or Production without explicit user approval.


## P1-D Shop Plus static-form localization — 23 October 2026 (verified)
- Branch `feat/i18n-shop-feedback-20261022` (Draft PR #1). **No merge** into DEMO integration, main or Production.
- Catalogs gained **37** curated `shopPlus:form*` UI phrase entries per sq/en/it, reaching **374 keys/locale, 15 namespaces**; root and `demo/i18n` mirrors equal. Covers create listing, pricing/stock/cars/property/rental, buyer request deadlines/details, reporting reasons and form buttons. UI uses the **existing transitional DOM phrase adapter** for these static labels; direct key binding remains an open migration task. No new i18n system or separate service was added.
- User-entered fields and persisted domain options remain immutable; report reason values remain historical Albanian codes while displayed text translates. Coverage checked with **nine new Chromium Playwright cases** across sq/en/it for listing, request and report forms; live language changes preserve entered values and option codes.
- Verified Actions [#39937253596](https://github.com/titanfit102-bit/Illyrian/actions/runs/39937253596), **89/89 PASS (2.6m)** on exact SHA `429927296870ea6b6d6ca1e90ab3cb4726cb307d`. Earlier 80/80 PASS is historical. A locale-only commit `6294d7c...` also passed CI but is superseded by this code+test SHA.
- Open gaps: Shop Plus full static prose and dynamic generated fragments not proven complete; direct semantic bindings, Plans/Privacy localization and quota handling, UGC exclusions in remaining modules, phone/responsive/a11y/Preview release checks. 89/89 is automated Chromium scope, not production certification.


## P1-D Plans dynamic i18n + storage integrity — 23 October 2026, verified
- Development branch `feat/i18n-shop-feedback-20261022`, Draft PR #1. Code+test SHA `8c2ebfd57227f6f4f22ffa377a2067f83022c072`; DEMO integration `015ce439...` and main `9f91b5c...` were not merged/updated by this change.
- Plans adds **18 direct semantic runtime keys** (`plans:*`) in sq/en/it for cancellation, participation, review, waitlist, message, validation, activity save and draft notices, while reusing existing `plans:localStorageError`. Mirrored locale catalogs: **392 keys/language, 15 namespaces**.
- DEMO Plans persistence now maintains `lastSaved` serialized state; failed browser write restores events/requests/messages/attendance, shows an error rather than a false-success view and preserves the active new/edit form input for retry. Action-level failures display an inline notice without rebuilding the form. This is DEMO localStorage behavior, not a transactional production server.
- Event titles in targeted summary/detail DOM paths are protected via `data-user-content`. Wider audit of place, conditions, messages and other module UGC is NOT complete.
- Added six Playwright Chromium scenarios since 89 baseline: failed new activity and cancellation with state preservation (2) + en/it form validation/success and localized quota handling (4). Existing sq-storage tests explicitly select sq. The earlier run with 94/95 passed one fewer case because the Italian test expected alternate wording rather than the actual catalog translation; assertion was aligned to source without masking coverage.
- **CI VERIFIED:** [Actions #39938445963](https://github.com/titanfit102-bit/Illyrian/actions/runs/39938445963) on SHA `8c2ebfd57227f6f4f22ffa377a2067f83022c072`: **95/95 Playwright Chromium PASS (2.7m)**.
- OPEN: full Plans static copy, UGC protection for descriptions/chat, Privacy map localization and local state failure rollback, static Shop Plus prose/direct-key replacement, a11y/visual/phone testing, Vercel Preview code identity, owner phone screenshot review. Do not merge to DEMO/main/Production without owner's express authorization.


## P1-D Privacy Map localization + failure-safe local access states — 23 October 2026
- **Development only:** Draft PR #1 `feat/i18n-shop-feedback-20261022`. Code/tests SHA `2048ca78c9d062cb2afa8028251a6f600456c36a`. No merge into DEMO integration, main or Production.
- Privacy & Map gained **26** direct semantic sq/en/it keys (status labels for `none/pending/accepted/declined/blocked`, follow/group request approval, rejection, withdrawal, blocking, local storage failure, map kind labels, plan state notices and invalid filters), resulting in **418 keys per language / 15 namespaces**, exact root/demo catalog mirrors.
- Retains existing persisted domain codes (`follow`, `membership`, map `all/activity/business`, city IDs, public/private) without rewriting user-authored names. Relevant selected map items and public activity titles marked `data-user-content` so UI phrase translations do not alter user-originated text.
- Private-demo writes maintain last successful stored snapshot of follow/membership. A refused `localStorage.setItem` rolls back in-memory values and displays a localized failure, instead of claiming a follow, group membership, or block was saved. This remains **client-side simulation**, not server-enforced authorization or real data privacy.
- Removed duplicate notice rendering in the statuses view. Prior run #39939898357 showed **98 PASS / 3 FAIL** due to the duplicate status region; after the fix, **[Actions #39939993711](https://github.com/titanfit102-bit/Illyrian/actions/runs/39939993711)** on exact code/tests SHA `2048ca78c9d062cb2afa8028251a6f600456c36a`: **101 / 101 Chromium Playwright PASS (2.7m)**. Six new tests cover quota rollback/retry, stable map enums/localized labels, plan-state notices, user-authored activity title across languages.
- Remaining: complete Privacy static copy, Plans/Shop Plus static prose, full app-wide UGC inventory and semantic binding migration, real accessibility/mobile QA, current Vercel Preview candidate, owner's phone review with screenshots. Do not claim release readiness or mobile app completeness.


## P1-D Privacy UI direct-binding migration — 23 October 2026 (verified)
- Work continued **in place**, not a restart: `feat/i18n-shop-feedback-20261022` / Draft PR #1; code/test SHA `d803758ee14cfaa26bc5cab4eee8e27571d5a535`. No merge into DEMO integration, main or Production.
- Converted scoped Privacy & Map headers, navigation tabs, accessibility labels, warning/footer, map filtering labels/search placeholder, group introduction and activity-state headings to direct semantic `privacy:*` keys. Added **17 new curated static keys**, raising synchronized `sq/en/it` catalogs to **435 keys/locale, 15 namespaces** (Privacy 55 keys).
- Added `data-i18n-direct` contract in the shared root/demo DOM i18n adapters: nodes already translated with direct semantic keys must be excluded from the transitional phrase-based repaint. This fixed an actual collision in Italian where semantic `privacy:profiles=Profili` was being rewritten as `Profilo` via another phrase key. Do not disguise this regression by changing the expected translation; maintain the explicit marker and regression test.
- Active Privacy dialog refreshes on `illyrian:language-changed`. Map form preserves unsent `city`, `kind`, `q` values and input focus across sq/en/it switches, without migrating persisted enum IDs or silently submitting the form.
- Profile/group names and descriptions in tested Privacy views receive `data-user-content` exclusion; no promise of fully audited UGC across the entire app.
- **VERIFIED GitHub Actions [#39944600826](https://github.com/titanfit102-bit/Illyrian/actions/runs/39944600826)**: **110/110 Chromium Playwright PASS (2.9m)** on exact code/test SHA `d803758ee14cfaa26bc5cab4eee8e27571d5a535`. Nine tests added after prior 101 baseline: three direct existing labels by locale, live map fields/focus, profile/group UGC, three additional map/group/status labels, and one targeted collision sentinel. Earlier 105/106 and 108/109 failed specifically on Italian `Profili` collision; corrected by explicit direct-key boundary, not removing coverage. Intermediate adapter fix reached 109/109 PASS at #39944510635.
- OPEN: other Privacy static blocks and dynamic badges, full Plans and Shop Plus static/direct semantic migration, remaining UGC inventory, a11y/visual/native-phone QA, current Vercel Preview/SHA routing, final owner screenshots. The DEMO remains a simulated local browser product, not real privacy authorization. Keep original product Phase 8 M0–M5 gates.


## P1-D Plans direct form semantics and live locale switching — 23 Oct 2026 (verified)
- Continued existing DEMO in isolated `feat/i18n-shop-feedback-20261022` / Draft PR #1, no merge or production deployment. Exact tested code+QA commit: `5961a1d90a25b8d7768fe022ec3de3f3760e78a7`.
- **25 new direct `plans:*` locale keys** in Albanian, English and Italian: event title, kind, city, venue, date/time, capacity/contribution, visibility, conditions, safe-demo notice, action buttons, form placeholders and technical option display labels. Totals now **460 keys/language across 15 namespaces**, mirrored exactly at `i18n/locales` and `demo/i18n/locales`.
- `choose(values,current,keyOf)` keeps unchanged persisted values (`Sport`, `Miqësi dhe komunitet`, `Kulturë`, `Alumni`, `Bashkëpunim`; `public/private`, and cities) while translating visible option labels; input labels and options are scoped `data-i18n-direct` to prevent legacy phrase adapter interference.
- Added Plans handler for `illyrian:language-changed`: an open event form preserves all typed/select values, field focus and validation text; open chat draft is also preserved on re-render. No implicit local save, event publish or persisted-code mutation on language change.
- Expanded `data-user-content` protection on event venue in summary/detail, event conditions, chat names/messages, and created-event title. **This is scoped UGC protection**, not proof of complete app-wide isolation.
- **Current verified CI:** [Actions #39946187468](https://github.com/titanfit102-bit/Illyrian/actions/runs/39946187468) at the exact code/tests SHA above, **115/115 Playwright Chromium PASS (3.0m)**. Five added tests versus the prior 110 baseline: 3 language-specific semantic form/enum tests, 1 unsaved-field/focus/persistence locale-switch scenario and 1 UGC locale-switch scenario. Syntax and catalog parity were also checked independently.
- OPEN: remaining static text and labels outside the Plans form; Shop Plus conversion from transitional phrase mapping to direct keys, additional Privacy areas, global UGC audit, browser accessibility/visual/mobile QA, Vercel preview SHA verification and owner's physical phone screenshot review. No native mobile or production readiness certification implied. Phase 8 real-app gates M0–M5 remain separate.


## P1-D Shop Plus direct semantic forms + locale-state QA — 23 Oct 2026
- Continue existing `feat/i18n-shop-feedback-20261022` / Draft PR #1, preserving previously accepted DEMO functionality. **Verified code/test SHA `82b62fd06b724e5436a5ed7bbc51b2aa32e1de0f`**. No change/merge into DEMO integration or main, no Production deployment.
- Shop Plus **reuses existing** sq/en/it `shopPlus:*` and `shop:*` keys (no new catalogs/keys needed this cycle). Explicit direct bindings now cover creation/editing listings, buyer requests, report reasons, category choices, periods, day/deadline choices, primary search filter controls, sort captions, navigation tabs and title/footer. Marked direct UI nodes `data-i18n-direct` to prevent old phrase translator from repainting them. The transitional phrase adapter remains for other legacy screen copy.
- Canonical `option.value` identifiers remain unchanged (types `Produkte/Makina/Banesa me qira/Shërbime`, `Të gjitha`, cities, `muaj/javë`, sort codes `relevance/lowest/highest/name`, report reasons and buyer request days). Existing state persistence model and money calculation remain untouched.
- `illyrian:language-changed` handler rerenders an open Shop Plus dialog and restores unsubmitted form values (including checkboxes and selected enums), plus input focus. It does not submit, publish, mutate storage or change an external backend. The earlier failed-localStorage rollback and `data-user-content` protections remain.
- **Eight new Chromium Playwright tests** since 115 baseline: 3 sq/en/it listing/catalog/filters with canonical enums, 3 sq/en/it buyer requests/report reasons with canonical stored codes, live locale switch without losing listing/request fields/focus, and live report reason/detail/focus. Additional assertion tests direct submit-button label in all three languages.
- VERIFIED GitHub Actions **[#39948438751](https://github.com/titanfit102-bit/Illyrian/actions/runs/39948438751)** on exact code/test SHA `82b62fd06b724e5436a5ed7bbc51b2aa32e1de0f`: **123/123 Playwright Chromium PASS (2.8m)**. Prior code+test SHA `ca14becec49515fe81befa5aaa22638a8b9fefb1` also 123/123 PASS, superseded by the direct submit-label shield and assertion. Independent syntax, catalog parity and root/demo mirror checks passed (460 keys/locale, 15 namespaces; Shop Plus 76 keys/locale).
- Remaining: Shop Plus catalog/cards/stores/checkout and generated static copy still partly uses transitional phrase mapping; audit all residual notices and UGC paths, keyboard/screenreader/visual and mobile browser review, verify exact Vercel Preview candidate, then owner phone screenshots. Do not label full localization certified or production ready. Real application Phase 8 M0–M5 gates unchanged.


## P1-D Shop Plus catalog, seller and demo-checkout direct i18n — 23 October 2026 (verified)
- Source/test SHA: `5fe384f89c5ad958825b52c81c6599dd055e1ad2`, isolated `feat/i18n-shop-feedback-20261022`, Draft PR #1 (not merged). Previous direct-form checkpoint was 123/123 PASS.
- Added **39 curated direct `shopPlus:*` UI strings** across sq/en/it, synchronized 499 keys per locale / 15 namespaces (Shop Plus 115 keys per locale), root/demo mirrors equal. Converted catalog hero, product cards, inventory/stock, sponsored badges, same-SKU comparison, seller directory/store descriptions, sample checkout flow and pricing/5% commission disclosure to explicit `ui()/feedback()` semantic translations and `data-i18n-direct`. Reused existing `shop:*` keys where appropriate.
- Preserved original product/seller names as `data-user-content` in targeted catalog/comparison/shop nodes; maintained canonical category and city IDs, monetary values/EUR conversion, inventory, sample order IDs, and localStorage schema. Persisted order statuses remain `E krijuar në demo` and `Kërkesë anulimi/kthimi (demo)`; their **display labels alone** translate into en/it. Unknown/historical status strings are now preserved verbatim instead of incorrectly being labeled as a return request. Fee stays an illustrative 5% and explicitly NOT approved; no checkout, payment, delivery or refund occurs.
- Seven added browser tests: three per-language catalog/product comparisons and sponsored UI, three per-language seller/checkout disclosures, one persisted-order code and live display translation; one further test ensures unrecognized order statuses do not get misrepresented. Total **131 Playwright Chromium PASS** at [Actions #39968158271](https://github.com/titanfit102-bit/Illyrian/actions/runs/39968158271), 3.3m, on exact source+tests SHA `5fe384f89c5ad958825b52c81c6599dd055e1ad2`.
- CI history: first catalog run #39967077249 failed 3 existing broad Playwright selectors because newly direct-bound catalog hero introduced another `h2[data-i18n-direct]`; tests were correctly scoped to `header h2`, no underlying functionality removed. Corrected 130/130 run #39967739455 PASSED. Then known-only order status handling and extra test yielded 131/131 PASS. No skipped/deleted tests used to reach green.
- Open gaps (explicitly not complete): Shop Plus item-detail descriptions and rental time labels, buyer-request board explanation/response UI, reporting/moderation prose, localized screen-reader/accessibility audit, app-wide UGC audit, mobile/responsive screenshots and Vercel Preview exact SHA. Still a synthetic browser DEMO, not a production marketplace; architectural Phase 8 app-real M0–M5 remain separate. No change to main/integration/Production or release.
