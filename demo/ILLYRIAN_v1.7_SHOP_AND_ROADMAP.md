# ILLYRIAN Demo v1.7 — Faza e zgjerimit dhe ILLYRIAN Shop

**Data e nisjes:** 21 tetor 2026  
**Burimi:** kërkesa eksplicite e përdoruesit për t'i ndërtuar të gjitha funksionet e mbetura të demos, plus ILLYRIAN Shop (produkte, dyqane të vogla, makina, banesa me qira dhe kërkim ndër-dyqanesh), me vazhdim fazë pas faze.  
**Status i përditësuar më 22 tetor 2026:** Paketat 1–6 janë implementuar si DEMO; Paketa 7 ka kaluar kriterin funksional automatik në Chromium (32/32 skenarë Playwright, ku 2 suita përmbajnë 126/126 + 147/147 kontrolle QA). Janë prodhuar 42 pamje për evidencë vizuale, por kontrolli fizik/manual në telefon dhe miratimi i dizajnit mbeten HAPUR. Për Paketën 8 ekziston blueprint arkitekturor v0.1, jo backend apo produkt real i implementuar. Historiku i fazave më poshtë mbetet i pandryshuar.  
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

## Faza 7 — Cikli 7: QA e avancuar, kod i testit (22 tetor 2026)

**Status:** Laboratori i avancuar është **IMPLEMENTUAR në kod**, por **ASNJË rezultat PASS/FAIL i suitës së re nuk është raportuar ende nga shfletuesi**. Rezultati historik 126/126 i regresionit bazë mbetet provë e veçantë; nuk duhet të numërohet si test i avancuar.

- Në skedarin e vetëm `demo/ILLYRIAN_QA_v1.7.html` u shtuan dy kontrolle të ndara: `QA e avancuar — kjo përmasë` dhe `QA e avancuar — 7 përmasat`. Butonat dhe lista e 18 kontrolleve të regresionit bazë ruhen; ndryshimi i përmbledhjes bën që rreshtat INFO të mos numërohen si kontrolle PASS/FAIL.
- **Tastierë/fokus:** hapja e Plans nga Eventet, fokus brenda dialogut, Tab/Shift+Tab në kufijtë e listës së butonave/formularëve, Escape, rivendosja e fokusit dhe `inert`. `KeyboardEvent` është **sintetik** — nuk provon sjelljen e një tastiere reale ose WCAG.
- **Light/Dark/Auto:** navigon realisht te Profile → Cilësimet, ndryshon `input[name=theme]`, kontrollon `#phone.dark` kundrejt modalitetit dhe preferencës së sistemit; kontrollon ruajtjen te `illyrian_demo_v09_state` dhe gjendjen pas reload. Në `finally` rikthen vlerën bruto origjinale të vetëm kësaj çelësi (ose heq çelësin nëse nuk ekzistonte), duke e rilexuar `localStorage` nga iframe aktiv pas navigimit. Nuk kërkohet përdorues të pastrojë të dhënat.
- **Draft pa publikim dhe kontroll negativ HTML:** ngjarja `illyrian:plans:draft` përdor si titull `<img data-illyrian-qa-probe="text-only">` pa handler të ekzekutueshëm; testi kërkon që të jetë vlerë teksti në `input`, që të mos krijojë element DOM nga titulli, të mos shkruajë ndryshime te `illyrian_demo_v17_plans`, dhe të mbyllet pa bllokuar sfondin. Kjo provon vetëm rrugën e testuar të draftit, jo mbrojtje gjithëpërfshirëse XSS.
- **JavaScript runtime dhe ngarkimi:** monitoron `error`/`unhandledrejection` vetëm gjatë skenarëve të provës; `performance.getEntriesByType('navigation')` dhe gjerësitë e brendshme shfaqen si INFO, pa pragje të pambështetura performancë.
- **Siguria e suitës:** nuk krijon postime, aktivitete apo porosi; nuk thërret reset; nuk përdor `localStorage.clear()`; testet e avancuara janë të ndara nga baziku dhe raportet mund të kopjohen.
- **Verifikimi i implementimit:** u kontrollua sintaksa e bllokut të vetëm JavaScript (`new Function`, PASS), integriteti i HTML së përditësuar dhe rileximi i blob-it nga GitHub. Commit-et: `123243f52344068d049f759db4e5de732bf8a597` (suite e re) dhe `8a9b9ab34cf2f99e99efbab9c9befd25816c1c4e` (rregullimi për të mos përdorur `Storage` të vjetër pas reload).
- **Mbetet i hapur për Fazën 7:** prova reale e suitës së avancuar në Chrome të përdoruesit, rezultatet e të shtatë përmasave, kontrolli manual vizual për Light/Dark/Auto në telefona, prekje, lexues ekrani/WCAG, media, performancë reale e stabilitet. Mos shpall 100% përfundim pa këto prova. Asnjë ndryshim në demo kryesore, `main` ose Vercel Production.

## Faza 7 — Cikli 8: Raporti i avancuar dhe F7-006 (22 tetor 2026)

**Raporti real i përdoruesit:** `ILLYRIAN v1.7 QA — 2026-10-22T12:56:31.508Z`. 7 përmasa (320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800). **91 kontrolle PASS, 7 FAIL** (13 PASS + 1 FAIL për përmasë). Rreshtat INFO nuk janë teste PASS/FAIL.

**PASS të raportuara në secilën përmasë:** fokusi brenda Plans, kufizimi i Tab/Shift+Tab sintetik, Escape sintetik, rikthimi i fokusit, riaktivizimi i sfondit `inert`, mungesa e gabimeve JS në skenarin e fokusit, rivendosja e saktë e vlerës fillestare `localStorage`, draft HTML benign që mbetet si vlerë e fushës `input` dhe nuk krijon DOM të injektuar, draft i papublikuar/pa ruajtje automatike, mbyllja pa bllokim, dhe mungesa e gabimeve JS në skenarin e draftit.

**7 FAIL me të njëjtin shkak:** `Light / Dark / Auto + storage: ekzekutimi u ndërpre | Nuk u gjet preferenca e temës: light`. Këto 7 dështime janë të llojit **QA navigation error**: laboratori hapte `Profili → Cilësimet` dhe kërkonte direkt `#layer input[name=theme][value=light]`; por UI aktual v0.6/v1.7 përmban rrugën e ndërmjetme `Cilësimet → Pamja dhe ngjyrat`, e ndërtuar nga `v6SettingsHome()` dhe `v6SubSettings('theme')`. Gjendja e temas `light/dark/auto` **ende nuk është testuar në raport**, prandaj nuk mund të quhet PASS ose dështim funksional.

**F7-006 korrigjim i testit:** vetëm `demo/ILLYRIAN_QA_v1.7.html`; pas hapjes së Settings testohet butoni `#layer [data-act="v6-settings-section"][data-val="theme"]` përpara kërkimit të radio-buttons. U verifikua rruga nga burimi real i demos, sintaksa e një skripti JS (PASS) dhe u ruajt numri identik i 18 kontrolleve të regresionit bazë. Commit `6cd13f9093f0f104aad76dc887cfa54349e11267`, blob-i i kodit të ri i rilexuar i barabartë me burimin e dërguar. Asnjë ndryshim te skedarët e produktit.

**Metrikat informative të Navigation Timing në raportin e përdoruesit:** 320×568=377ms, 360×780=549ms, 390×844=426ms, 430×932=442ms, 844×390=440ms, 932×430=512ms, 1280×800=494ms. `transferSize=374633 B` në të gjitha rreshtat (mund të jetë cache); ato nuk janë një benchmark i certifikuar performance. Gjerësitë e brendshme të `#screen/#phone` u raportuan të barabarta në të gjitha përmasat; në desktop `#phone` është 400px si layout i demos, jo gjerësi e plotë desktop.

**Mbetet:** riekzekutimi real i suitës së avancuar për Light/Dark/Auto + persistence pas korrigjimit, plus auditim vizual manual dhe verifikim real i fokusit me tastierë fizike, media dhe përvoja në pajisje. Regresioni bazë 126/126 PASS mbetet i pandryshuar. `main` dhe Production nuk preken.

## Faza 7 — Cikli 9: QA e avancuar 21/21 PASS në 390×844 (22 tetor 2026)

**Raporti i katërt real nga shfletuesi i përdoruesit:** `ILLYRIAN v1.7 QA — 2026-10-22T14:23:23.694Z`. U testua **vetëm përmasa 390×844**, pas korrigjimit të rrugës `Cilësimet → Pamja dhe ngjyrat` (F7-006). **21 PASS / 21 kontrolle të ekzekutuara; 0 FAIL.** Dy rreshtat e metrikave janë INFO dhe nuk përfshihen në numrin e kontrolleve.

- **Fokus / tastierë sintetike, 7/7:** hapja e panelit Plans me fokus brenda, Tab dhe Shift+Tab sintetik në kufijtë e fokusit, Escape sintetik, rikthimi i fokusit te hapësi dhe rikthimi i sfondit pas mbylljes, pa gabime JS në skenar.
- **Light / Dark / Auto dhe persistence, 9/9:** Light `dark=false` dhe vlera `light` u ruajt; Dark `dark=true` dhe `dark` u ruajt; Auto `dark=true` për pajisjen që preferonte Dark dhe `auto` u ruajt; Auto mbeti pas reload, vlera fillestare e preferencës u rivendos në mënyrë identike, pa gabime JS. Kjo mbyll F7-006 **vetëm për këtë viewport dhe konfigurim sistemi**, jo për gjithë pajisjet.
- **Draft HTML benign, 5/5:** vargu `<img data-illyrian-qa-probe="text-only">` mbeti vlerë teksti në `input`, nuk krijoi element DOM, nuk u publikua apo ruajt automatikisht, paneli u mbyll pa bllokuar sfondin dhe nuk u raportuan gabime JS në skenar. Kjo nuk certifikon rezistencë të përgjithshme ndaj XSS.
- **Metrika vetëm INFO:** Navigation Timing `duration=493 ms`, `DOMContentLoaded=492 ms`, `transferSize=374633 B`; `#screen` dhe `#phone` `scrollWidth/clientWidth=388/388 px`. Cache dhe mjedisi i shfletuesit ndikojnë; ky rezultat nuk provon objektiv performance apo mungesë overflow në të gjitha nën-panelet.
- **Gjendja:** regresioni bazë mbetet 126/126 PASS në shtatë përmasa (raporti i mëparshëm); regresioni **i avancuar tani 21/21 PASS vetëm në 390×844**. Hapi pasues është prova e suite-s së avancuar në të shtatë viewport-et (nëse janë të gjitha PASS pritet 147 kontrolle, vetëm nëse numri mbetet 21 secila), pastaj audit vizual manual, tastierë fizike/aksesueshmëri dhe stabilitet/performancë me kriteret e tyre. Faza 7 vazhdon; Faza 8 nuk fillon automatikisht.


## Faza 7 — Cikli 10: Regresioni i avancuar 147/147 PASS (22 tetor 2026)

**Burimi i provës:** raporti i plotë i dërguar nga përdoruesi si `Tekst i ngjitur.txt`, titull `ILLYRIAN v1.7 QA — 2026-10-22T14:31:14.006Z`. U lexuan 169 rreshta dhe u numëruan automatikisht **147 PASS, 0 FAIL, 14 INFO me përmasë**, plus 7 tituj seksionesh INFO (një për përmasë). Secili nga 7 viewport-et përmban 21 kontrolle PASS:
- 320×568 — 21/21 PASS; duration 441ms.
- 360×780 — 21/21 PASS; duration 547ms.
- 390×844 — 21/21 PASS; duration 442ms.
- 430×932 — 21/21 PASS; duration 425ms.
- 844×390 — 21/21 PASS; duration 447ms.
- 932×430 — 21/21 PASS; duration 438ms.
- 1280×800 — 21/21 PASS; duration 413ms.

**Përmbajtja e çdo grupi me 21 kontrolle:** 7 fokus/tastierë **SINTETIKE** (fokus në Plans, Tab, Shift+Tab, Escape, rikthimi i fokusit, rikthimi i inert dhe zero JS errors), 9 tema `light/dark/auto` dhe localStorage (sjellja e dark class, preferencat, mbijetesa e auto pas refresh, rivendosja e vlerës së mëparshme dhe zero JS errors), 5 draft HTML benign (vlera e input-it, mungesa e krijimit të elementit DOM, mungesa e autopublikimit/ruajtjes, mbyllja pa bllokim, zero JS errors). Në këtë pajisje Auto përdori modalitetin Dark; sjellja Auto në një pajisje me preferencë Light nuk u provua.

**Matjet informative, jo standarde certifikimi:** `DOMContentLoaded` 440/546/441/424/446/437/412ms respektivisht; `transferSize=374633 B` në çdo përmasë (cache mund të ndikojë). Në 320–932 px, `#screen/#phone scrollWidth===clientWidth`, kurse në viewport-in desktop 1280×800 telefoni i demos qëndroi 400×... px. Këto nuk provojnë performancën sipas Core Web Vitals dhe as mungesën e overflow në të gjitha karuselet dhe panelet e brendshme.

**Status QA:** regresioni bazë më parë **126/126 PASS** (18 kontrolle × 7); regresioni i avancuar tani **147/147 PASS** (21 × 7). Gjithsej **273/273 kontrolle PASS për këto dy suita**, jo 273 kontrolle të pavarura të të gjitha funksioneve të produktit. F7-006 (navigimi te cilësimet e temës) konfirmohet i zgjidhur në të gjitha 7 përmasat. Nuk ka në këtë raport gabime funksionale që kërkojnë korrigjim të aplikacionit.

**Kufizimet dhe detyrat e hapura para mbylljes finale të Paketës 7:**
1. Audit manual vizual në Light/Dark/Auto të Home, Discover, Reels, Messages, Profile, Shop, Plans, Connections, Privacy dhe Governance, edhe në telefona të vegjël/landscape; tekste të gjata, mbivendosje, z-index, scroll i brendshëm, prekje/gesture dhe imazhe.
2. Tastierë fizike dhe aksesueshmëri: Tab/Shift+Tab/Escape real, fokus i dukshëm, semantika dialog/aria, kontrast/lexues ekrani. Testet sintetike nuk certifikojnë WCAG.
3. Ruajtje/reload për funksionet e tjera (jo vetëm tema), validim formularësh dhe të dhëna negative më të gjera; evente të përsëritura, Memory/MutationObserver dhe stabilitet gjatë përdorimit.
4. Performance në pajisje reale (jo vetëm Navigation Timing orientues) dhe test manual Android/iOS sipas disponueshmërisë.
5. Raporti final i sign-off: çdo defekt P0/P1 të jetë i mbyllur; të dihet statusi i P2 dhe vendimet e pronarit. Faza 8/PRD nuk ka filluar; nuk ndryshohen `main`, Vercel Production, identiteti i miratuar ose ndonjë projekt tjetër.

**Konkluzion:** faza 7 ka kaluar **portën e regresionit funksional të automatizuar**; certifikimi i plotë i Fazës 7 mbetet NË PROCES derisa të përfundohen portat e mësipërme.

## Faza 7 — Cikli 11: Laboratori vizual i izoluar dhe kriteret e sign-off (22 tetor 2026)

**Baza e provuar:** raporti i përdoruesit tregoi 126/126 PASS për skenarin bazë dhe 147/147 PASS për suitën e avancuar, në 7 përmasa; **273/273 PASS gjithsej për testet e përcaktuara**. Kjo portë automatike është e kaluar. Kjo nuk është certifikim i pamjes, WCAG, media, performancës ose gatishmërisë për përdorues realë.

**Mjeti i ri për auditimin e mbetur:** u shtua vetëm skedari i ri `demo/ILLYRIAN_VISUAL_QA_v1.7.html` në degën `demo/v1.7-illyrian-shop`, commit `5209afbd4b53cc0578d75e4eda3186c0352edfd2`. Ai nuk e modifikon HTML-në e demos, skedarët e gjashtë moduleve, skedarin e laboratorit të mëparshëm apo cilësimet vizuale të miratuara. Nuk u prek `main` ose Vercel Production.

**Mundësitë e implementuara, ende jo të ekzekutuara në shfletuesin e përdoruesit:**
- Skanim same-origin në iframe të demos, në një përmasë ose në të shtata: `320×568`, `360×780`, `390×844`, `430×932`, `844×390`, `932×430`, `1280×800`.
- Për secilën përmasë viziton Home, Discover, Events dhe Profile duke përdorur navigimin aktual v1.7. Inspekton horizontal overflow të dokumentit, scrollWidth/clientWidth të `#phone` dhe `#screen` (sinqalisim INFO/WARN, jo dështim automatik), ID të dyfishta, fotografi të dukshme të prishura/pa atribut alt/dyshime të ngarkimit dhe elemente me tekst potencialisht të prerë për shkak të overflow hidden/clip.
- Dymbëdhjetë skenarë manualë, secili me status PASS/ISSUE/UNKNOWN/N/A: Home/Discover/Profile në tri tema; Shop/Shop Plus; Plans/Connections; Privacy/Governance; Stories/Reels; Messages; ekran 320px; landscape; tastierë fizike; telefon me prekje; etiketa/kontrast/lexues ekrani; stabilitet pas përdorimit të përsëritur.
- Kopjimi i raportit me të dhëna nga skanimi dhe statuset manuale. Shënimet dhe statuset nuk ruhen në localStorage dhe nuk dërgohen në server. Nuk përfshin paketë të jashtme ose API të rrjetit për transmetim raportesh; nuk publikon postime, aktivitete, raportime apo pagesa.
- Pas skanimit, iframe rifreskohet për të mos lënë një ekran/modal testimi aktiv. Kjo **mund të humbasë input-e të paruajtura në iframe**; përpara skanimit përdoret vetëm demo e testimit.

**Verifikim i implementimit:** skripti inline analizuar sintaksisht me `new Function()` (PASS); 7 përmasa, 12 kontrolle manuale, një iframe, asnjë `localStorage.setItem()`, `fetch()` apo dërgim te serveri. Skedari i plotë u rilexua me blob SHA të njëjtë si teksti i krijuar. **Kjo nuk është provë PASS për skanimin në Chrome real**.

**Kritere për mbylljen e Fazës 7:** (1) raporte nga kontrolli vizual në të tre temat dhe mobile/landscape, (2) tastierë fizike/aksesueshmëri manuale, (3) prova touch dhe media në telefon, (4) çdo problem P0/P1 i zgjidhur, P2 i regjistruar, (5) raport sign-off i aprovuar. Pamjet manuale dhe komentet njerëzore mund të mos zëvendësohen nga inspektimi mekanik i DOM-it. Faza 8 mbetet e mbyllur deri te vendimi përfundimtar mbi demo-n.

**URL e QA vizuale:** https://illyrian-demo-git-demo-v17-illyrian-shop-un24.vercel.app/ILLYRIAN_VISUAL_QA_v1.7.html

## Faza 7 — Cikli 12: Raporti i dukshëm dhe çështja mobile-landscape (22 tetor 2026)

**Feedback real i përdoruesit:** në `ILLYRIAN_VISUAL_QA_v1.7.html` raporti nuk mund të merrej me butonin e raportit, dhe pamja e telefonit në anash (landscape) dukej jo proporcionale/e pasaktë. Këto vërejtje janë të rëndësishme dhe **nuk anulohen** nga 273/273 PASS në dy suitat funksionale, të cilat nuk e certifikonin UI mobile-landscape.

**Analiza nga kodi:**
1. QA vizuale kishte butonin `Kopjo raportin`, por **nuk kishte `Krijo raportin` dhe as preview të raportit**; kopjimi përdorte vetëm `navigator.clipboard.writeText`, që mund të refuzohet nga lejet/shfletuesi. Kodi nuk garantonte një rrugë të dukshme alternative për përdoruesin.
2. QA vizuale vendoste gjerësi fikse iframe prej 844/932px brenda panelit të ngushtë (maksimum ~550px). Shfaqja kërkonte zhvendosje horizontale dhe mund të dukej e prerë, megjithëse viewport i brendshëm ishte i vlefshëm.
3. **Çështje e veçantë e UI të demos:** `ILLYRIAN_DEMO_v1.7.html` përmban `@media(max-width:760px)` për pamje mobile full-screen dhe `@media(min-width:761px) and (max-height:700px)` për një desktop të ulët. Landscape 844×390 dhe 932×430 prandaj aktivizon **desktop shell** (me telefon/dhomë anësore), jo një layout mobile-landscape të projektuar për rrotullimin fizik. `.device` ka `min-height:570px`, kurse në atë media desktop `min-height:500px`, që tejkalon 390/430px të viewport-it. Kjo është një **mangësi e vërtetuar e përshtatjes së synuar**, por intensiteti vizual dhe ndërveprimet duhen provuar në telefon fizik. Regjistrohet si **P1 kandidat për mobile-landscape** përpara sign-off, jo thjesht "normale".

**Korrigjimi i autorizuar brenda scope të QA pa ndryshuar aplikacionin:**
- Vetëm `demo/ILLYRIAN_VISUAL_QA_v1.7.html` u përditësua: u shtuan `Krijo raportin`, pamja e raportit në `textarea readonly`, kopjimi me fallback selektimi manual dhe `Shkarko .txt` për rastet kur Clipboard refuzohet. Asnjë API raportimi në server.
- Shfaqja e iframe ka `Përshtat në ekran` (paraqitje e shkallëzuar pa ndryshuar dimensionet e brendshme) ose `100% · lëviz anash`. Kur zgjidhet 844×390 apo 932×430, shfaqet një paralajmërim eksplicit që demo po përdor desktop media-layout dhe nuk është provë e përshtatjes mobile-landscape.
- Commit `a21dfd5fb0f4db90ec1280b136c46f96fa60a9a5`. Kodi u rilexua nga GitHub me përputhje të plotë, JavaScript sintaksisht PASS. Skenarët logjikë për gjenerimin e tekstit të raportit, ruajtjen e etiketave të manuallit dhe llogaritjen e shkallës së iframe: **9/9 PASS në V8**. Nuk janë E2E browser të përdoruesit, prandaj marrja reale e raportit mbetet të konfirmohet.

**Vendimi për aplikacionin:** Në këtë cikël **nuk u ndryshua `ILLYRIAN_DEMO_v1.7.html`**, CSS apo identiteti i miratuar; `main`/Production të paprekura. Për të zgjidhur P1 në produkt do të duhet dizajn/QA i dedikuar landscape (media query e orientuar sipas lartësisë dhe orientimit, z-index/scroll, pa prishur desktop), pastaj testim fizik në Android/iOS dhe në Preview.

**URL korrigjuar:** https://illyrian-demo-git-demo-v17-illyrian-shop-un24.vercel.app/ILLYRIAN_VISUAL_QA_v1.7.html

## Faza 7 — Cikli 13: Raporti real Visual QA (56 PASS) dhe diagnostika landscape (22 tetor 2026)

**Prova e përdoruesit:** dokumenti "Tekst i ngjitur(1).txt", titull "ILLYRIAN VISUAL QA — 2026-10-22T15:08:40.743Z", 189 rreshta. 7 viewport-e (320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800), 4 pamje për çdo viewport (Home, Discover, Events, Profile). Numërimi i verifikuar: **56 PASS, 112 INFO, 0 FAIL, 0 WARN**. Çdo përmasë: 8 PASS dhe 16 INFO. PASS matin vetëm mungesën e overflow horizontal në dokument dhe mungesën e ID-ve të dyfishta brenda #phone. INFO matin gjerësi të brendshme, statusin e imazheve të dukshme dhe sinjale potenciale të tekstit të prerë. Raporti nuk certifikon pamjen e çdo paneli.
**Kontrolle manuale:** 0/12 të vlerësuara; të 12 statuset UNKNOWN dhe porta e publikimit E HAPUR. Kjo mbetet e vërtetë edhe pse dy suitat e mëparshme funksionale dhanë 273/273 PASS.

**Evidenca landscape është ende e paplotë:** raporti vizual i vjetër dha gjerësinë e #phone dhe #screen 842px në 844×390 dhe 930px në 932×430. Kodi statik i CSS ka breakpoint mobile @media(max-width:760px), dhe një rregull desktop për gjerësi mbi 761px/lartësi nën 700px; pritet potencialisht desktop shell ~400px. Kjo kontradiktë kërkon matje të viewport-it të brendshëm dhe të CSS real përpara një ndryshimi dizajni. Nuk mund ta quajmë sjelljen e landscape të saktë ose të gabuar përfundimisht vetëm nga 56 PASS.

**Korrigjimi vetëm në instrumentin Visual QA:** commit ed11612f0d0f48022986a9c8e4a82d8eed39a9c7 (vetëm demo/ILLYRIAN_VISUAL_QA_v1.7.html). Laboratori tani ndryshon gjerësinë/lartësinë dhe rifreskon iframe për çdo përmasë, pastaj mat window.innerWidth/innerHeight, matchMedia(max-width:760px), display të .side, rect të #phone dhe .device-shell. Në landscape vendos WARN si nevojë kontrolli real në pajisje. U kalua verifikimi sintaksor JavaScript, rileximi i blob-it GitHub dhe 3/3 kontrolle logjike sintetike (portrait, desktop-shell në landscape, mismatch viewport). **Këto nuk janë prova E2E në browser.**

**Hapi i radhës:** të ekzekutohet sërish skanimi i 7 përmasave me diagnostikën e re, të kontrollohen manualisht në landscape 844×390 dhe 932×430 dhe të rishikohen screenshot-et nëse ka mospërputhje. Pastaj vendoset riparimi CSS i izoluar për mobile-landscape pa prishur desktopin e miratuar. Main dhe Production të paprekura.

## Faza 7 — Cikli 14: Diagnostikë reale landscape dhe korrigjimi i interpretimit (22 tetor 2026)

**Prova e përdoruesit:** skedari Tekst i ngjitur(2).txt, raport ILLYRIAN VISUAL QA — 2026-10-22T15:30:15.583Z. Numërim mbi 205 rreshta: **63 PASS, 119 INFO, 2 WARN, 0 FAIL** në 7 përmasa dhe 4 pamje (Home, Discover, Events, Profile). Të dymbëdhjetë kontrollet manuale janë UNKNOWN (0/12 të kryera); Release gate E HAPUR. 63 PASS = 56 kontrolle overflow/ID + 7 dimensione; INFO = 112 matje të pamjeve + 7 matje gjeometrie. Dy WARN janë kontrolle të orientimit horizontal, jo FAIL.

**Matjet e reja:**
- 320×568 → viewport 318×566, side=none, phone=shell=318×566, max-width:760=true.
- 360×780 → viewport 358×778, side=none, phone=shell=358×778, max-width:760=true.
- 390×844 → viewport 388×842, side=none, phone=shell=388×842, max-width:760=true.
- 430×932 → viewport 428×930, side=none, phone=shell=428×930, max-width:760=true.
- 844×390 → viewport 842×388, side=none, phone=shell=842×388, max-width:760=false; mobileFullscreenHeuristic=true (WARN).
- 932×430 → viewport 930×428, side=none, phone=shell=930×428, max-width:760=false; mobileFullscreenHeuristic=true (WARN).
- 1280×800 → viewport 1278×798, side=flex, phone=400×724, shell=414×738, max-width:760=false.

**Korrigjim i interpretimit të mëparshëm:** inspeksioni i të GJITHA skedarëve CSS tregoi rregullin EKZISTUES në demo/ILLYRIAN_PRIVACY_MAP_v1.7.css: @media (orientation:landscape) and (min-width:761px) and (max-width:1100px) and (max-height:520px). Rregulli fsheh .desktop>.side, e bën .desktop block, e shtrin .device-shell në 100% dhe i vendos .device height:100dvh;min-height:0. Për rrjedhojë, media query origjinal i HTML-së nuk mund të shqyrtohet i izoluar. **Nuk ka provë se demoja po shfaq desktop-shell në 844×390 dhe 932×430**; matjet në browser konfirmojnë gjeometri fullscreen. Vlerësimi i mëparshëm si bug i sigurt mobile-landscape korrigjohet. Dy WARN kërkojnë vetëm inspektim manual të përdorshmërisë.

**Rrezik arkitekturor, jo bug i konfirmuar:** rregulli global i layout-it landscape ndodhet te CSS-ja e një moduli Privacy/Map, jo te responsive core CSS. Çaktivizimi i modulit mund të ndikojë sjelljen landscape. Të planifikohet konsolidim i CSS-së vetëm pas një vlerësimi/regresioni të dedikuar; nuk ndryshohet kodi i aplikacionit në këtë cikël.

**Kufizimet që mbeten:** Asnjë screenshot, test telefon real, përdorshmëri e butonave, scroll vertikal i modalëve, media/Reels/Stories, tastierë fizike, kontrast apo lexues ekrani. Manuali është 0/12, jo FAIL. Faza 7 mbetet E HAPUR; nuk duhet riekzekutuar i njëjti skanim pa nevojë, por të plotësohen provat manuale, përfshirë landscape.

**Ndryshimet:** vetëm regjistrim i evidencës në roadmap të degës demo/v1.7-illyrian-shop, pa ndryshuar skedarët e demos, Visual QA, main apo Vercel Production.

## Faza 7 — Cikli 15: Raport i përdoruesit për landscape dhe X të Reels (22 tetor 2026)

**Raport real i përdoruesit:** "Landscape nuk është mirë dhe në Reels nuk del fare X që të heqësh Reels-in". Këto janë gjetje nga përdorimi manual (P1 për mbylljen e Reels dhe P1 kandidat për layout landscape), edhe pse suitat automatike bazë/avancuara raportuan 273/273 PASS. Nuk lejohet përfundimi i Fazës 7 vetëm nga PASS e DOM: tests nuk mbulonin këtë ndërveprim specifik.

**Analiza e kodit:** X tashmë ekzistonte te v4ReelContent si [data-act="reel-close"] me handler që e bën state.reelOpen=false dhe render; por header-i kishte edhe veprimin "Krijo Reel" (i shtuar në v1.5), emrin dhe numëruesin, me display:flex/justify-content:space-between dhe pa kontroll specifik ndaj shtyrjes së X jashtë kornizës. Në landscape, pozicionet vertikale të .v4-reel-side/footer/controls linin pak hapësirë. Reels i krijuar vetë përdor [data-act="v16-close"] ekzistues. Këto janë rrugët e korrigjimit; mungesa reale e X u raportua nga përdoruesi, por nuk ka ende screenshot ose E2E real të commit-it të riparuar.

**Implementimi i izoluar:**
- Skedar i RI demo/ILLYRIAN_V17_RESPONSIVE.css (commit 7423aaca055dd97bc11ea542f878abfcc4425dd6). Ai vendos X të Reel demonstrues absolutisht në cepin lart-djathtas të header-it me dimensione minimale 44×44px, kontrast/outline fokus, mbrojtje nga mbivendosja me krijimin e Reel dhe numëruesin; përmban rregulla që kompaktësojnë header-in, panelin anësor të veprimeve, footer-in dhe navigimin e Reels në landscape (deri në 520px lartësi), si dhe rregullime të v16-viewer për Reels/Stories të krijuara. Pamja desktop me lartësi normale nuk synohet të ndryshojë.
- U lidh stylesheet i ri në fund të link-eve CSS të demo/ILLYRIAN_DEMO_v1.7.html (commit 476d018a453884cf0b00483aed5339ab2f09ebf4); nuk u ndryshua markup ose JavaScript bazë i produktit, as identiteti i markës.
- Rregulli i vjetër i fullscreen landscape, i cili ishte vendosur gabimisht në CSS të Privacy/Map, u zhvendos identikisht në stylesheet responsive dhe u hoq vetëm nga demo/ILLYRIAN_PRIVACY_MAP_v1.7.css (commit d52f092f284120d08240eff7e99c2503f66c23fb). U verifikuan 11 deklaratat e mëparshme CSS identike para ndryshimit.
- QA vizuale e izoluar demo/ILLYRIAN_VISUAL_QA_v1.7.html u zgjerua me provë Reels në çdo viewport: ekzistenca e X, dimensionet dhe hit-test elementFromPoint, klikimi mbyll overlay (commit c25fb32743aec3b81d0f48c54d7882377319d42d). Kontrolli nuk krijon/ndryshon të dhëna reale.

**Verifikim që u realizua realisht:** pas shkrimeve, katër skedarët u lexuan sërish nga GitHub; 10/10 kontrolle statike të integritetit të lidhjes CSS, vetëm një vend të deklarimit të media-rule, prania e handler-it v4, X-it dhe 3 kontrolleve të QA, koordinimi CSS në ekranet e shkurtra, plus balancimi i 30/30 kllapave CSS, u kaluan. Kodi JavaScript i instrumentit QA kaloi kontrollin sintaksor. **Nuk u ekzekutuan këto riparime në shfletues real/telefon gjatë këtij cikli**; rezultatet e mëparshme 273/273 janë para ndryshimeve dhe duhen regresuar nëse finalizohet versioni.

**Hapi i radhës:** hap preview-in e rifreskuar, provo Reels në portrait (390×844) dhe landscape (844×390, 932×430), verifiko X dhe mbylljen me klikim/prekje, skano nga Visual QA një përmasë ose shtatë përmasat për raportin e të tria provave X; dërgo raport + screenshot për çdo defekt tjetër. Pas këtyre bëhet regresioni 126+147 dhe kontrolli manual i ekraneve të tjera para përfundimit të Fazës 7.

**Scope:** vetëm dega demo/v1.7-illyrian-shop; main, production dhe projektet e tjera nuk preken. Statusi P1 është IN PROGRESS derisa të provohet në browser/pajisje.

## Faza 7 — Cikli 16: Reels X confirmed by user (22 tetor 2026)

**Konfirmim manual në preview pas korrigjimit:** përdoruesi pohoi se demo hapet dhe, pas pyetjes nëse X në Reels shfaqet dhe mbyll pamjen, u përgjigj: 'po mbyllet ...'. Kjo është evidencë direkte për suksesin e veprimit të mbylljes së Reels në shfletuesin/viewport-in ku përdoruesi e provoi. **Viewport-i, orientimi dhe pajisja nuk janë specifikuar**: nuk duhet të shënohet si 7/7, Android+iOS, ose certifikim i X në landscape.

**Status:** Reels close X: MANUAL PASS (skenari i raportuar, përmasë e papërcaktuar). Reels në 844×390 dhe 932×430: UNKNOWN derisa të provohen. Çështja më e gjerë e paraqitjes landscape: E HAPUR, sepse përdoruesi më parë raportoi pamje të pasaktë dhe nuk ka konfirmuar ende korrigjimin e saj. Faza 7 ende NË PROCES dhe regresioni 126+147 pas ndryshimit CSS nuk është ribërë.

**Veprim:** vetëm regjistrim i feedback-ut në roadmap; nuk u ndryshua asnjë kod. Main/Production të paprekura.

## Faza 7 — Cikli 17: Audit me pesë screenshot-e 844×390 dhe korrigjim i mbivendosjes Reels (22 tetor 2026)

**Prova vizuale e përdoruesit:** pesë screenshot-e të Visual QA në përmasën e zgjedhur 844×390, opsioni "Përshtat në ekran" dhe shkallëzim i shfaqjes **59%**. Screenshot-et tregojnë Home, Discover, Reels të hapur, modalin e Mesazheve dhe Profile. Në Reels shihet butoni "Krijo Reel" që mbivendoset pjesërisht me X-in në cepin lart-djathtas, megjithëse përdoruesi më parë konfirmoi që X e mbyll Reels. Te Mesazhet butoni X shfaqet dhe lista ka scrollbar; në lartësi të ulët duhet të mbetet i arritshëm kur paneli lëviz. Teksti i paralajmërimit të laboratorit ("aktivizon pamjen desktop nga 761px") nuk përputhet me CSS-në reale/fullscreen në këtë viewport.

**Shkaqet konkrete nga repo:** te inline style i v1.5 ekziston deklarimi .v15-reel-create me position:absolute!important; right:45px; top:4px. Një rregull më i ri vendoste [data-act="reel-close"] absolutisht në right:8px me zonë 44px. Dy kontrollet rrjedhimisht mbivendoseshin. Sjellja e fullscreen në landscape vjen nga rregulli tashmë i migruar në ILLYRIAN_V17_RESPONSIVE.css (761..1100px, max-height:520px, orientation:landscape). Korniza e QA zvogëlon vetëm paraqitjen e iframe, jo dimensionet e viewport-it të brendshëm.

**Korrigjim i kufizuar në branch-in demo/v1.7-illyrian-shop:**
- demo/ILLYRIAN_V17_RESPONSIVE.css: rregull specifik për .v15-reel-create që ruan pozicionin absolut, por e vendos **64px nga e djathta** dhe e ndan nga X-i (8px nga e djathta me gjerësi 44px, pra ≥12px hapësirë). Përdor !important vetëm për top/right/position ndaj CSS-së së v1.5; max-width/ellipsis për të mos u shtrirë mbi header. Në landscape top:3px për të dy butonat, me distancë horizontale të ruajtur.
- Po në landscape, .overlay .modal përdor scroll vertikal dhe .modalhead sticky me z-index, background dhe min-height 44px; kështu X i modaleve, përfshirë Mesazhet, qëndron lart gjatë scroll-it të panelit. Nuk u ndryshuan handler-at e mbylljes ose struktura e mesazheve.
- demo/ILLYRIAN_VISUAL_QA_v1.7.html: paralajmërimi i vjetër për pamjen desktop zëvendësohet me shpjegimin e saktë të shkallëzimit të pamjes dhe kufizimit të simulimit. Skenari Reels tani mat edhe mbivendosjen gjeometrike (intersection area) të X-it me "Krijo Reel" dhe nëse qendra e butonit Krijo Reel është target i klikueshëm; emërton PASS/FAIL më vete. Nuk ndryshon historikun e QA-s së mëparshme.

**Provat e implementimit:** u rilexuan nga GitHub me përputhje të plotë ndryshimet e CSS (commit e7220e48669bd42fa98bb17fa3ba71595201b98f) dhe Visual QA (commit 772200dee6e8f6f9f2bc3f599c011f766cc5c1e6); CSS ka kllapa të ekuilibruara; JavaScript inline i QA kaloi kontrollet sintaksore. Prova e Chromium në mjedisin e izoluar nuk ktheu output të përdorshëm, kështu **korrigjimi nuk është provuar ende në shfletuesin real** dhe P1 nuk mbyllet nga analiza statike.

**Testi i radhës:** në Visual QA 844×390, hap Reels dhe verifiko që ✕ dhe Krijo Reel nuk mbivendosen, mund të shtypen veçmas dhe X e mbyll overlay; në Mesazhe bëj scroll derisa X të mbetet i dukshëm; përsërit 932×430, pastaj regjistro raportin e QA. Në rast PASS nga shfletuesi, ribëhet regresioni bazë+avancuar për ndryshimet CSS dhe plotësohen kontrollet manuale. Faza 7 mbetet NË PROCES.

**Ruajtja e scope:** nuk u ndryshuan theme, paleta, ikonat, JS bazë e app, branch main ose Vercel Production.

## Faza 7 — Cikli 18: Chromium browser QA e automatizuar dhe kufizimi i runner-it (22 tetor 2026)

**Vendim i pronarit:** të vazhdohet ndërtimi dhe kontrolli teknik në mënyrë autonome, pa kërkuar prova manuale pas çdo ndryshimi; pronari do të testojë të gjithë aplikacionin në telefon në fund dhe më pas do të japë screenshot-e për korrigjime. Nuk do të pretendohet se kemi kaluar testimin fizik pa prova.

**Shtesa e realizuar:** u krijua `qa/illyrian-v17.spec.cjs` (commit 51e258aeb9b9682c8bdfe0be34653fda169b5a72) me **10 skenarë** Chromium/Playwright për këtë demo: 7 përmasa për Reels X të dukshëm, mbi 43×43px, mosmbivendosje me Krijo Reel dhe mbyllje pas klikimit real; 2 përmasa landscape 844×390/932×430 për shell fullscreen dhe X të Mesazheve që mbetet i arritshëm pas scroll; 1 desktop 1280×800 për sidebar dhe kornizë telefoni. Skenarët përfshijnë hyrjen si vizitor dhe mbylljen e turit të parë në browser të ri; shërbejnë vetëm për QA, nuk prekin shërbime të jashtme ose veprime të përdoruesve realë.

**Konfigurimi:** `playwright.config.cjs` (commit a14fb2ac1b2c1b73dc5bd631a2e6294511632e50) nis `python3 -m http.server` mbi dosjen demo në localhost:4173, përdor Chromium headless, ruan screenshot/trace në dështim dhe nuk ndryshon Vercel Production. Workflow `/.github/workflows/illyrian-v17-browser-qa.yml` (commit 7118c42c82065e4a5023098cadef65298e875a82) përdor ubuntu-latest, permissions contents:read, timeout 18 min, Node 22, version fiks @playwright/test 1.55.1 dhe push trigger vetëm për ndryshime të demos/testeve.

**Verifikimi që kemi REALISHT:** skedarët u shkruan e u rilexuan në GitHub, sintaksa CommonJS e testit dhe konfigurimit u verifikua me V8 new Function, dhe GitHub Actions e krijoi run-in [39818951307](https://github.com/titanfit102-bit/Illyrian/actions/runs/39818951307). **Dy përpjekje** (run_attempt 1 dhe 2) dolën **failure në ~2–3 sekonda pa runner dhe pa hapa të ekzekutuar**: `runner_id=0`, `steps=[]`. GitHub nuk ktheu log-e ose shpjegim të besueshëm (job logs endpoint doli BlobNotFound). Kjo është PENGESË INFRASTRUKTURE/PLANIFIKIMI GITHUB ACTIONS, jo rezultat FAIL i testit të aplikacionit. Të mos thuhet "10/10 PASS" apo "Playwright ekzekutoi testet". Mund të jetë kuota/konfigurim/runners; **shkaku i saktë UNKNOWN** deri në kontrollin e GitHub Actions UI.

**Puna që mund të vazhdojë pa runner:** analizë dhe korrigjime statike, browser QA Lab ekzistues dhe raport final që kërkon test fizikal nga pronari. Testet e reja janë ruajtur dhe mund të ekzekutohen sapo runner-i të bëhet i disponueshëm. Gabimet e veçanta të raportuara nga screenshots (Reels X/Krijo Reel, landscape dhe Mesazhet) nuk mbyllen përfundimisht vetëm nga statika; kërkojnë regresion real.

**Scope:** vetëm branch demo/v1.7-illyrian-shop. Main, Production dhe projektet e tjera të pandryshuara.

## Faza 7 — Cikli 19: Test harness të ruajtur dhe preview më i gjerë (22 tetor 2026)

**Korrigjim i instrumentit të përdoruesit:** në demo/ILLYRIAN_VISUAL_QA_v1.7.html u rrit gjerësia e kolonës së preview-it duke ndryshuar layout desktop nga `minmax(280px,550px) minmax(280px,1fr)` në `minmax(0,1fr) minmax(300px,440px)`. Në ekrane mjaftueshëm të gjera, iframe landscape 844×390 dhe 932×430 do të ketë më shumë hapësirë dhe mund të afrohet te përmasa native, duke zvogëluar përdorimin e 59% scale nga screenshot-et e mëparshme. Në ekranet nën 930px mbetet layout me një kolonë. Commit c0329de4bae9772c92795ff6b55d28d6f81351af. Ky është përmirësim i pamjes së laboratorit, **jo garanci për layout-in e aplikacionit real në telefon**.

**Workflow QA i pezulluar nga infrastruktura:** Pasi dy përpjekjet e run-it #39818951307 dështuan pa runner dhe pa hapa, ekzekutimet automatike në çdo push krijonin dështime false të përsëritura (p.sh. #39819477947). Workflow `/.github/workflows/illyrian-v17-browser-qa.yml` u ndryshua në `workflow_dispatch` vetëm, commit 5917f1d7ad3b56160fe70d8bbce24fd5c175bd2c; mbetet i ruajtur për riaktivizim pasi të zgjidhet bllokimi real i GitHub runner-it. Shkaku i saktë ende UNKNOWN. Kjo nuk është shenjë se browser testet kanë kaluar.

**Kontrolle statike të integrimit pas ndryshimeve:** 12/12 PASS për regjistrimin e saktë të 10 skenarëve Playwright (7 Reels, 2 landscape, 1 desktop), lidhjen e navigimit të Reels/Mesazheve nga produkti, prani të handler-it Reels close, CSS të lidhur, CSS për X + Krijo Reel, layout-in më të gjerë të QA, workflow manual-only, parse të JavaScript të QA dhe konfigurim local-only për Playwright. Këto janë **kontrolle statike/registrimi, JO ekzekutim të testeve Chromium**.

**Përpara sign-off:** ekzekutim Chromium real kur runner-i të jetë i disponueshëm; regresioni bazë+avancuar i demos pas CSS-së së re; kontroll manual në telefon nga pronari vetëm në fund të etapës së ndërtimit, siç ka kërkuar. Faza 7 mbetet NË PROCES; gatishmëria production/backend nuk matet nga demoja. Main/Production të paprekura.

## Faza 7 — Cikli 20: Actions runner rikuperuar dhe Chromium 10/10 PASS (22 tetor 2026)

**Përdoruesi kërkoi ritestim pas ndërprerjes së GitHub Actions.** U rinis konkretisht run #39819477947 (përpjekja e dytë), commit `13fa75b0cbd37df2e3b43805c50b1df4d2af936e`. GitHub konfirmoi runner-in e vërtetë `ubuntu-latest` (`runner_id=1000001894`), instalimin e Node.js/Playwright/Chromium dhe **përfundimin `completed/success`**. Log-et e testit të Playwright përmbajnë: **`10 passed (8.1s)`**. Testet: Reels X kundër mbivendosjes me "Krijo Reel" në shtatë viewport-e (320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800), mbyllja e Mesazheve në të dyja përmasat landscape, dhe ruajtja e side panel desktop në 1280×800. Testet përdorën Chromium headless në localhost, jo pajisje fizike.

**Rikuperimi i CI:** workflow `.github/workflows/illyrian-v17-browser-qa.yml` u riaktivizua për `push` vetëm në branch `demo/v1.7-illyrian-shop` dhe ndryshimet `demo/**`, `qa/**`, `playwright.config.cjs`, vetë workflow (ruhet edhe `workflow_dispatch`). GitHub commit `1a2aed5601133c437d75d7d5a5f73c052baa149d`. Kjo nisi një run të ri #39823003129 mbi commit-in e rikuperimit; në momentin e shënimit kishte runner real (`runner_id=1000001895`), setup Node dhe paketë Playwright PASS, por instalimi Chromium ishte ende në proces. **Mos e regjistroni 10/10 PASS mbi këtë commit deri sa rezultati final të verifikohet.**

**Kufijtë e konkluzionit:** Kodi i aplikacionit (demo HTML/CSS/JS) nuk kishte ndryshuar midis commit-it të suksesit dhe aktivizimit të workflow-it; ndryshimet pas tyre kanë qenë QA visual layout, dokumentacioni dhe workflow. Pavarësisht 10/10 real Chromium, suitat 126/126 + 147/147 të kryera më parë nuk janë ribërë dhe auditi vizual/telefonik i plotë nuk është kryer. Faza 7 vazhdon NË PROCES. Main dhe Vercel Production të paprekura.

**Evidencë:** [Run i suksesshëm](https://github.com/titanfit102-bit/Illyrian/actions/runs/39819477947) · [Run i rikuperimit mbi workflow aktual](https://github.com/titanfit102-bit/Illyrian/actions/runs/39823003129).

## Faza 7 — Cikli 21: Playwright module dhe tema (22 tetor 2026)

**Pika e nisjes:** GitHub Actions run #39823684527 mbi commit `06f796f7dc4f284c6ae5ea9b62cbd4893aee17b5` është konfirmuar **completed/success** dhe log-et tregojnë **10/10 teste reale Chromium PASS (7.5s)**. Testet mbulojnë vetëm Reels X + Krijo Reel, dy landscape për Mesazhet dhe strukturën desktop; nuk provojnë gjithë produktin.

**Zgjerimi i ri i suitës:** skedari i ri `qa/illyrian-v17-flows.spec.cjs` u shtua në commit `eddb35932a883d56273d75ae695dab6f446f666b`. Përmban **10 skenarë të tjerë Playwright**: 7 viewport-e për hapjen/mbylljen e Shop/Shop Plus (Escape në shtresa), Plans, Connections→Plans draft (pa publikim), Privacy dhe Governance me izolim të sfondit, rikthim dhe overflow të dokumentit; si edhe 3 viewport-e për ruajtjen e Light/Dark/Auto dhe rikthimin EXACT të localStorage. Testet nuk krijojnë transaksione apo postime reale. `playwright.config.cjs` u zgjerua që të përfshijë të dy skedarët (`2dbcaa702af87b42a3133c28bed3511a08432cab`), objektiv **20 teste gjithsej**.

**Verifikimi deri tani:** 10 testet e reja u regjistruan me mock-test runner në V8 dhe skripti CommonJS kaloi analizën sintaksore; por **kjo nuk është ekzekutim Chromium**. GitHub Actions nisi run #39827389137 me Playwright, por instalimi `npx playwright install --with-deps chromium` mbeti më gjatë se zakonisht dhe nuk kishte test result në momentin e shënimit.

**Optimizimi i workflow-it në scope QA:** commit `a99a59917761cebbf26b915844b96c639ebce9b0` ndërron hapin në `npx playwright install chromium` për të shmangur update e rëndë të varësive OS në çdo run dhe kufizon `push.paths` në skedarë `.html/.css/.js` të demos, QA scripts, konfigurimin dhe workflow-in — ndryshimet vetëm në roadmap Markdown nuk duhet të nisin CI. Nëse runner-i raporton mungesë të librarive të sistemit, duhet rivendosur preflight/install-deps me diagnostikë, jo të pretendohet sukses. Run i ri mbi këtë commit: #39828144173, ende pa përfundim në momentin e shënimit.

**Kufizimet:** Faza 7 mbetet në progres, 20/20 nuk deklarohen PASS pa log-et dhe ekranet e fizike mbeten për testin final të pronarit. Branch `demo/v1.7-illyrian-shop` vetëm; `main` dhe Production pa ndryshime.


## Faza 7 — Cikli 22: QA e plotë në Chromium 25/25 dhe 273/273 (22 tetor 2026)

**Gjendja e verifikuar në CI:** run [#39833964922](https://github.com/titanfit102-bit/Illyrian/actions/runs/39833964922) në GitHub Actions, commit `f41ff38d8ad5ddbd75434079161d325116540e60`, përfundoi **completed/success** me runner ubuntu-latest dhe logun eksplicit **`25 passed (1.0m)`** në Chromium headless real. Brenda 25 testeve Playwright u ekzekutuan edhe dy suitë të plota të laboratorit ekzistues:
- QA integruese/bazë për shtatë viewport-e: **126/126 PASS**.
- QA e avancuar për shtatë viewport-e: **147/147 PASS** (fokus sintetik, Escape, Light/Dark/Auto + ruajtje preference, draft HTML benign, rivendosje e storage dhe pa gabime JS sipas suitës).
- Të tri testet **me tastierë reale Chromium** për Plans në 390×844, 844×390 dhe 1280×800: **PASS** për fokusin fillestar, Tab/Shift+Tab, Escape, rikthim fokusi dhe heqje `inert`.
- Testet e tjera E2E: Reels X/Krijo Reel në 7 viewport-e, Shop/Shop Plus, Plans, Connections→Plans draft, Privacy, Governance, ruajtja e Light/Dark/Auto në 3 viewport-e, shell-i landscape/Mesazhet dhe desktop frame: **PASS**.

**Saktësi e numërimit:** 25 janë **test cases Playwright**; dy prej tyre përmbajnë respektivisht 126 dhe 147 kontrolle të brendshme QA. Mos i paraqit 25 + 273 si 298 teste të pavarura; prova e saktë është **25/25 Playwright** dhe **273/273 kontrolle të laboratorit**. Kjo është rezultat në Chromium headless/localhost, jo certifikim i pajisjeve fizike, sigurisë, ngarkesës, backend-it, pagesave apo WCAG.

**Historia e diagnostikës, e ruajtur për transparencë:** Zgjerimi i tests në fillim dha 13 PASS/7 FAIL për shkak të një selektori Playwright që përfshinte njëkohësisht sfondin dhe butonin X të Plans; u korrigjuan selektorët e mbylljes në `qa/illyrian-v17-flows.spec.cjs` (commit `56cd440723a03c6350fb2cc9ef24ad46df9596ee`), pastaj **20/20 PASS** në run #39828604958. Më pas automatizimi i dy suite-ve QA Lab dha 24 PASS/1 FAIL për skenarin advanced: 119/147 kontrolle advanced PASS dhe 28 FAIL (4 kontrolle fokus sintetik × 7 viewport-e), ndërsa **3/3 testet direkte të tastierës reale** kalonin. Ndryshimi i fokusit në iframe në `demo/ILLYRIAN_QA_v1.7.html` (commit `90a9ff020814c694544ffa59e51fa672fdccf1ab`) nuk mjaftoi.

**Shkaku i korrigjuar dhe provuar:** një browser i ri nis përmes overlay-it v0.7 të mirëseardhjes/turit. Wrapper-i i QA Lab, ndryshe nga testet direkte E2E, përpiqej të testonte fokusin e Plans pa përfunduar hyrjen e vizitorit, edhe pse `.click()` programatik hapte panelet poshtë overlay-it. Në `qa/illyrian-v17-lab.spec.cjs` u shtua hyrja përmes butonit real **Shiko aplikacionin si vizitor → Kalo**, verifikimi që `#v7-auth.visible` nuk mbetet aktiv, dhe `illyrian_demo_v07_session==='entered'` përpara ekzekutimit (commit `f41ff38d8ad5ddbd75434079161d325116540e60`). Më pas **të 28 kontrollet e fokusit kaluan**, plus i gjithë ekzekutimi 25/25. **Kodi i funksioneve të aplikacionit nuk u ndryshua** nga ky korrigjim. Përputhja e browser-it të pastër me skenarin real të përdorimit shpjegon false negative në headless.

**Rregull i punës:** zhvillimi vijon në `demo/v1.7-illyrian-shop`. `main` mbetet `9f91b5c083b4482a70a2149483cc799360e6102c` dhe Production pa merge. GitHub Actions është aktiv për ndryshimet e kodit të demos dhe testit; ndërprerjet/ekzekutimet e vjetra të mbetura nuk zëvendësojnë suksesin e run-it #39833964922.

**Faza 7:** kriteri funksional automatik është i kaluar. End-to-end manual audit i gjithë demos në telefon, kontrollet vizuale, aksesueshmëria reale dhe sign-off mbeten të hapura, sipas kërkesës së pronarit që ta provojë aplikacionin në telefon **në fund të etapës së zhvillimit**. Nuk pretendohet përfundim 100% apo gatishmëri production/backend.


## Faza 7 — Cikli 23 / Faza 8 — Blueprint fillestar dhe foto QA (22 tetor 2026)

**Baza:** commit dd80a2b7e9c1b53bb476deb0c03a4ab0a31ae9f5. GitHub Actions run #39833964922: 25/25 Playwright PASS, përfshirë 126/126 dhe 147/147 QA Lab. Nuk zëvendëson testin fizik/visual që përdoruesi ka rezervuar për në fund.

**Evidencë vizuale e automatizuar:** skedari i ri qa/illyrian-v17-visual.spec.cjs planifikon 7 teste (320×568, 360×780, 390×844, 430×932, 844×390, 932×430, 1280×800), me nga 6 screenshot-e reale të Chromium: Home, Shop, Events, Plans, Profile, Reels. Në total 42 JPEG prova për rishikim, jo 42 visual PASS. Workflow i degës demo ngarkon artefaktin illyrian-v17-visual-review me retention 14 ditë. Këto shtojnë mbulimin e pamjeve, por nuk përbëjnë krahasim piksel për piksel, test i prekjeve apo WCAG. Rezultati PASS/FALI kërkon konfirmim nga GitHub Actions i commit-it të ri.

**Faza 8 — artefakt i ri:** architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md, version 0.1 i propozimit, përshkruan aktorët, autorizimet server-side, të dhënat relacionale, privatësinë, moderimin, rolet e shitësve, skenarët e Shop, rrugët alternativë klient/backend, transaksionet dhe portat e kalimit për MVP. Është dokument vendimesh/prove, jo zgjedhje e pakthyeshme teknologjike. Asnjë kod backend, pagesë, database, aplikacion native apo prodhim real nuk u aktivizua.

**Kufijtë:** Main, Production, branch v1.6 dhe projektet e tjera mbeten të paprekura. Faza 7 funksionale e kaluar; miratimi manual vizual/telefonik dhe Faza 8 MVP reale mbeten përpara. 5% komision në demo është vetëm ilustrim, nuk është vendim komercial.


### Cikli 23 — konfirmimi i Chromium 32/32 dhe 42 screenshot-e (22 tetor 2026)

- GitHub Actions [#39839958152](https://github.com/titanfit102-bit/Illyrian/actions/runs/39839958152), commit `610f3c9a2fffec84b4dc4475f9ff208b6c7113d8`, përfundoi **completed/success**. Log-et tregojnë shprehimisht **32 passed (1.4m)** në Chromium headless, përfshirë 25 skenarët ekzistues (me 126/126 QA Lab bazë dhe 147/147 QA Lab advanced brenda tyre) + **7 testet e reja të evidencës vizuale**.
- GitHub Actions publikoi artefaktin [illyrian-v17-visual-review](https://github.com/titanfit102-bit/Illyrian/actions/runs/39839958152/artifacts/12452028214), me **42 JPEG** të 6 pamjeve (Home, Shop, Events, Plans, Profile, Reels) × 7 viewport-e. Arkivi verifikohet të përmbajë 42 fotografi dhe është i ruajtur deri më **5 nëntor 2026**, sipas metadata-s së artefaktit.
- Inspektim paraprak i kontakt-sheeteve nga fotot e 320×568, 390×844, 844×390 dhe 932×430: pamjet kryesore dhe X i Reels janë të dukshme; në 320 px butonat e veprimit në Shop kanë shumë tekst dhe kërkojnë inspektim lexueshmërie në telefon. Fotografitë nuk provojnë scroll-in, prekje reale, kontrastin apo aksesueshmëri WCAG; **nuk jepet certifikim vizual**.
- Vercel Preview për commit-in `610f3c9a...` është **READY**, ID `dpl_738J5o7UUKvN2qgCse4ghsW4Ugri`; `main` mbetet `9f91b5c083b4482a70a2149483cc799360e6102c` dhe Production e paprekur.
- Hapi pasues është vlerësimi i detajuar i aksesueshmërisë, pastaj validimi i vendimeve të blueprint-it M0/M1. Nuk fillohet backend, pagesë, APK reale apo lansim pa portat e planit dhe autorizimet përkatëse.

## Faza 7 — Cikli 25: Sistemi i18n/l10n sq/en/it (22 tetor 2026)

Auditi verifikoi HTML/vanilla JS dhe gjashtë module, pa `tsconfig` ose sistem i18n paraprak. U ruajt biblioteka i18next v25.7.0 (MIT, vendor lokal), adapteri dhe katalogët semantikë 206 çelësa × 3 gjuhë / 14 namespace me fallback anglisht. `demo/i18n/` është pasqyrë e skedarëve burim në `i18n/` për t'u shërbyer nga Vercel dhe serveri statik. Settings ka zgjedhjen Shqip/English/Italiano me preferencë të ruajtur të ndarë nga account/feed. Gjuhët e pajisjes zbulohen vetëm në mungesë të zgjedhjes manuale; RTL mbetet për fazë të ardhshme.

U shtuan testet `qa/illyrian-v17-i18n.spec.cjs` për ndryshimin dhe ruajtjen e gjuhës, fallback, Intl/plural dhe përkthim të ekraneve kryesore; pritet verifikimi i rezultateve të Actions para çdo deklarimi të PASS. **Mbulimi i plotë i çdo dialogu/gabimi nuk është ende certifikuar**: kërkohet inventar i frazave të trashëguara dhe lokalizim eksplicit nga zhvilluesit. Nuk ndryshohet përmbajtja e përdoruesve, backend, llogaritë, marka, `main` ose Production. Dokumentet: `architecture/ILLYRIAN_I18N.md` dhe `MASTER_HANDOFF.md`.

## Faza i18n — Cikli 2: Zgjerim i katalogëve dhe formatim EUR (22 tetor 2026)

U verifikuan gjashtë katalogët en/sq/it, secili me 290 çelësa në 15 namespace; kopjet e shërbimit statik demo/i18n janë identike me burimin i18n. Commit fbd04ad37c653a233617a7464ad6a15a550c9b4a. GitHub Actions #39852230406 PASS; inventari i 12 pamjeve uli etiketat e pambuluara nga 150 në 81 nga 238 etiketa të vrojtuara, por mbiemrat/listimet dhe titujt composite mbeten klasifikim tjetër, jo patjetër përkthim UI. EUR në Shop/Shop Plus tani formohet sipas sq/en/it përmes Intl.NumberFormat, commit 9e40d6dd7c2e11b053b6f80ed87bf8af7d842776; Actions #39852521431 SUCCESS. U shtuan teste për formatet monetare dhe titujt e modaleve në të treja gjuhët (commit 7d7b3dbf3ae7a4744c5dad4e2f75fac548b00dcb). Ekzekutimi final i këtij commit-i duhet verifikuar përpara certifikimit të ndonjë rezultati. Borxhi i mbetur: rrugët kushtore të formularëve, gabimet dhe përkthimi direkt me çelësa semantikë. Pa ndryshime në main, production, backend ose përmbajtje përdoruesish.


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



## Architecture proposal integration / execution gate — 23 October 2026
The owner approved the **compatible principles** from Master Architecture Upgrade and Shop Addendum 02 after independent GPT Work critique, not wholesale implementation. Full classified decisions/open gates are at `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` §10 and `MASTER_HANDOFF.md` (2026-10-23 addendum); they replace neither this existing timeline nor Phase 8 M0–M5.

- NOW (DEMO P0): fix i18n Shop category/city form values and other affected controls; 54/56 Chromium results are not a PASS; ensure storage failures are not incorrectly reported as saved; isolate user content from legacy phrase translator; strengthen PR CI, only branch PR.
- THEN (DEMO P1-D): complete sq/en/it with semantic keys across screens, forms, notices; keep illustrative financial/privacy/analytics paths clearly simulated; audit Shop/Shop Plus state consistency, Settings, browser regression, 7 viewports, accessibility and physical phone screenshots.
- REAL APP DESIGN: unified account with scoped capabilities and authorization; shared analytics, notification, moderation and multilingual architecture; Shop canonical seller/shop/listing model with three transaction flows, social→listing deep references. Prefer modular backend and evaluate RN/Expo versus Web/PWA using evidence, without vendor lock-in.
- CONDITIONAL: Shop discovery/inquiries as a narrow MVP differentiator must be pilot-validated. Payments/commissions, full video/DM/dashboards and scaling remain later, gated by economics, legality, privacy and performance. Demo 5% is illustrative only.
- Not decided: first target country/city, public code visibility/licensing, stack/provider, launch scope, operations budget and payments. No irreversible configuration or merge, no projects outside ILLYRIAN.
- Independent report: `ILLYRIAN_MASTER_ARCHITECTURE_REVIEW_AND_EXECUTION_PLAN` dated 22 Oct 2026 (Work read-only, snapshot `4a951e4...`). Treat its facts as time-bound and its recommendations as proposals, not blanket approvals.


### P0-D progress — Shop select value / UGC fix (23 October 2026)
Documented accepted architecture in blueprint §10 and handoff. Corrected Shop form/category and city option values to remain stable across translations, and excluded user listing title/seller/description from automatic UI translation. Regression tests extended to 57. **Actions #39865986736: 57/57 passed (Chromium, code SHA `db574224d4849775224fb6ee4df0247aa2f18c46`).** PR #1 stays Draft; no merge, production or main changes. Remaining DEMO gates: localStorage failure rollback, other select values, full semantic localization, mobile/visual/a11y and current Vercel candidate verification.
