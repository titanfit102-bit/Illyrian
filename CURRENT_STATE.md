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
- **SHA i fundit i kodit + testeve të verifikuara:** `5fe384f89c5ad958825b52c81c6599dd055e1ad2`.
- [GitHub Actions #39968158271](https://github.com/titanfit102-bit/Illyrian/actions/runs/39968158271): **completed / success, 131/131 Playwright Chromium PASS (3.3m)** mbi SHA-në e mësipërme; logu i job-it u kontrollua. Kjo **nuk** certifikon plotësinë e UI, aksesueshmërinë, telefonin ose sigurinë reale.
- i18n: **sq/en/it**, **499 çelësa/gjuhë**, **15 namespace**, `shopPlus` **115 çelësa/gjuhë**; pasqyrat `i18n/locales/` dhe `demo/i18n/locales/` janë verifikuar identike.
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

**Veprimi i saktë pasues:** inventar i kodit aktual të Shop Plus / pjesëve të mbetura, ndryshim i izoluar vetëm nëse ekziston autorizim për kod, teste për çdo SHA, pastaj checkpoint-i i dokumenteve. Kjo detyrë **vetëm dokumentacion** nuk autorizon ndryshime kodi.

## 4. Protokolli operativ dhe autorizimi [VENDIM I PRONARIT, 2026-10-23]
- Autorizim **i vazhdueshëm** vetëm për krijim/përditësim të `CURRENT_STATE.md` dhe `MASTER_HANDOFF.md` në `feat/i18n-shop-feedback-20261022`, pas çdo ndryshimi material e të **verifikuar**. Mos pyet çdo herë për këta dy dokumente, për sa kohë dega dhe kufijtë nuk ndryshojnë.
- Mos fshi historikun; përditëso gjendjen kanonike dhe shto vetëm delta të nevojshme. Dallo **FAKT / VENDIM / PLAN / HIPOTEZË / E PAVERIFIKUAR**. Refuzimi i ruajtjes duhet raportuar, jo pretenduar si sukses.
- Ky autorizim **nuk** përfshin ndryshime në kod, testet, workflows, skedarë të tjerë, PR merge, main, Production, deploy, shpenzime, kredenciale apo migrime të rrezikshme. Për ato veprime duhen autorizimet përkatëse.
- Përditësimi i dokumenteve bëhet gjatë sesioneve aktive të punës, **jo automatikisht në sfond**. Nuk ka cron/task që e sinkronizon repository-n pa një ekzekutim të autorizuar.
- Para shkrimit: lexo HEAD-in, konfirmo PR/statusin/testet; pastaj shkruaj dy dokumentet në **një commit dokumentacioni**, me kusht që HEAD të mos ketë ndryshuar. Rilexo përmbajtjet dhe kontrollo diff-in pas commit-it.
- Nëse ky dokument dhe GitHub nuk përputhen, **GitHub live fiton**; përcakto çfarë ndryshoi dhe rregullo checkpoint-in, mos përsërit automatikisht punë të kryer.

## 5. Bootstrap për një bisedë të re
Kur përdoruesi shkruan **“Vazhdo projektin”**, lexo me radhë: `CURRENT_STATE.md` → pjesën **ACTIVE SNAPSHOT** të `MASTER_HANDOFF.md` → `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` §10 → `architecture/ILLYRIAN_I18N.md` → `demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md`. Pastaj verifiko **HEAD, PR #1, diff pas checkpoint-it, CI mbi SHA e saktë dhe deployment**. Përcakto veprimin e parë të pambyllur dhe kufijtë e autorizimit. Mos nis nga zero dhe mos shpik informacionin që nuk mund të rikuperosh.

**Checkpoint status:** këto të dhëna ishin të verifikuara **para commit-it të krijimit të dokumenteve**. SHA i commit-it të vazhdimësisë është commit-i Git që shton/ndryshon dy skedarët; lexo versionin live për SHA-në aktuale.
