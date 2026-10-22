# ILLYRIAN Demo v1.7 — Faza e zgjerimit dhe ILLYRIAN Shop

**Data e nisjes:** 21 tetor 2026  
**Burimi:** kërkesa eksplicite e përdoruesit për t'i ndërtuar të gjitha funksionet e mbetura të demos, plus ILLYRIAN Shop (produkte, dyqane të vogla, makina, banesa me qira dhe kërkim ndër-dyqanesh), me vazhdim fazë pas faze.  
**Status:** PAKETAT 1–6 KANË IMPLEMENTIM BAZË NË KODIN E DEGËS SË TESTIMIT; paketat 7–8 mbeten për t'u realizuar. Fazat 3–6 kanë prova të logjikës me DOM të simuluar; nuk është përfunduar ende regresioni real në Chromium/telefon ose miratimi i demos.  
**Dega e izoluar:** `demo/v1.7-illyrian-shop`; baza `demo/v1.6-stories-reels`.  
**Mbrojtja:** Nuk preken `main`, Vercel Production, projekti tjetër ose skedarët ekzistues të v1.6. NUK autorizohen vetvetiu pagesa, komisione reale, investim apo publikim në dyqane.

## Vendime për demonstrimin

1. `ILLYRIAN Shop` është një modul i veçantë brenda ecosistemit ILLYRIAN (jo aplikacion i pavarur).
2. Listimet demonstrative ndahen në **Produkte, Makina, Banesa me qira, Shërbime**; kërkimi i përgjithshëm përfshin gjithë kategoritë.
3. Çdo produkt tregon shitësin/dyqanin dhe qytetin; kërkimi mund të gjejë të njëjtin produkt në disa dyqane, pastaj përdoruesi mund t'i filtrojë sipas dyqanit, kategorisë ose qytetit.
4. Dyqanet e vogla mund të publikojnë listime në simulim, t'i redaktojnë dhe fshijnë; ato ruhen vetëm në shfletues.
5. Shporta dhe porosia janë demonstrative dhe vlen vetëm për listimet e tipit Produkte; makinat/banesat/shërbimet përdorin kërkesë informacioni demonstrative, JO rezervim ose pagesë.
6. **Komisioni ilustrues 5%** ekziston vetëm për të treguar llogaritjen e mundshme në demo. Nuk është tarifë e miratuar, marrëveshje komerciale, llogaritje tatimore apo faturim.
7. Për Shqipërinë, hipoteza e një tregu vendas kërkon verifikim me dyqane/shitës/blerës dhe analizë të kostos së pagesave, dërgesave, kthimeve, ankesave dhe rregullave përkatëse. Nuk ka provë që do të ketë sukses ose përqindje të ardhurash të garantuara.

## Paketa 1 — Baza ILLYRIAN Shop [E IMPLEMENTUAR / QA LOKAL]

**Skedarë të rinj:**
- `demo/ILLYRIAN_DEMO_v1.7.html`: kopje e paprekur funksionalisht e v1.6 me etiketë v1.7 dhe lidhje me modul të izoluar.
- `demo/ILLYRIAN_SHOP_v1.7.js`: logjikë e pavarur për Shop.
- `demo/ILLYRIAN_SHOP_v1.7.css`: pamja responsive e Shop.

**Sjellje të implementuara:**
- Hyrje te Shop nga Kryefaqja dhe Zbulo; ruan 5 ikonat ekzistuese.
- 12 listime shembull nga dyqane/ofrues në qytete të Shqipërisë dhe Kosovës (të gjitha fiktive).
- Kërkim sipas fjalëve të titullit, dyqanit, qytetit dhe përshkrimit; filtra kategori/qytet; renditje sipas çmimit ose dyqanit; dyqane të grupuara sipas rezultateve.
- Detaje produkti, dyqani/ofruesi dhe çmimi; shporta dhe porosia demonstrative; kërkesë informacioni për listimet jo-produkte.
- Formular për listim të përdoruesit me validime dhe kufij, redaktim/fshirje për listimet e veta.
- Ruajtje lokale për listimet, shportën, porositë dhe kërkesat, me kufi për madhësinë dhe escape HTML.
- Shembull shpjegues i komisionit 5%, i etiketuar shprehimisht si jo i miratuar.
- Butona dhe formulare të aksesueshme nga tastiera; modal Shop i izoluar; asnjë pagesë/kontakt real.

**QA e ekzekutuar në kopjen lokale:** 43/43 kontrolle Chromium në përmasa 320×650, 360×780, 390×844, 430×932 dhe 844×390 për Shop/hyrjen nga Home, kërkim, rezultate, dyqane, filtra, detaje, shportë, komision, checkout simulues, listim, escape HTML, mbyllje dhe gabime JS. Disa kontrolle janë të përqendruara vetëm në 390×844. **Kufizim:** prova është bërë duke ngarkuar një kopje lokale të v1.6 të përdoruesit së bashku me modulin e ri. Ndryshimet e mëvonshme të v1.6 janë përfshirë në HTML e GitHub v1.7, por regresioni i plotë i atij kombinimi dhe QA e drejtpërdrejtë në Vercel mbeten për t'u konfirmuar.

## Paketa 2 — Aktivitetet dhe organizatori [E IMPLEMENTUAR NË DEMO; QA E PJESSHME]
- Krijo/redakto/anulo aktivitetin: data, qyteti, vendi, çmimi/kushtet, kapaciteti, privatësia.
- Kërkesë -> pritje -> pranim/refuzim; panel organizatori; kush mund të shohë bisedën.
- Interesi për aktivitet, listë pritjeje dhe grupe shokësh vetëm si shembuj me pëlqim.
- Evidencë pjesëmarrjeje si simulim; pa pretenduar verifikim real.

### Implementimi konkret i Fazës 2 — 21 tetor 2026

- **Kodi:** `demo/ILLYRIAN_PLANS_v1.7.js` është modul i izoluar brenda `demo/ILLYRIAN_DEMO_v1.7.html`; `ILLYRIAN Shop` dhe v1.6 mbeten të pandryshuara.
- **Hyrja:** te skeda *Planet* u shtua karta “Krijo dhe menaxho aktivitete”.
- **Organizatori:** krijon aktivitet me titull, lloj, qytet, vend, datë/orë, kapacitet, kontribut, dukshmëri dhe kushte; redakton dhe anulon aktivitetin.
- **Kërkesat:** demonstron pjesëmarrësin që dërgon një kërkesë; organizatori e pranon ose refuzon. Nuk lejohet kërkesë aktive e dyfishtë.
- **Kapaciteti:** pranimi ndalohet kur vendet janë të mbushura; kërkesa e re shkon në listën e pritjes. Organizatori mund ta kalojë në pritje pas lirimit të vendit; **nuk** e pranon automatikisht.
- **Pjesëmarrja:** tërheqja liron vendin; organizatori shënon ardhjen si evidencë *vetëm demonstrative*.
- **Grupi:** biseda funksionon lokalisht për organizatorin dhe pjesëmarrësin e pranuar; mbyllet për mesazhe të reja pas anulimit ose kalimit të datës.
- **Privatësia demonstrative:** aktivitetet private nuk shfaqen në listën publike; kjo **nuk është** autorizim serveri.
- **Integrimi:** aktivitetet publike të krijuara shfaqen në listën e planeve me lidhje te paneli i tyre.
- **Të dhënat:** ruajtje në `localStorage`, jo databazë e përbashkët. Organizatori/pjesëmarrësi janë role të simuluara në një shfletues.

### Provat dhe kufizimet

- Kandidati lokal më i zgjeruar i panelit u provua në Chromium në 320, 360, 390, 430 dhe 844 px; **53/53 kontrolle** të kandidatit kaluan, përfshirë formularët, listën e pritjes, përditësimin, anulimin, mesazhet, kërkesat dhe ruajtjen e simuluar. Kandidati lokal **nuk është i njëjti skedar bit-për-bit** me modulin e ruajtur në GitHub.
- Pas shkrimit, mbi **skedarin e saktë të GitHub-it**, u ekzekutuan **25/25 kontrolle të logjikës në V8 me DOM të simuluar**: seed, kërkesë, pranim/refuzim, kufizim kapaciteti, tërheqje, listë pritjeje, ndryshim kapaciteti, promovim pa pranim automatik, krijim/anulim dhe serializim.
- Testimi end-to-end direkt në adresën e Vercel Preview, me tastierë dhe prekje në telefon fizik, **mbetet pa konfirmuar**; mos e konsidero këtë fazë të certifikuar për produktin real.
- Ndarja e dy roleve dhe kërkesat janë shembuj për UX; një përdorues real nuk mund të marrë privilegje organizatori thjesht duke ndërruar butonin e rolit. Implementimi profesional do të kërkojë autentikim, autorizim serveri, transaksione atomike, prova antispam dhe mekanizëm moderimi.
- Lista e grupeve të shokëve me pëlqim individual dhe kontrollet e plota konkurruese të kapacitetit janë **ende të hapura për fazën profesionale**; nuk pretendohen të implementuara nga demoja.
- Numri i fazave të mbyllura është tregues **i paketave të demos**, jo përqindje e përfundimit të gjithë aplikacionit.

## Paketa 3 — Idetë e diferencimit [E IMPLEMENTUAR NË DEMO; QA SIMULIMI]
- IN9-04 `Hera e parë`: përshkrimi i pritësit, vendi i takimit, opsion privat për pjesëmarrësin e ri.
- IN9-05 `Organizo sërish`: draft pasues pa ripërdorur automatikisht kohë/kushte.
- IN9-03 `Nga interesi te plani`: të interesuar me intervale kohore, organizatori vendos kur krijohet plani.
- IN9-07 `Bëjmë diçka bashkë`: format aktiviteti me rezultat konkret.
- IL-029 më i plotë: interes, disponueshmëri, audiencë dhe skadim të dukshëm.
- IN9-02 `Dy vendet e mia`: zona aktuale e zgjedhur manualisht + vendlindja pa GPS të detyrueshëm.

## Paketa 4 — Privatësi, lidhje sociale dhe harta [E IMPLEMENTUAR NË DEMO; QA V8]
- Profile private dhe kërkesa ndjekjeje; komunitete private e role.
- Harta e bizneseve/eventeve me vendndodhje të përafërt; pa koordinata publike të individëve.
- Përmirësimi i lidhjes postim/Story/Reel -> plan: i anuluar, privat, i mbushur, i skaduar.
- Korrigjim i responsivitetit të përgjithshëm në telefon horizontal.

## Paketa 5 — Shop i zgjeruar dhe ekonomia [BAZA E IMPLEMENTUAR NË DEMO; QA V8]
- Filtra të avancuar sipas nënkategorisë/intervalit të çmimit/kushteve; krahasim i ofertave të së njëjtës SKU kur ka informacion të besueshëm.
- Dyqane me profile/katalogë/oferta, inventar dhe fotografi demonstrative; automjete me vit/km; qira me lloj, zonë, sipërfaqe dhe afat.
- IN9-01 `Kërkoj...`: kërkesë shërbimi/produkti dhe përgjigje nga shitës të përshtatshëm; vetëm simulim.
- Shënjim reklamash/promovimesh; moderim listimesh; raportime; profil shitësi me transparencë.
- Flukse shembull për kthim, anulim, reklamim, provë dorëzimi dhe komision; JO transaksione reale.


### Zbatimi i Fazës 5 — 21 tetor 2026

**Skedarët e rinj:** `demo/ILLYRIAN_SHOP_PLUS_v1.7.js` dhe `demo/ILLYRIAN_SHOP_PLUS_v1.7.css`; lidhjet me këta skedarë janë shtuar në `demo/ILLYRIAN_DEMO_v1.7.html`. Nuk janë ndryshuar modulet e vjetra Shop, Plans, Connections apo Privacy/Map. Moduli i avancuar hapet nga Shop bazë me butonin `Kërkim i avancuar · Katalogë · Kërkoj…`.

**Funksione të ndërtuara dhe rrjedha demonstrative:**
- Katalog i zgjeruar me 12 listime **krejt fiktive**, i ndarë nga lista bazë e Shop; grupim i ofertave të të njëjtit shembull SKU `espresso-250g` nga 3 dyqane, krahasim i çmimeve dhe i inventarit demonstrues. SKU është një identifikues shembull, **nuk provohet** që produkte reale janë identike.
- Kërkim me fjalë kyçe; filtra kategori, qyteti, interval çmimi, vetëm produkte me stok, vit minimal/kilometra maksimalë për makina, sipërfaqe minimale për banesa me qira; renditje dhe pastrim filtrash.
- Katalog për çdo dyqan, me emrin, qytetin, numrin e listimeve dhe stokun ilustrues; pa reputacion apo identitet të verifikuar.
- Krijim dhe redaktim i listimeve vetjake me fusha të kategorisë dhe validim: produkte me inventar, makina me vit/km, banesa me m²/lloj/periudhë, shërbime. Ruajtja kryhet **vetëm në localStorage**.
- **IN9-01 — `Kërkoj…`**: blerësi krijon kërkesë për produkt/shërbim me kategori, qytet, buxhet dhe afat 7/14/30 ditë; një shitës ilustrues jep përgjigje, kërkesa mund të hiqet. **Nuk ka kontakt, përputhje automatike ose njoftim te shitës real**.
- Promovimet fiktive shënohen `PROMOVUAR · DEMO`; përdoruesi mund të raportojë një listim. Raporti shënohet `në shqyrtim` vetëm në simulim; **nuk ka moderator, vendim ose apel real**.
- Shembull me normë komisioni **5% thjesht ilustruese, jo të miratuar**; krijim porosie pa pagesë dhe kërkesë anulimi/kthimi, pa dërgesë, faturim, rezervim, refund apo provë dorëzimi real.
- Modaliteti përdor CSS Light/Dark, kontrolle tastiere `Tab/Shift+Tab/Escape`, `inert` të Shop bazë gjatë hapjes, rikthim të fokusit në mbyllje dhe escape HTML për të dhënat tekstuale.

**QA e verifikuar:** **35/35 prova të logjikës dhe gjendjes** mbi kodin e saktë GitHub në V8 me DOM dhe localStorage të simuluar: krahasim i 3 ofertave, filtra të kombinuara dhe çmime të pavlefshme, stok, makinat, sipërfaqja e qirasë, krijim/redaktim listimi, kërkesë blerësi, përgjigje shitësi, raportim, porosi e anulim demonstrues, fokus dhe rivendosje inert. JavaScript sintaksisht **PASS**. **Këto nuk janë teste vizuale në Chromium real, Playwright, E2E në Vercel ose prova fizike në Android/iOS.**

**Mbeten për t'u zgjeruar/verifikuar:**
- Fotografitë dhe media e produkteve, variante/madhësi, kategorizim i detajuar i dyqaneve dhe inventar i përbashkët me Shop bazë; aktualisht Shop Plus ka katalog demonstrues të pavarur.
- Në mënyrë profesionale, identiteti i listimeve të së njëjtës SKU, çmimet, stoku, kohët e qirasë dhe disponueshmëria e makinave **nuk janë verifikuar**.
- Logjika reale e komisionit, pagesave, ndarjes së të ardhurave, kthimeve, anulimeve, reklamave, moderimit dhe apelimeve kërkon miratim, politikë ligjore dhe backend.
- Regresion vizual mobil/landscape me të gjithë modulet aktive dhe kontroll i buxhetit të performancës për çdo kategori.
- Pa pagesa, rezervime, kërkesa të dërguara ose shpenzime reale. Asnjë tarifë 5% nuk është vendosur.

## Paketa 6 — Besimi dhe menaxhimi [BAZA E IMPLEMENTUAR NË DEMO; QA V8]
- IN9-06 sinjal besueshmërie vetëm me shpjegim, pa badge sigurie të pavërtetuar.
- Panel moderimi me raporte, arsye, apelime demonstrative dhe privatësi të simulimit.
- Panel pune për organizatorë, biznes, shitës dhe punëdhënës në nivel UX demonstrues.


### Zbatimi i Fazës 6 — 21 tetor 2026

**Skedarët e rinj:** `demo/ILLYRIAN_GOVERNANCE_v1.7.js`, `demo/ILLYRIAN_GOVERNANCE_v1.7.css`. HTML-ja `demo/ILLYRIAN_DEMO_v1.7.html` u përditësua të ngarkojë modulin e gjashtë, pa ndryshuar pesë modulet e mëparshme.

**IN9-06 — besueshmëri me shpjegim.** Tre shpjegime demonstrative: `Të dhëna të deklaruara`, `Rrjedhë demonstrative`, `Në pritje të shqyrtimit`. UI deklaron shprehimisht se asnjë shitës/biznes/përdorues nuk është verifikuar dhe nuk përdor emblemë `i verifikuar` pa prova. Këto etiketa janë status informatash, jo kontrolle identiteti.

**Moderimi dhe apelimi UX.** Paneli importon, vetëm për lexim, raportimet e `ILLYRIAN_SHOP_PLUS_v1.7.js` nga çelësi `illyrian_demo_v17_shop_plus`, bashkë me shembuj fiktivë. Përdoruesi mund të krijojë raport lokal me arsye; roli moderator **vetëm në UI** mund të kërkojë sqarim, të shënojë kufizim, të mbyllë një rast ose të heqë një kufizim, duke shkruar një arsye të detyrueshme. Përdoruesi mund të krijojë apelim dhe roli moderator demo ta pranojë/refuzojë me arsye. Një apelim i pranuar e shënon rastin përkatës `reinstated` vetëm në këtë panel. Ekziston histori e veprimeve **lokale dhe e ndryshueshme**; nuk është audit log sigurie, as moderim real. Veprimet nuk e fshijnë listimin e Shop dhe nuk njoftojnë askënd.

**Panele pune UX demo.** Roli biznes krijon draft oferte lokale; shitësi sheh numrin e listimeve të veta dhe të kërkesave lokale nga Shop Plus; punëdhënësi krijon draft punësimi, provon ndryshimin e statusit të një kandidati shembull; organizatori sheh numrin e aktiviteteve dhe kërkesave nga moduli `Plans`. Asnjë draft nuk publikohet, nuk shpërndahet apo u jep të tjerëve qasje.

**Përmirësime përdorshmërie.** Panel modal `role="dialog"`, `aria-modal`, fokus, `Tab/Shift+Tab/Escape`, `inert` për sfondin dhe rikthim i gjendjes pas mbylljes. Tekstet nga ruajtja lokale kalojnë në `escape HTML`. Kufij për numrin e raporteve, apelve, drafteve dhe gjatësinë e tekstit.

**Verifikimi:** 31/31 kontrolle të logjikës në V8 me DOM/localStorage të simuluar mbi kodin e saktë të GitHub-it, përfshirë rastin e raportuar nga Shop Plus, moderimin me shpjegim, apelimin, pranimin dhe rikthimin e statusit, historikun, panelet e punës, fshirjen e draftit dhe çaktivizimin/rikthimin e sfondit. Kontrolli i sintaksës JavaScript PASS. **Jo** provë reale Chromium/Playwright, **jo** test në telefon fizik, **jo** validim WCAG dhe **jo** verifikim i Preview-it të commit-it përfundimtar.

**Kufizime produkti:** rolet e administrimit nuk kanë autorizim nga serveri; vendimet nuk zbatojnë masa reale; raportet dhe apelimet nuk janë komunikim me një moderator të vërtetë; log-u mund të ndryshohet/fshihet nga përdoruesi i shfletuesit. Verifikimi real i bizneseve, siguria, raportimet ndërmjet llogarive, prova, SLA, apelimi i pavarur dhe mbrojtja e të dhënave kërkojnë backend dhe rregulla të dedikuara. Nuk ka pagesa, komisione apo shpenzime.

**Puna e hapur:** testim i përbashkët i të gjashtë moduleve në Chromium dhe ekran fizik; prova tekstesh të gjata, dialogëve me disa shtresa, temave Light/Dark, performancës dhe aksesueshmërisë; pastaj lista finale e ndryshimeve të v1.7 dhe specifikimi i produktit real. Shih Paketën 7.


## Paketa 7 — Përmirësimi vizual, cilësia dhe regresioni [E PLANIFIKUAR]
- Auditimi i të gjitha ekraneve: theme Auto/Light/Dark, prekje, tastierë, sjellje offline në demo.
- Fokus, ekran horizontal, performancë dhe aksesi i menusë; teste pa ndryshim të identitetit V-001–V-003.
- Testim Playwright në Chromium, më pas testim manual Android/iOS kur të jetë i mundur.
- Asnjë pretendim që UI demo = backend/produkt në dyqane.

## Paketa 8 — Miratimi dhe arkitektura për produktin real [E PLANIFIKUAR]
- Marrja e vendimit të përdoruesit për çfarë ruhet/hiqet/ndryshohet.
- PRD MVP me faza, modele të të dhënave, role dhe autorizime, politikë për Shop, plan kostoje, siguri, pagesa me ofrues të licencuar, taksa, kthime, mbrojtje blerësi/shitësi dhe pagesë komisioni.
- Test i tregut shqiptar me të dhëna reale; vetëm pas këtij hapi zhvillim backend dhe aplikacione native.


### Zbatimi i Fazës 3 — 21 tetor 2026

**Kod:** `demo/ILLYRIAN_CONNECTIONS_v1.7.js` — modul i izoluar, i lidhur me `demo/ILLYRIAN_DEMO_v1.7.html` dhe `demo/ILLYRIAN_PLANS_v1.7.js`. Nuk krijohen skeda të reja kryesore; përdoret hyrja `Lidhjet që krijohen në jetën reale` te Planet.

**Rrjedhat e implementuara:**

1. **IN9-02 — Dy vendet e mia:** dy qytete të ndryshme të zgjedhura manualisht, ruajtje lokale, listë ilustruese e aktiviteteve publike nga dy zonat; pa GPS dhe pa publikim të vendndodhjes.
2. **IN9-03 — Nga interesi te plani:** zgjedhje interesi, qyteti dhe intervali; skadim në 3 ose 7 ditë, heqje e zgjedhjes dhe sinjal vizual me numra fiktivë. Drafti hapet te organizatori vetëm pas klikimit dhe vetëm për një rast që kalon pragun fiktiv; nuk krijohet pjesëmarrje ose plan automatikisht.
3. **IN9-04 — Hera e parë:** shembuj me pritës, vend takimi dhe udhëzime; shënimi `jam për herë të parë` ruhet lokalisht dhe **nuk i dërgohet** organizatorit në këtë demo.
4. **IN9-05 — Organizo sërish:** aktivitetet e organizatorit lokal përdoren si pikënisje e një drafti, pa ftuar pjesëmarrësit dhe pa publikuar automatikisht.
5. **IN9-07 — Bëjmë diçka bashkë:** formate aktivitetesh për praktikë gjuhësh, punëtori portofoli dhe sport; mund të përgatisin një draft manual.
6. **IL-029 (përmirësim demonstrativ):** interes/disponueshmëri që mund të hiqet e skadon, i ruajtur në pajisje. Nuk ka rekomandime reale apo inferim të përdoruesit.

**Integrim me Fazën 2:** ngjarja e brendshme `illyrian:plans:draft` plotëson titullin/kategorinë/qytetin/kushtet te formulari ekzistues. **Data dhe vendi mbeten bosh dhe të detyrueshme**, kështu që përdoruesi duhet t'i konfirmojë; krijimi kryhet vetëm me butonin ekzistues dhe validimin e organizatorit. Lista e qyteteve u harmonizua midis dy moduleve.

**Prova të ekzekutuara:** 
- 18/18 kontrolle të logjikës së rrjedhave të Fazës 3 në V8 me DOM të simuluar: hapja, navigimi, qytetet, refuzimi i dy qyteteve identike, ruajtja e interesit me skadim, pragu demonstrues, drafti, shënimi privat, përmbajtja e aktiviteteve dhe fshirja e interesit.
- 14/14 kontrolle të integrimit të draftit me modulin e organizatorit, me DOM dhe ruajtje të simuluara: prefilling, detyrimi i datës/vendit, moskrijim në formular të pavlefshëm, krijim vetëm pas plotësimit të saktë, izolim nga Shop.
- JavaScript i të dy moduleve dhe HTML-së u kontrollua për sintaksë.
- **Kufizimi:** kontrollet 32/32 janë prova të gjendjes në V8 me DOM të imituar, **jo** prova reale Chromium/Playwright, jo test me telefon fizik dhe jo test i plotë i Preview-it. Funksionet janë demonstrim lokal, pa persona/koordinim/server të vërtetë.

**Statusi i produktit real:** pesë IN9 janë propozime të regjistruara në analizën strategjike. Miratimi i përdoruesit për t'i shfaqur në **demo** nuk është miratim i politikave të produktit real, kushteve për të miturit, vendndodhjes, modelit të përputhjes ose pagesave. Asnjë profil real, preferencë private, njoftim, pjesëmarrje ose pagesë nuk shkëmbehet.

**Faza pasuese:** Paketa 4 — profile private, komunitete private, hartë e kontrolluar e aktiviteteve, gjendjet e planit dhe ekran horizontal, pastaj regresion i përbashkët.


### Implementimi i Fazës 4 — 21 tetor 2026

**Kod i ri:**
- `demo/ILLYRIAN_PRIVACY_MAP_v1.7.js`: panel i izoluar për profile, komunitete, hartë skematike dhe gjendje planesh;
- `demo/ILLYRIAN_PRIVACY_MAP_v1.7.css`: pamja Light/Dark dhe rregull për telefon horizontal (761–1100 px, lartësi ≤520 px, orientation landscape).
- `demo/ILLYRIAN_DEMO_v1.7.html`: lidhja me CSS dhe JS të rinj pa hequr lidhjet e Shop, Plans dhe Connections.

**Rrjedhat e realizuara:**

1. **Profile private/publike:** personazhe demonstrative; kërkesë ndjekjeje, pritje, pranim/refuzim nga pronari demo, tërheqje, bllokim/zhbllokim. Përshkrimi i personazhit privat nuk shfaqet para pranimit.
2. **Komunitete private/publike:** anëtarësim i menjëhershëm për grup publik, kërkesë/pranim/refuzim për grup privat, largim dhe heqje e aksesit lokal. Përmbajtja e grupit privat nuk shfaqet para pranimit. Butoni `Si moderator demo` **nuk është rol i siguruar nga serveri**.
3. **Hartë skematike, jo gjeografike:** pamje orientuese me pika të vendosura ilustrativisht, kërkim sipas fjalës, qytetit dhe tipit aktivitet/biznes; përfshin vende fiktive shembull dhe aktivitete publike të krijuara nga organizatori, si dhe listime demonstrative nga Shop. Nuk përdoret GPS apo koordinatë reale.
4. **Gjendje aktivitetesh:** i hapur, plot, anuluar, skaduar, privat, i padisponueshëm. Shfaqen shpjegime për aksesin dhe kërkesat e reja; aktiviteti privat nuk ekspozon titullin/vendin në këtë panel, edhe nëse ekziston në ruajtjen lokale. Nuk krijohet regjistrim vetëm duke hapur gjendjen.
5. **Peizazh telefoni:** CSS vendos aplikacionin në ekran të plotë për telefonat e gjerë e të shkurtër në orientim horizontal, pa hyrë te prezantimi desktop me telefon në kornizë.
6. **Tastierë:** paneli ka rol dialog, fokus fillestar, qarkullim me Tab/Shift+Tab, mbyllje me Escape, `inert` të sfondit dhe rikthim të fokusit pas mbylljes.

**Verifikimi i kodit në GitHub:** 31/31 kontrolle të gjendjes kaluan në V8 me DOM/localStorage të simuluara: privatësia para/pas miratimit, revokimi i aksesit, kërkesa/refuzimi i grupit, ruajtja e gjendjes, filtrat e hartës, gjendjet e planeve, fokus/inert dhe të dhëna të pasigurta të futura si tekst të escapuar. JavaScript sintaksisht PASS. **Kjo NUK është test real Chromium, vizual, aksesueshmërie WCAG apo provë e publikuar në Vercel.** Kontrolli CSS për orientimin horizontal është bërë statikisht; kërkohet test i renderimit.

**Kufij të detyrueshëm të demos:** profile dhe grupe me të dhëna të sajuara; përdoruesi demonstrues mund të ndërrojë rol në UI dhe kjo nuk përfaqëson autorizim real. Asnjë nga kontrollet e privatësisë nuk është mbrojtje serveri. Pikat e hartës janë skematike, jo gjeografike. Mungojnë API të vërteta, llogari reale, GPS, autorizime ndërmjet llogarive, moderim prodhimi, njoftime push dhe databazë.

**Kufiri i Vercel-it:** në Fazën 3, Vercel ktheu HTTP 402 `api-deployments-free-per-day` për ndërtim të ri. Mos paguaj dhe mos shpall Fazën 4 READY në Preview pa verifikuar commit-in e fundit. Provat e Fazës 4 janë të kodit në GitHub, jo të publikimit.

**Faza pasuese:** Paketa 5, Shop i zgjeruar dhe ekonomia; më parë duhen regresion i përbashkët dhe kontrollet e përmasave reale kur Preview të jetë i disponueshëm.


## Rregulli i vazhdimësisë

Përdoruesi mund të shkruajë **“vazhdo”** për të kaluar te paketa pasuese. Shënojmë qartë `E IMPLEMENTUAR`, `E TESTUAR`, `PËR DEMO`, `PROPOZUAR` dhe `PËR PRODUKTIN REAL`. Nuk shpallim përqindje absolute të projektit pa kritere dhe prova të plota. Nuk bëhet merge në `main` ose publikim në Production pa vendim të veçantë.


## Faza 7 — Audit integrimi, cikli 1 (22 tetor 2026)

**Status:** NË PROCES; JO e certifikuar në Chromium E2E/telefon fizik.

- Gjendja bazë para korrigjimit: branch `demo/v1.7-illyrian-shop` në `26508fb6d2e65bdac508c87c9199de11127df12a`; `main` në `9f91b5c083b4482a70a2149483cc799360e6102c` (v1.5).
- Vercel Preview alias i verifikuar: deployment `dpl_5VNzzVoDn1QJkAWYboPe8Nyt6UwE`, READY, por commit `0d0908beddb7f6b18ea28785bb8c87e909a464b0`, pra jo build i integrimit final. GitHub commit status për `26508fb6...` raportonte `failure` me lidhje `upgradeToPro=build-rate-limit`. Pa deploy manual, pa ndryshim billing/Production.
- Audit statik: të gjashtë skedarët JS referohen nga HTML dhe kalojnë `new Function()` në V8; CSS-të e referuara janë të pranishme. `ILLYRIAN_PLANS_v1.7.js` përmban stile të integruara (nuk ka varësi HTML nga një CSS Plans i veçantë).
- **F7-001, defekt i riprodhuar në V8 DOM të simuluar:** Escape me Shop bazë dhe Shop Plus njëkohësisht hapur mbyllte Shop bazë i pari, ndërsa Shop Plus mbetej aktiv; pas mbylljes së dytë ekrani mund të mbetej `inert`. Shkaku: listener-i `keydown` i Shop bazë kapte Escape me `stopImmediatePropagation` para listener-it të Shop Plus.
- **Korrigjim minimal** në `demo/ILLYRIAN_SHOP_v1.7.js`, commit `2fe7cdacb8577e96d63f9aadc6ba210fbe78a799`: Shop bazë ia delegon Escape Shop Plus kur `#isp-root` ekziston. Nuk janë ndryshuar modulet e tjera, logot, `main` ose Production.
- **Verifikim:** testi i izoluar i të dy JS-ve në DOM të simuluar kaloi rrjedhën Escape (Plus mbyllet i pari, pastaj Shop); kodi i përditësuar u rilexua dhe sintaksa PASS. **NUK ka ende prova Playwright/Chromium në skedarin final**.
- **Rreziqe të hapura:** testim integrimi në browser real të të gjitha moduleve, ekranet 320–430px/landscape, fokus/Tab/Escape, modalitetet e ndërthurura, CSS z-index, MutationObserver, storage/refresh, XSS negative, foto, performancë dhe Preview i sinkronizuar.
- **HumHub:** analiza e licencës AGPL-3.0-only u përfundua si kërkim; asnjë kod HumHub nuk u importua. Idetë e arkitekturës janë propozime për Fazën 8, jo vendime të miratuara.

## Faza 7 — Cikli 2: Modalet Plans/Connections dhe integrimi (22 tetor 2026)

**Status:** QA e pjesshme; korrigjimet e mëposhtme janë në branch-in Preview. Nuk është certifikuar E2E në browser, ekran fizik apo WCAG.

1. **Vercel:** më 22 tetor 2026, alias-i i Preview ishte READY për commit-in `b389fdf23e7e517c75a9aa288666c7d26a047237` dhe GitHub Vercel status = success. Ky është kontroll metadata për deployment, jo test UI. Statusi duhet rilexuar pas commit-eve të reja.
2. **Pengesa e E2E:** Chromium v144 u nis lokalisht me Playwright, por `page.goto('https://illyrian-demo-git-demo-v17-illyrian-shop-un24.vercel.app/ILLYRIAN_DEMO_v1.7.html')` u bllokua me `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Edhe leximi publik nga mjeti web nuk arriti të hynte te URL-ja. Nuk duhet interpretuar si dështim i aplikacionit.
3. **Gjendja e inicializimit:** gjashtë skriptet JS u ekzekutuan në një DOM minimal të simuluar dhe regjistruan ndërveprimet/observer-at e tyre; pjesë të sinkronizimit DOM kërkojnë simulim më të plotë. Nuk është provë reale rendering.
4. **Connections → Plans:** testim V8 i kodit aktual të dy moduleve: inicializim, hapje Connections, `Bëjmë diçka bashkë`, dërgim i `illyrian:plans:draft`, hapje e Plans me titull të paraplotësuar dhe pa publikim automatik. PASS, pa gabime në simulimin e izoluar.
5. **F7-002 — sfondi i modalëve nuk izolohej:** si `ILLYRIAN_PLANS_v1.7.js`, ashtu edhe `ILLYRIAN_CONNECTIONS_v1.7.js` shfaqnin dialog `aria-modal=true`, por nuk aktivizonin `inert` te pjesët pas tij. U verifikua në V8 se `screen.inert` mbetej false gjatë hapjes. U shtua `inertSnapshot` për `#screen`, `#navbar`, `.head`, `.statusbar`, `.homebar`, `.island`, me rivendosje të gjendjes origjinale gjatë mbylljes.
6. **Commit-et e F7-002:** Plans `c03edf19edd953d5caf83f92b531688dde044f4b`; Connections `394db4f96992958c70c54e966ddc11f32ffc8750`. Zbatimi ndryshon vetëm dy skedarët e branch-it v1.7, jo `main`, v1.6 apo Production.
7. **Ritestimi mbi commit-in e ruajtur `394db4...`:** 12/12 kontrolle V8 në DOM të simuluar: ruajtja e `inert` ekzistues te nav, izolimi i sfondit, draft Connections→Plans, mbyllja e Plans dhe restaurimi i sfondit. 0 gabime ekzekutimi në atë skenar. Kontrolli i sintaksës JavaScript: PASS.
8. **Mbeten:** Chromium/Playwright real mbi HTML-në e përbashkët v1.7 (320×568, 360×780, 390×844, 430×932, 844×390, 932×430, desktop), vizual Light/Dark/Auto, fokus/Tab/Escape, modalë të ndërthurur, `MutationObserver`, ruajtje/reload, të dhëna armiqësore, media dhe performancë. F7-001 dhe F7-002 duhen provuar edhe në Chrome/Brave real. Faza 8 nuk ka nisur.

**Interpretimi i progresit:** 6 nga 8 paketat e demos kanë bazën në kod; Paketa 7 është në proces dhe Paketa 8 e hapur. 75% është vetëm numërim paketash, jo përqindje e cilësisë, prodhimit apo aplikacionit profesional.


## Faza 7 — Cikli 3: QA Lab, raportimet dhe Privacy (22 tetor 2026)

**Status: NË PROCES, jo i certifikuar E2E.** Ky cikël krijoi instrumentin e testimit në shfletues dhe konfirmoi dy rrjedha shtesë logjike, pa prekur `main` ose Vercel Production.

### Instrumenti i testimit real në browser

- Shtuar `demo/ILLYRIAN_QA_v1.7.html`, një faqe e veçantë **same-origin** me `iframe` që ngarkon `ILLYRIAN_DEMO_v1.7.html`. Nuk ndryshon HTML-në ekzistuese të demos dhe nuk kërkon llogari, backend apo shërbime me pagesë.
- QA Lab ka 7 përmasa: 320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800; mundësi testimi të njërës ose të gjitha përmasave.
- Kontrollon referencat e 6 moduleve JS, inicializimin e paneleve, rrjedhën Shop→Shop Plus→Escape→Escape, hapje/mbyllje Plans/Connections/Privacy/Governance, transferimin e draftit Connections→Plans, `inert` të ekranit dhe overflow horizontal; raporton PASS/FAIL, ruan testet e kaluara edhe kur hapi pasues ngec, dhe kopjon raportin.
- QA Lab u publikua në Preview pas commit-eve `ee9a132eda7d27b6f7b69c9d7cc2e34244f1aa30`, `67a46e282a8d948079b942d2407c5f18c49aa694` dhe `e9dd50ae9b62dbc039f2d832ba7e05aea1e8c401`.
- **Dëshmia për QA Lab:** burimi u rilexua nga commit-et e GitHub; skripti inline u kontrollua sintaksisht PASS; Vercel Preview u verifikua READY dhe në commit-in përkatës pas publikimit. **Ende nuk kemi raport PASS/FAIL nga ekzekutimi real i QA Lab në browser të përdoruesit** sepse mjedisi i kësaj analize nuk hyn dot në Preview (DNS/administrative network restriction). Asnjë rezultat i simuluar nuk duhet raportuar si E2E.
- URL e QA Lab: `https://illyrian-demo-git-demo-v17-illyrian-shop-un24.vercel.app/ILLYRIAN_QA_v1.7.html`.

### F7-003 — Privacy në hapje të dyfishtë

- **Riprodhim:** dy thirrje `open()` të `ILLYRIAN_PRIVACY_MAP_v1.7.js` para mbylljes mbishkruanin `inertSnapshot` kur ekrani ishte tashmë `inert=true`; më pas `close()` e linte ekranin dhe navigimin `inert=true` (bllokim i mundshëm).
- **Korrigjim minimal:** `open()` del menjëherë nëse `state.open===true`. Commit `17059220eb38154241f14e9c1a11586fccf7c5ad`. Në simulimin V8, hapja e dyfishtë dhe mbyllja rikthejnë `screen.inert=false`, kurse kodi i mëparshëm e linte `true`.
- QA Lab tani kontrollon rikthimin e ekranit pas një tentative të dytë hapjeje Privacy. Ky kontroll duhet provuar edhe në një shfletues real.

### Regresion shtesë: Shop Plus → Governance

- Kodi origjinal `ILLYRIAN_GOVERNANCE_v1.7.js` u ekzekutua në V8 me DOM/localStorage të simuluar dhe raportim të mëparshëm `illyrian_demo_v17_shop_plus.flags`.
- **8/8 kontrolle PASS, zero gabime ekzekutimi** në skenarin e izoluar: hapja e Governance, izolimi `inert`, importimi i raportimit, escape i `<img onerror>` dhe `<script>` të futura si tekst, hapja e shqyrtimit si moderator demo, ruajtja `restricted` dhe `audit` në localStorage.
- Ndërrimi i rolit në UI mbetet SIMULIM: nuk përfaqëson RBAC serveri, autorizim ose vendim real ndaj përdoruesve/produkteve.

### Çfarë mbetet

- Marrja e raportit të QA Lab të ekzekutuar në Chromium/telefon; verifikim vizual i temave Light/Dark/Auto, swipe/story/reels, modal focus/Tab/Escape, performancë, storage/reload, të dhëna armiqësore dhe pajisje fizike.
- Mos shpall Paketën 7 PASS, 8/8 paketa të përfunduara ose produktin real të gatshëm për publikim pa provat përkatëse.

## Faza 7 — Cikli 4: Raporti i parë real QA dhe korrigjimi i navigimit (22 tetor 2026)

**Burimi i provës:** Përdoruesi ekzekutoi laboratorin `ILLYRIAN_QA_v1.7.html` në shfletues dhe dërgoi raportin `ILLYRIAN v1.7 QA — 2026-10-22T11:00:29.040Z`. Kjo provë është nga shfletuesi i përdoruesit, jo nga simulimi V8 i asistentit.

**Përmasa të raportuara:** 320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800.

**Rezultatet e raportuara (7 × 8):** gjithsej 56 kontrolle PASS — struktura `#phone/#screen/#navbar`; gjashtë referencat JS; tre panelet bazë të inicializuara; hapja e Shop; `inert` i sfondit; hapja e Shop Plus; Escape i parë mbyll vetëm Shop Plus; Escape i dytë mbyll Shop dhe rikthen sfondin. Këto prova janë për të shtatë madhësitë, përfshirë dy landscape dhe desktop.

**7 ndërprerje të raportuara:** secila menjëherë pas testit të dytë Escape me mesazhin `Nuk u gjet navigimi: events`. Testet për Plans, Connections, Privacy, Governance dhe overflow horizontal **NUK u ekzekutuan** në këtë raport; mos i numëro si dështime të produktit.

**F7-004 — Bug i laboratorit QA, jo i konfirmuar në aplikacion:** funksioni `nav(d,'events')` kërkonte `#navbar [data-act="tab"][data-val="events"]` nga navigimi i hershëm; dizajni i miratuar v1.2+ ndryshoi bottom nav në Home, Explore, Reels, Messages, Profile dhe vendosi Events në `.head [data-act="tab"][data-val="events"]`. Kjo u verifikua drejtpërdrejt në burimin e demos v1.7.

**Korrigjimi F7-004:** u ndryshua **vetëm** `demo/ILLYRIAN_QA_v1.7.html`, jo demo kryesore: për Events përdor butonin e header-it; për Home/Explore përdor tab-et e poshtme; verifikon që faqja Events shfaqet dhe jep diagnostikë të nav/header kur nuk gjendet një buton. Korrigjimi u provua në memorie kundër një DOM-i të kontrolluar me navigimin e miratuar (testi Events/Home PASS), JavaScript PASS, rilexim i commit-it GitHub PASS. Commit `ceb556de7afb54e080829bcdfdc81713a386d2cb`; Vercel Preview READY në këtë commit, status Vercel success.

**Status i rëndësishëm:** 56 PASS të konfirmuara nga përdoruesi në QA-në e parë; QA e korrigjuar kërkon **ekzekutim të ri real** për të testuar rrjedhat e mbetura. As certifikim i Fazës 7, as merge në `main`, as Production.

**QA Lab:** https://illyrian-demo-git-demo-v17-illyrian-shop-un24.vercel.app/ILLYRIAN_QA_v1.7.html

## Faza 7 — Cikli 5: Raporti i dytë real QA dhe F7-005 (22 tetor 2026)

**Prova e përdoruesit:** Raporti real `ILLYRIAN v1.7 QA — 2026-10-22T11:28:48.041Z` për shtatë viewport-e: 320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800.

**Rezultati:** 18 kontrolle/viewport × 7 = **126 gjithsej; 119 PASS dhe 7 FAIL** (94.44% e kontrolleve të listuara). PASS në të shtatë viewport-et për strukturën, 6 referencat JS, inicializimin e paneleve, Shop/Shop Plus, Escape, Plans modal/inert, Connections modal/inert, rikthimin e sfondit, Privacy me hapje të dyfishtë, Governance dhe **overflow horizontal të dokumentit** (scrollWidth=clientWidth sipas raportit). Këto nuk përfaqësojnë testim të plotë UX/WCAG ose performancë.

**Dështimi i vetëm i përsëritur:** `Connections transferon draftin te Plans`, një FAIL për secilin nga 7 viewport-et. Testi pasues, `Rikthim korrekt pas draftit`, ishte PASS në të shtatë viewport-et. Për pasojë nuk lejohet të nxirret përfundimi që kalimi i draftit në aplikacion real nuk funksionon, pa diagnostikim shtesë.

**F7-005 — defekt i provuar në asercionin e QA, jo defekt i provuar në aplikacion:** kontrolluesi kërkonte titullin e draftit duke përdorur `#ilp-root.textContent.includes('Praktikë gjuhësh dhe njohje')`. Por Plans e shfaq titullin në `<input name="title" value="...">`, dhe vlera e një `input`-i lexohet përmes `element.value`, jo `textContent`. `Connections` emeton ngjarjen `illyrian:plans:draft`; `Plans` e merr dhe krijon formularin me vlerën e titullit. Ky kontroll gabimisht FAIL edhe kur forma është paraplotësuar.

**Korrigjimi në QA Lab:** vetëm `demo/ILLYRIAN_QA_v1.7.html`; tani verifikon katër kushte: `ilc-root.hidden=true`, `ilp-root.hidden=false`, `#ilp-form input[name=title].value === 'Praktikë gjuhësh dhe njohje'` dhe fusha `place` është e detyrueshme. Raporti tani jep detaje për gjendjen e secilit kusht, në rast FAIL. Nuk janë ndryshuar modulet Connections/Plans, kodi i demos, `main` ose Production.

**Verifikim para ruajtjes:** sintaksa e skriptit QA PASS; 6/6 prova sintetike të kushtit (sukses, vlerë bosh, titull i gabuar, mungesë e vendit të kërkuar, Plans mbyllur, Connections hapur) PASS. Kodi i korrigjuar u ruajt/rilexua në GitHub, commit `869588f150f57954db15def05f8eec7aad7b792d`.

**Mbetet e nevojshme:** një ekzekutim i ri real i QA Lab për të verifikuar që 7 rastet FAIL nuk ndodhin më dhe që transferimi ekziston në DOM-in e vërtetë. Nuk e certifikojmë Fazën 7 vetëm nga provat sintetike.

## Faza 7 — Cikli 6: Raporti 126/126 dhe hyrja te QA e avancuar (22 tetor 2026)

**Dëshmi nga shfletuesi i përdoruesit, jo simulim:** raporti i tretë `ILLYRIAN v1.7 QA — 2026-10-22T11:38:41.977Z` jep **126 PASS / 126 kontrolle, 0 FAIL**, në të 7 përmasat: `320×568`, `360×780`, `390×844`, `430×932`, `844×390`, `932×430`, `1280×800` (18 skenarë × 7). Në çdo përmasë u konfirmuan strukturat, referencat e 6 moduleve, inicializimi i 3 paneleve, Shop/Shop Plus, Escape i saktë, sfondi inert, hapja/mbyllja e Plans, Connections, Privacy, Governance dhe pa overflow horizontal të dokumentit. Rrjedha Connections→Plans PASS, me diagnozë `Connections mbyllur=true; Plans hapur=true; titulli="Praktikë gjuhësh dhe njohje"; vendi kërkon konfirmim=true` në çdo përmasë.

**Status i saktë:** F7-005 **u mbyll për asercionin bazë dhe skenarin e raportuar**; regresioni funksional **i përcaktuar nga QA Lab v1.7** është PASS. Kjo nuk është certifikatë WCAG, krahasim vizual i të gjitha ekraneve, test në telefon fizik, test sigurie serveri, test performance ose miratim për Production. Raporti është për demo-n lokale me të dhëna fiktive.

**Hapi i radhës në Fazën 7:** zgjerimi i QA Lab me një suitë të veçantë për Light/Dark/Auto, fokusin në modal dhe Tab/Shift+Tab/Escape (synthetic key events të dalluara nga testet me tastierë reale), ruajtjen dhe rikthimin e preferencës së temas pa humbur të dhënat e mëparshme, XSS negative pa publikim, dhe matje informative të performancës; plus audit manual për pamjen mobile/landscape, media dhe WCAG. Testi bazë 126/126 duhet të mbetet i pandryshuar. Asnjë shkallë PASS e suitës së avancuar nuk pretendohet përpara ekzekutimit në shfletues.
