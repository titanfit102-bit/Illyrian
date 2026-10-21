# ILLYRIAN Demo v1.7 — Faza e zgjerimit dhe ILLYRIAN Shop

**Data e nisjes:** 21 tetor 2026  
**Burimi:** kërkesa eksplicite e përdoruesit për t'i ndërtuar të gjitha funksionet e mbetura të demos, plus ILLYRIAN Shop (produkte, dyqane të vogla, makina, banesa me qira dhe kërkim ndër-dyqanesh), me vazhdim fazë pas faze.  
**Status:** PAKETAT 1–5 TË IMPLEMENTUARA NË KOD NË DEGË (Faza 5: bazë funksionale, disa zgjerime ende të hapura); paketat 6–8 ende të planifikuara. QA e Fazave 3–5 përfshin kontrolle të logjikës në V8, jo test të plotë E2E në Chromium/telefon.  
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

## Paketa 6 — Besimi dhe menaxhimi [E PLANIFIKUAR]
- IN9-06 sinjal besueshmërie vetëm me shpjegim, pa badge sigurie të pavërtetuar.
- Panel moderimi me raporte, arsye, apelime demonstrative dhe privatësi të simulimit.
- Panel pune për organizatorë, biznes, shitës dhe punëdhënës në nivel UX demonstrues.

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
