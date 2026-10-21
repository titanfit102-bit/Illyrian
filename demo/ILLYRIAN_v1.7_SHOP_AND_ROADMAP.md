# ILLYRIAN Demo v1.7 — Faza e zgjerimit dhe ILLYRIAN Shop

**Data e nisjes:** 21 tetor 2026  
**Burimi:** kërkesa eksplicite e përdoruesit për t'i ndërtuar të gjitha funksionet e mbetura të demos, plus ILLYRIAN Shop (produkte, dyqane të vogla, makina, banesa me qira dhe kërkim ndër-dyqanesh), me vazhdim fazë pas faze.  
**Status:** PAKETAT 1–3 TË IMPLEMENTUARA NË DEGË; paketat 4–8 ende në planifikim. QA e Fazës 3 është vetëm simulim i logjikës JavaScript, jo test real Chromium.  
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

## Paketa 4 — Privatësi, lidhje sociale dhe harta [E PLANIFIKUAR]
- Profile private dhe kërkesa ndjekjeje; komunitete private e role.
- Harta e bizneseve/eventeve me vendndodhje të përafërt; pa koordinata publike të individëve.
- Përmirësimi i lidhjes postim/Story/Reel -> plan: i anuluar, privat, i mbushur, i skaduar.
- Korrigjim i responsivitetit të përgjithshëm në telefon horizontal.

## Paketa 5 — Shop i zgjeruar dhe ekonomia [E PLANIFIKUAR]
- Filtra të avancuar sipas nënkategorisë/intervalit të çmimit/kushteve; krahasim i ofertave të së njëjtës SKU kur ka informacion të besueshëm.
- Dyqane me profile/katalogë/oferta, inventar dhe fotografi demonstrative; automjete me vit/km; qira me lloj, zonë, sipërfaqe dhe afat.
- IN9-01 `Kërkoj...`: kërkesë shërbimi/produkti dhe përgjigje nga shitës të përshtatshëm; vetëm simulim.
- Shënjim reklamash/promovimesh; moderim listimesh; raportime; profil shitësi me transparencë.
- Flukse shembull për kthim, anulim, reklamim, provë dorëzimi dhe komision; JO transaksione reale.

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

## Rregulli i vazhdimësisë

Përdoruesi mund të shkruajë **“vazhdo”** për të kaluar te paketa pasuese. Shënojmë qartë `E IMPLEMENTUAR`, `E TESTUAR`, `PËR DEMO`, `PROPOZUAR` dhe `PËR PRODUKTIN REAL`. Nuk shpallim përqindje absolute të projektit pa kritere dhe prova të plota. Nuk bëhet merge në `main` ose publikim në Production pa vendim të veçantë.
