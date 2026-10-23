# ILLYRIAN — CURRENT_STATE
> Checkpoint: 2026-10-23 (Europe/Rome). **Ky është indeksi i rikuperimit**, jo raport përfundimtar release.
> **Autoriteti:** gjendja LIVE e GitHub > ky checkpoint > pjesët më të vjetra historike. Lexo edhe [MASTER_HANDOFF.md](MASTER_HANDOFF.md) dhe [blueprint-in](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md).

## 1. Referencat e verifikuara [FAKT]
- Repository: [`titanfit102-bit/Illyrian`](https://github.com/titanfit102-bit/Illyrian), **PUBLIC** sipas GitHub API; jo private. Mos vendos sekrete në repo.
- Dega e vetme e autorizuar për përditësimet e vazhdimësisë: `feat/i18n-shop-feedback-20261022`.
- **HEAD para krijimit të këtij checkpoint-i:** `534098b6b5194175e78193614debe1bb0ea773cb` (**dokumentacion-only** nga krahasimi me kodin e testuar). Pas commit-it të dokumenteve, lexo HEAD-in LIVE; ky numër është referencë historike, jo premtim se është HEAD i përhershëm.
- [Draft PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1): **OPEN / DRAFT / UNMERGED**; head = dega sipër; target `demo/v1.7-illyrian-shop`.
- Dega integruese DEMO: `015ce439e7c6d736149c6c300391586517664f62` (e pandryshuar gjatë verifikimit).
- `main`: `9f91b5c083b4482a70a2149483cc799360e6102c` (e pandryshuar gjatë verifikimit).
- **SHA i fundit i kodit + testeve të verifikuara:** `29eb70996f89d46a5e855f5bf42271adca7dfb7a`.
- [GitHub Actions #39968158271](https://github.com/titanfit102-bit/Illyrian/actions/runs/39968158271): **completed / success, 131/131 Playwright Chromium PASS (3.3m)** mbi SHA-në e mësipërme; logu i job-it u kontrollua. Kjo **nuk** certifikon plotësinë e UI, aksesueshmërinë, telefonin ose sigurinë reale.
- i18n: **sq/en/it**, **549 çelësa/gjuhë**, **15 namespace**, `shopPlus` **165 çelësa/gjuhë**; pasqyrat `i18n/locales/` dhe `demo/i18n/locales/` janë verifikuar identike.
- Vercel: projekti `illyrian-demo` ekziston; **statusi dhe SHA-ja e Preview aktual NUK u verifikuan** sepse leximi i deployments ktheu **403 / team authorization**. Dokumentacioni i vjetër për READY `fbd04ad...` dhe build-rate-limit është historik; mos e paraqit si Preview të kodit të sotëm.

## 2. Ku kemi mbetur [IMPLEMENTIM + KUFIZIME]
- DEMO v1.7 është **HTML + vanilla JavaScript + module + localStorage**; jo app real React Native/Expo, backend, pagesa, moderim apo identitet real.
- Module: Shop bazë; Shop Plus (produkte, makina, qira, shërbime, kërkesa, raportime, porosi **simuluese**); Plans; Connections; Privacy/Map; Governance, krahas social UI të DEMO-s.
- i18next 25.7.0 lokal, fallback teknik `en`; përkthim semantik direkt në rrugët e migruara; `data-i18n-direct` shmang mbishkrimin nga adapteri legacy; `data-user-content` mbron tekstet e përdoruesit në rrugët e audituara.
- Vlerat teknike të kategorive/statusit/qyteteve/formularëve **nuk përkthehen** në storage. Refuzimi i `localStorage` rikthen gjendjen e fundit të ruajtur në rrugët e testuara. Kalimi i gjuhës ruan inputet e papublikuara në formularët e trajtuar.
- Cikli i fundit: **Shop Plus katalog / karta / dyqane / simulim porosie**, 39 çelësa të rinj, statuset historike të porosive nuk ndryshohen; kodet e panjohura nuk etiketohen gabimisht si kthim. **5% është komision ilustrues, JO tarifë e miratuar.**
- **Nuk kemi bërë merge në degën DEMO, `main` apo Production.** Mos supozo Preview të deploy-uar.

## 3. Bllokimet dhe puna e hapur [OPEN]
1. Përfundo inventarin dhe lokalizimin direkt të teksteve të mbetura të Shop Plus (detaj listimi, qira/periudha, kërkesat e blerësve, përgjigjet, moderimi/raportimet); fragmente statike të Plans/Privacy/Settings dhe module të tjera.
2. Audit **global** i të gjitha teksteve UI dhe UGC në sq/en/it, modalet/empty/error states, a11y (keyboard, fokus, screenreader, ARIA/live regions), pamjet portrait/landscape, performancë dhe regresione vizuale. Nuk ekziston ende provë e plotë për këto gates.
3. Verifiko Vercel Preview me **SHA të saktë**, pasi të rikthehet autorizimi Vercel; mos deploy / ndrysho planin pa leje.
4. Përgatit paketën e QA të DEMO-s dhe **testimin e plotë nga pronari në telefon me screenshot-e**; mos shpall release pa sign-off.
5. Para aplikacionit real: zgjidh vendimet e hapura të platformës, tregut, sigurisë, kostove, licencimit dhe përputhshmërisë; ndiq [M0–M5](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md), jo implementim automatik.
6. **Rrezik:** repository është PUBLIC, por dokumentet e vjetra e quajnë private; shqyrto ekspozimin, licencën dhe privatësinë para integrimit me sisteme reale.

### Rezultati i inventarit Shop Plus — 2026-10-23 [FAKT, PA NDRYSHIM KODI]
- Audit LIVE: HEAD `2c9cff9fd2cdad64e9813c80f47f2d2b38ec8dc5`; dy commits pas kodit `5fe384f89c5ad958825b52c81c6599dd055e1ad2` janë vetëm dokumentacion. CI #39968158271 = 131/131 Chromium PASS për SHA e kodit, jo një run në HEAD.
- `demo/ILLYRIAN_SHOP_PLUS_v1.7.js`: `itemView()` (detaji, metadata makine/qiraje/stoku, butonat/disclaimer), `board()` (kërkesat, afati/empty/replies), `respond()` (formulari i përgjigjes), `moderation()` (tituj/statuset/arsyet) kanë ende tekste të forta shqip pa lidhje të drejtpërdrejtë semantike. `period()/card()` përdorin `muaj/javë` si etiketë UI në vend të tekstit sipas gjuhës. Dialog `aria-label`, mbyllja dhe butoni i hyrjes për Shop Plus janë gjithashtu hardcoded; adapteri legacy mund të ndryshojë disa fraza, por kjo nuk provon mbulim semantik.
- `qa/illyrian-v17-i18n.spec.cjs` verifikon katalogun, kartat, dyqanet, formën e raportimit, porositë simuluese dhe kodet e ruajtura. `qa/illyrian-v17-i18n-inventory.spec.cjs` sheh vetëm skedën fillestare Shop Plus, jo detajet/kërkesat/përgjigjet/moderimin. **Coverage i plotë i18n dhe a11y është ende OPEN.**
- **Hapi pasues [PLAN, KËRKON AUTORIZIM PËR KOD]:** patch i kufizuar `itemView() + period()/card()` me keys `shopPlus:*` për sq/en/it dhe teste Playwright për detail produkt/makinë/qira. Ruaj domain values, UGC, status codes, localStorage. Më pas `board()/respond()`, `moderation()`, dialog a11y. Pa merge/deploy.

### Checkpoint i verifikuar: Shop Plus item detail + rental labels — 2026-10-23
- Source/locale/QA commit: `40396a7342221a244391d5416a7df1b11a8e5835`; [GitHub Actions #39981149744](https://github.com/titanfit102-bit/Illyrian/actions/runs/39981149744) = **134/134 Playwright Chromium PASS (3.3m)** në SHA ekzakte; u kontrollua logu.
- `itemView()`: etiketa produkti/makine/qiraje/stoku/veprimesh direkt sq/en/it; `period()/card()` tregojnë etiketa gjuhësore `muaj/javë`, pa ndryshuar vlerat persistente. Karburanti i njohur shfaqet i lokalizuar, i panjohuri mbetet origjinal. U shtuan 22 keys për gjuhë: **521/locale, 15 namespace**; pasqyra root/demo identike. +3 E2E testet e detajeve.
- **OPEN pas këtij checkpoint-i:** `board()`, `respond()`, `moderation()`, dialog a11y dhe entry-button, audit UI/UGC global, Vercel SHA, testimi fizik/visual/a11y.

### Checkpoint i verifikuar: Shop Plus remaining dynamic views — 2026-10-23 [FAKT]
- Kodi/locale commit `99885a6b4739f62768f8c89ab6cc218f80f5175b`; korrigjimi i testit `29eb70996f89d46a5e855f5bf42271adca7dfb7a`. [GitHub Actions #39983307279](https://github.com/titanfit102-bit/Illyrian/actions/runs/39983307279) = **137/137 Chromium Playwright PASS (3.0m)** në SHA `29eb70996f89d46a5e855f5bf42271adca7dfb7a`; u verifikua logu. Dështimi i mëparshëm #39982722382 ishte **vetëm në testin e ri** (`page.evaluate` me `language` jashtë browser scope); 134 testet ekzistuese kaluan, dhe testi u korrigjua, jo u hoq.
- `board()`, `respond()`, `moderation()`, `render()` dialog-label/close dhe `inject()` entry-button tani përdorin direct semantic sq/en/it dhe mbrojtje të UGC. Statuset/arsyet e njohura të raportimit përkthehen vetëm për shfaqje; të panjohurat mbeten origjinale/escaped. Afatet shfaqen me formatin e gjuhës pa ndryshuar ISO të ruajtur.
- +28 keys/locale mbi 521: **549 çelësa për gjuhë, 15 namespace; `shopPlus` 165**. Mirror root/demo identik (rilexim LIVE). +3 teste end-to-end për buyer request/reply/report/aria/UGC dhe persistencë.
- **Autorizimi aktual [VENDIM NGA PËRDORUESI]:** ndryshime inkrementale në kod/përkthime/teste të Shop Plus në këtë degë **janë të autorizuara vazhdimisht brenda Fazës 7**, pa leje për çdo patch; dokumentet `CURRENT_STATE.md` dhe `MASTER_HANDOFF.md` përditësohen pas evidencës. Asnjë autorizim për merge, deploy, `main`, Production apo shpenzime.
- **OPEN (mos shpall release):** inventari i zgjeruar i të gjitha nën-pamjeve Shop Plus dhe kontrolli i state-eve të rralla, QA vizual/a11y/keyboard/screenreader, UGC app-wide, Vercel Preview SHA, testimi final fizik me screenshot-e nga pronari. Lokalizimi kryesor i Shop Plus është i implementuar/testuar në Chromium, jo certifikuar plotësisht si produkt.

**Veprimi i saktë pasues:** zgjero inventarin e nën-pamjeve Shop Plus (detaj/raportim/kërkesa/dyqane/checkout/formular) dhe audit edge states + keyboard pa ndryshuar domain codes; ekzekuto suite në SHA e saktë, dokumento; më pas QA mobile/screenreader dhe screenshot review nga pronari para release.

## 4. Protokolli operativ dhe autorizimi [VENDIM I PRONARIT, 2026-10-23]
- Autorizim **i vazhdueshëm** vetëm për krijim/përditësim të `CURRENT_STATE.md` dhe `MASTER_HANDOFF.md` në `feat/i18n-shop-feedback-20261022`, pas çdo ndryshimi material e të **verifikuar**. Mos pyet çdo herë për këta dy dokumente, për sa kohë dega dhe kufijtë nuk ndryshojnë.
- Mos fshi historikun; përditëso gjendjen kanonike dhe shto vetëm delta të nevojshme. Dallo **FAKT / VENDIM / PLAN / HIPOTEZË / E PAVERIFIKUAR**. Refuzimi i ruajtjes duhet raportuar, jo pretenduar si sukses.
- **Përditësim autorizimi, 2026-10-23:** pronari ka autorizuar shprehimisht edhe ndryshime inkrementale të kodit, përkthimeve dhe testeve **vetëm për përfundimin e i18n Shop Plus** në këtë degë. Kjo nuk përfshin PR merge, main, Production, deploy, pagesa, sekrete, ndryshime në projekte të tjera apo migrime të rrezikshme.
- Përditësimi i dokumenteve bëhet gjatë sesioneve aktive të punës, **jo automatikisht në sfond**. Nuk ka cron/task që e sinkronizon repository-n pa një ekzekutim të autorizuar.
- Para shkrimit: lexo HEAD-in, konfirmo PR/statusin/testet; pastaj shkruaj dy dokumentet në **një commit dokumentacioni**, me kusht që HEAD të mos ketë ndryshuar. Rilexo përmbajtjet dhe kontrollo diff-in pas commit-it.
- Nëse ky dokument dhe GitHub nuk përputhen, **GitHub live fiton**; përcakto çfarë ndryshoi dhe rregullo checkpoint-in, mos përsërit automatikisht punë të kryer.

## 5. Bootstrap për një bisedë të re
Kur përdoruesi shkruan **“Vazhdo projektin”**, lexo me radhë: `CURRENT_STATE.md` → pjesën **ACTIVE SNAPSHOT** të `MASTER_HANDOFF.md` → `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` §10 → `architecture/ILLYRIAN_I18N.md` → `demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md`. Pastaj verifiko **HEAD, PR #1, diff pas checkpoint-it, CI mbi SHA e saktë dhe deployment**. Përcakto veprimin e parë të pambyllur dhe kufijtë e autorizimit. Mos nis nga zero dhe mos shpik informacionin që nuk mund të rikuperosh.

**Checkpoint status:** këto të dhëna ishin të verifikuara **para commit-it të krijimit të dokumenteve**. SHA i commit-it të vazhdimësisë është commit-i Git që shton/ndryshon dy skedarët; lexo versionin live për SHA-në aktuale.
