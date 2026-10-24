# ILLYRIAN — Independent Product Innovation & Strategic Review

**Datë:** 23 tetor 2026. **Status:** studim i pavarur; propozime për shqyrtim, jo vendime të miratuara. **Fusha:** produkt, pozicionim, inovacion, ekonomi, arkitekturë dhe rend zhvillimi. Vetëm lexim, kërkim dhe raportim; pa ndryshime në projekt, GitHub, roadmap ose Production.

## 1. Përfundimi strategjik

Illyrian ka një vizion koherent për një ekosistem shqiptar dhe diasporik, por ende nuk ka provë që përdoruesit do ta zgjedhin për një nevojë konkrete kundrejt mjeteve që përdorin sot. DEMO-ja provon shumë ndërveprime; nuk provon kërkesë tregu, furnizim real, mbajtje përdoruesish ose ekonomi të qëndrueshme.

**Rekomandimi kryesor është të ruhet vizioni i integruar, por hyrja në treg të kufizohet te një rezultat i matshëm në një komunitet lokal të arritshëm.** Për shembull: “gjej një aktivitet ku mund të shkoj edhe pa njohur askënd” ose “marr përgjigje të dobishme nga një ofrues që është realisht i disponueshëm”. Këto janë alternativa për testim, jo dy vertikale që duhen zhvilluar paralelisht.

Një formulim i mundshëm i premtimit është: **Illyrian të ndihmon ta kthesh një nevojë ose interes lokal në diçka që realizohet, përmes njerëzve dhe bizneseve të arritshme.** Ky është propozim pozicionimi. Nuk e zëvendëson vizionin ekzistues dhe kërkon testim me përdorues.

Përparësia e mundshme nuk është kombinimi i feed-it, chat-it dhe shpalljeve: këto mund të riprodhohen lehtësisht. Është bashkimi i ofertës lokale aktive, koordinimit të mirë, gjuhës së përshtatshme dhe provave të kufizuara por të besueshme për çfarë ka ndodhur realisht. Asnjë avantazh i tillë nuk është ende i provuar.

### Tre ndryshimet me ndikimin më të madh

1. **Nga shumë qytete/kategori te një komunitet lokal me një nevojë të qartë.** Dendësia e përgjigjeve dhe pjesëmarrjes ka përparësi ndaj numrit të moduleve.
2. **Nga regjistrimi/instalimi si hyrje te një lidhje që çon drejt veprimit.** Përdoruesi sheh fillimisht vlerën publike; identifikohet kur kërkon të marrë pjesë ose të kontaktojë.
3. **Nga interesimet dhe listimet te përfundimi dhe përsëritja.** Mat takim të realizuar, përgjigje të përshtatshme, disponueshmëri të rikonfirmuar dhe rikthim pas një rezultati. Mos e barazo klikimin me vlerën.

## 2. Baza faktike dhe kufijtë e provës

### Gjendja e lexuar drejtpërdrejt

| Elementi | Evidenca e këtij studimi | Çfarë nuk provon |
|---|---|---|
| Repository | `titanfit102-bit/Illyrian`, PUBLIC sipas API-së GitHub | Privatësi të kodit ose gatishmëri për publikim |
| Dega aktive e shqyrtuar | `feat/i18n-shop-feedback-20261022`, snapshot `6fb4bd696e0b9f1115691c03eb171e5a8ca3e445` | Se ndryshimet janë integruar në degën DEMO |
| PR #1 | OPEN, DRAFT, UNMERGED; target `demo/v1.7-illyrian-shop` | Merge ose release |
| Baza DEMO / main | `015ce439e7c6d736149c6c300391586517664f62` / `9f91b5c083b4482a70a2149483cc799360e6102c` gjatë kontrollit | Gjendje të ardhshme të degëve |
| Testet e fundit të referuara nga CURRENT_STATE | Run `40012871234`, SHA `5940e1d9130a928d0b917c7022db945f849c8412`; metadata dhe logu u lexuan: **157 passed, 3.4m** | Validim tregu, siguri reale multi-user, telefon fizik ose mbulim të plotë UI |
| Implementimi | HTML, vanilla JS, module dhe localStorage; social UI, Plans, Connections, Shop, Shop Plus, Privacy/Map, Governance | Backend, identitet real, databazë e përbashkët, moderim ose transaksione reale |
| Ndërkombëtarizimi | sq/en/it; CURRENT_STATE raporton 550 çelësa/gjuhë dhe 15 namespace | Përkthim të plotë të çdo gjendjeje ose mbështetje reale për 100+ gjuhë/RTL |
| Preview | CURRENT_STATE shënon se SHA/statusi aktual nuk janë verifikuar për shkak të autorizimit Vercel | Nuk deklarohet që Preview mungon ose përputhet me snapshot-in |

Burime GitHub të fiksuara: [G1–G8]. Ky është rifreskim i gjendjes pas auditit teknik të mëparshëm. Nuk janë riklasifikuar automatikisht si aktuale defektet e atij auditi që dokumentacioni i ri i shënon të korrigjuara. Ky studim nuk pretendon ritestim teknik të plotë.

### Çfarë ekziston tashmë dhe çfarë do të përmirësohej

| Fusha | Ekziston në DEMO | Drejtimi ekzistues për produktin real | Delta e propozuar në këtë raport |
|---|---|---|---|
| Lidhjet lokale | “Dy vendet e mia”, “Nga interesi te plani”, “Hera e parë”, “Organizo sërish”, bashkëpunim me rezultat | Komunitet, plane, privatësi, identitet i përbashkët | Disponueshmëri me afat, host përgjegjës dhe matje të pjesëmarrjes/përsëritjes |
| Eventet | Kërkesa, kapacitet, pritje, pranim/refuzim, anulim, bisedë, pjesëmarrje simuluese | Transaksione reale të kapacitetit dhe autorizim serveri | Koordinim i grupeve të vogla dhe trajtim i mungesave pa reputacion publik ndëshkues |
| Marketplace | Produkte, makina, qira, shërbime, filtra, katalogë dhe krahasim SKU fiktive | Një model Seller/Organization → Shop → Listing | Ofertë e rikonfirmuar, krahasim kushtesh dhe vetëm një kategori në pilot |
| “Kërkoj…” | Kategori/qytet/buxhet, skadim 7/14/30 ditë dhe përgjigje shitësi në simulim | Inquiry, jo checkout për makina/qira/shërbime | Kërkesë e strukturuar te pak ofrues të përshtatshëm, përgjigje të krahasueshme dhe rezultat i konfirmuar |
| Besimi/moderimi | Shpjegime statusi, raportim, apelim, role dhe histori lokale demonstrative | Autorizim, audit, bllokim, verifikim proporcional | Pretendime me burim, fushë dhe datë; operim me përgjegjës real |
| Gjuhët | sq/en/it, kode semantike, përjashtim i përmbajtjes së përdoruesit nga përkthimi UI | Arkitekturë e zgjerueshme ndërkombëtare | Fjalor kërkimi sipas detyrës; gjuhë, monedhë dhe zonë kohore si koncepte të ndara |

Nuk propozohet shpikja nga e para e këtyre funksioneve. Puna e vlefshme është kalimi i përzgjedhur nga simulimi në shërbim të përdorshëm, me prova për rezultatin.

### Vendime që duhen ruajtur

Blueprint §10 ka parime të pranuara: një ekosistem, identitet me role të kufizuara, autorizim serveri, identifikues të qëndrueshëm, bazë e përbashkët për privatësi/njoftime/moderim, katalog i vetëm real dhe ndarje e pagesave nga listimet. Ruaji. React Native/Expo, PWA dhe ofruesi backend mbeten kandidatë. Tregu i parë, përzierja MVP, buxheti, modeli i biznesit dhe pagesat janë ende vendime të hapura [G3].

Komisioni 5% në DEMO nuk është çmim i miratuar. Nuk ka autorizim për subscriptions, escrow, payout, pagesa, infrastrukturë ose publikim.

## 3. Çfarë na mëson tregu — dhe çfarë nuk na mëson

U shqyrtuan burime zyrtare produktesh, një raportim origjinal për mashtrime dhe burime institucionale. Dokumentacioni i konkurrentit provon mekanizma të deklaruar; nuk provon kënaqësi, rentabilitet ose sukses për audiencën e Illyrian.

| Produkti/burimi | Mekanizmi i verifikuar | Mësimi për Illyrian | Kufiri |
|---|---|---|---|
| WhatsApp Communities [S1] | Evente dhe organizim brenda komuniteteve; përgjigje ndaj njoftimeve | Një grup me evente nuk mjafton si diferencim. Duhet koordinim ose zbulim më i dobishëm | Nuk është provë se shqiptarët do të braktisin grupet e tyre |
| Partiful [S2] | Ftesë me lidhje, RSVP pa instalim aplikacioni, detaje dhe përditësime në një vend | Hyrje e drejtpërdrejtë te një veprim; ul barrën e kalimit në një produkt të ri | “Pa app” nuk do të thotë pa identifikim ose autorizim |
| Meetup [S3] | Ndan regjistrimin, praninë, mosparaqitjen dhe listën e pritjes | RSVP dhe pjesëmarrja duhen matur veçmas; kapaciteti është problem operativ | Politikat e tij të prioritetit dhe dukshmërisë nuk duhen kopjuar automatikisht |
| Timeleft [S4] | Deklaron grupe 4–6 vetash, vende publike të përzgjedhura dhe kontrolle/reportim | Vlera mund të vijë nga koordinimi dhe përgatitja e takimit | Nuk përdoren pretendimet e vetë kompanisë për norma sigurie si provë e pavarur |
| ProntoPro [S5] | Regjistrim falas; mundësi kontakti me kosto të ndryshueshme; ofruesi zgjedh kujt përgjigjet | Monetizimi i kontakteve është i mundur, por kërkon cilësi të matshme | Rreziku i shitjes së kontakteve pa vlerë është inferencë për modelin, jo akuzë ndaj kompanisë |
| Vinted UK [S6] | Feedback pas porosisë së përfunduar; mbrojtja e blerjes lidhet me rrjedhën Buy now | Reputacioni duhet të lidhet me një ndërveprim të përcaktuar; mbrojtja kërkon operim real | Illyrian me inquiry nuk mund të premtojë mbrojtjen e një platforme pagesash |
| MerrJep.al [S7] | Listime private/biznesi, kategorizim dhe rregulla për përmbajtjen | Vetëm katalogu me shumë kategori nuk krijon avantazh të ri | Shqipëria dhe Kosova kanë faqe/kushte të ndryshme; nuk përgjithësohen shërbimet mes tyre |
| Radio Evropa e Lirë, 12 korrik 2026 [S8] | Rast shitësi të kontaktuar pas shpalljes, link i rremë pagese dhe kërkesë për të dhëna karte | Mashtrimi mund të ndodhë në komunikimin pas shpalljes. Emri/fotoja shqiptare nuk janë provë besimi | Rast i raportuar, jo matje e përhapjes së mashtrimeve |

INSTAT ka publikimin “Diaspora e Shqipërisë në shifra, 2025” [S9]. Madhësia demografike nuk përkthehet vetvetiu në përdorues të arritshëm. Ky studim nuk jep një TAM numerik: shtetësia, vendlindja, origjina dhe gjuha nuk janë popullata që mund të mblidhen pa kontroll metodologjik; statistikat për Shqipërinë nuk përfaqësojnë të gjithë shqiptarët e Kosovës ose të diasporës.

**Mungesa kryesore e provës:** nuk ka në bazën e shqyrtuar intervista të reja të kryera nga ky studim, të dhëna konvertimi nga përdorues realë, lista ofruesish të angazhuar ose pagesa reale. Prandaj preferencat e audiencës dhe gatishmëria për të paguar mbeten hipoteza.

## 4. Mangësitë strategjike që meritojnë vëmendje

Këto janë mangësi të provës dhe përgatitjes së produktit; nuk janë të gjitha funksione të harruara ose gabime kodi.

| Fusha | Gjendja/boshllëku i vërejtur | Pse ka rëndësi dhe pasoja nëse neglizhohet |
|---|---|---|
| Hyrja në treg | Tregu dhe përzierja MVP janë OPEN; DEMO mbulon shumë sjellje | Audiencë e shpërndarë → feed bosh, evente pa pjesëmarrje dhe kërkesa pa përgjigje |
| Onboarding/identitet | Parimet e identitetit janë projektuar; metoda dhe rruga reale nuk janë vendosur | Instalimi, formularët e gjatë ose verifikimi i tepërt mund ta konsumojnë interesin para vlerës së parë |
| Komunitetet | Ka UX për interes, host dhe përsëritje; jo furnizim të konfirmuar me organizatorë | Pa host që rikthehet, platforma mbetet kalendar që e mbush vetëm themeluesi |
| Marketplace/shërbimet | Shumë kategori në DEMO; mungon ofertë reale e validuar | Nuk dihet cili problem meriton produkt; makina/qira kanë rrezik dhe cikël vendimi tjetër nga produkte të vogla |
| Besimi | Shpjegime të ndershme demo; pa prova reale identiteti/veprimtarie/rezultati | Një badge i përgjithshëm mund të krijojë siguri të rreme dhe përgjegjësi operative |
| Privatësia/moderimi | Janë kërkesa të blueprint-it, pa operim real | Butoni “raporto” pa person përgjegjës, orar dhe procedurë nuk ndihmon kur ndodh incidenti |
| Kërkimi/zbulimi | Filtra dhe i18n ekzistojnë; nuk ka të dhëna kërkimesh reale/rezultatesh bosh | Përkthimi i menysë nuk zgjidh termat e ndryshëm për të njëjtin shërbim ose mungesën e ofertës |
| Njoftimet/rikthimi | Fondacion i propozuar, jo cikël real i matur | Njoftime për likes mund të sjellin zhurmë, ndërsa përdoruesi humb përgjigjen ose afatin e veprimit |
| Telefoni/aksesueshmëria | Teste Chromium; QA fizike dhe screen reader mbeten të hapura | Një rrugë që ngec në telefon e bën të pavlefshëm fitimin nga marketingu |
| Shumëgjuhësia/zgjerimi | sq/en/it dhe arkitekturë e zgjerueshme; vendimet e tregut të hapura | Gjuhët shtojnë edhe kërkim, support, moderim, data dhe kushte lokale; nuk janë vetëm skedarë përkthimi |
| Operimi | Audit/role të projektuara; mungojnë prova kapaciteti real support-i | Një operator mund të bëhet kufiri i rritjes para serverit; çmimi mund të mos mbulojë punën manuale |
| Monetizimi | Asnjë model i validuar; 5% ilustrues | Të ardhurat e parashikuara nga një rrjedhë pa pagesa/prova do të jepnin vendime të gabuara investimi |

Për një pilot me takime mes të panjohurve, propozohet fillimisht audiencë 18+, vende publike dhe host i përcaktuar. Ky kufi i ri kërkon miratim; nuk është politikë tashmë e pranuar. Mos e zgjidh moderimin duke kërkuar publikisht dokumente, adresë shtëpie ose origjinë etnike. Marka shqiptare mund të ruhet pa e përdorur përkatësinë si certifikatë besueshmërie.

## 5. Tetë mundësitë më të vlefshme

### Renditja dhe kuptimi i kostove

Renditja është gjykim strategjik mbi përputhjen me projektin, ndikimin e mundshëm dhe varësitë; nuk është rezultat eksperimentesh. “Provë e jashtme” më poshtë provon mekanizmin, jo kërkesën për Illyrian. O2 dhe O3 janë **alternativa për vertikalen e parë**. Mos mblidh të gjitha kostot si plan të miratuar.

Vlerësimet janë **ditë pune inxhinierike shtesë**, rreth 8 orë/ditë, pasi ekzistojnë identiteti real, autorizimi, modeli bazë, deployment-i dhe testet themelore. Përfshijnë implementim të vogël dhe QA përkatëse; jo ndërtimin e gjithë platformës, aplikacionit native, shqyrtimin ligjor ose support-in e vazhdueshëm. Intervali €200–€400/ditë është supozim planifikimi i këtij raporti, jo ofertë tregu. Puna e vetë themeluesit ka kosto kohe. Përpara zhvillimit duhet rivlerësim mbi specifikim konkret.

| Rend | Mundësia | Ndikimi i mundshëm | Përpjekja / ekuivalenti i supozuar | Vështirësia / rreziku | Prova dhe prioriteti i propozuar |
|---|---|---|---|---|---|
| 1 | O1: Hyrje me lidhje drejt veprimit | I lartë për aktivizim/shpërndarje | 3–6 ditë / €600–€2,400 | E ulët–mesatare / privatësi | Partiful + deep links në blueprint; P1-R |
| 2 | O3: “Kërkoj…” me përgjigje të kufizuara e të krahasueshme | I lartë nëse ka ofertë aktive | 8–15 ditë / €1,600–€6,000 | Mesatare / furnizim dhe support | Funksion ekzistues + ProntoPro; validim P0, ndërtim P1 vetëm nëse zgjidhet |
| 3 | O2: Grupe të vogla sipas kohës dhe gatishmërisë | I lartë për komunitet/përsëritje | 6–12 ditë / €1,200–€4,800 | Mesatare / siguri dhe host | Connections ekzistuese + Timeleft/Meetup; alternativë P1 |
| 4 | O4: Besim me prova të kufizuara sipas fushës | I lartë për cilësi/rrezik | 8–15 ditë / €1,600–€6,000 | Mesatare–e lartë / privatësi dhe apel | Blueprint + Vinted + rast mashtrimi; minimumi P0-R, zgjerimi P2 |
| 5 | O5: Disponueshmëri e rikonfirmuar | Mesatar–i lartë; vlerë me pak kompleksitet | 3–5 ditë / €600–€2,000 | E ulët–mesatare / saktësi e pretendimit | Afatet ekzistuese; përfitimi kërkon matje; P1 për vertikalen Shop |
| 6 | O8: Rikthim për veprime të dobishme | Mesatar–i lartë | 3–5 ditë / €600–€2,000 | E ulët–mesatare / spam | Blueprint + mekanizma eventesh; minimumi P1, digest P2 |
| 7 | O7: Kërkim sipas detyrës në sq/it/en | Mesatar, kur ka ofertë | 4–8 ditë / €800–€3,200 | Mesatare / sinonime të gabuara | i18n ekzistues; kërkesa lokale ende hipotezë; P2 |
| 8 | O6: “Dy vendet” me qëndrim të përkohshëm | Potencial diferencimi diasporik | 3–6 ditë / €600–€2,400 | Mesatare / privatësi dhe fragmentim | Koncept ekzistues; delta pa validim; P2/P3 |

O4 nuk është i katërti në rendin e sigurisë: kontrollet bazë të besimit/abuzimit janë varësi për çdo pilot. Renditja dallon potencialin e produktit nga rendi i detyrueshëm i ndërtimit.

### O1 — Një lidhje që të çon te vlera, pastaj identifikim proporcional

**Problemi:** askush nuk ka arsye të instalojë një platformë të re vetëm sepse ka shumë funksione. **Përdoruesit:** persona të ftuar nga hosti, klientë që shohin një ofertë dhe anëtarë të grupeve ekzistuese.

**Mekanizmi:** një faqe publike e lejuar për eventin/listimin tregon çfarë, ku përafërsisht, kur, kushtet, hostin/ofruesin dhe veprimin pasues. “Dua të marr pjesë” ose “Dërgo kërkesë” kërkon identifikim dhe kthehet në të njëjtin kontekst. Lejohet shpërndarja manuale e lidhjes në kanalet ku organizatori ka të drejtë; nuk propozohet import kontaktesh, scraping ose mesazhe automatike.

**Delta:** blueprint parashikon vizitor publik dhe deep links; propozimi i vendos në qendër të marrjes së përdoruesve. Listat private të pjesëmarrësve, adresat e ndjeshme dhe mesazhet nuk shfaqen në preview për rrjetet sociale. Anulimi/fshirja duhet të pasqyrohen edhe kur një lidhje shpërndahet më vonë.

**Vlera:** përdoruesi vendos pasi e ka parë vlerën; biznesi teston shpërndarjen pa ndërtuar një feed të madh. **Rreziku:** rrjedhje privatësie përmes metadata/cache, spam dhe humbje konteksti në login. **MVP:** faqe konceptuale ose prototip jashtë DEMO-s me një event dhe një kërkesë; test detyre me 5–8 persona, pastaj pilot i autorizuar. Mat veprim të vlefshëm / vizitorë unikë të përshtatshëm, jo instalime. **Arkitektura:** e përshtatshme me të dy klientët kandidatë; kërkon shtresë minimale web publike edhe nëse më vonë zgjidhet native.

### O2 — “Nga interesi te plani” me kohë të përputhshme dhe host që e realizon

**Problemi:** interesi i përbashkët nuk do të thotë që njerëzit janë të lirë në të njëjtën kohë ose ndihen rehat të shkojnë vetëm. **Përdoruesit:** persona të rinj në qytet, diaspora, punonjës me turne dhe organizatorë lokalë. Preferencat e këtyre segmenteve janë hipoteza për intervista, jo fakte të matur.

**Mekanizmi:** përdoruesi zgjedh një aktivitet dhe dy intervale të përafërta për javën. Disponueshmëria skadon. Kur ka një grup të vogël të interesuar, hosti merr draft dhe konfirmon kohën/vendin. “Hera e parë” shpjegon kë do të gjesh, shenjën e takimit dhe si të largohesh pa presion. Rikonfirmimi dhe anulimi lirojnë vendin; lista e pritjes nuk pranohet fshehurazi automatikisht. Pas aktivitetit kërkohet feedback i shkurtër privat dhe ofrohet draft për përsëritje.

**Delta:** intervalet, pragu dhe drafti ekzistojnë në DEMO. Përmirësimi është koordinimi me njerëz realë, përgjegjësia e hostit, skadimi i interesit dhe matja e realizimit. Nuk kërkohet AI për përputhje personalitetesh. Nuk publikohet orari i punës, punëdhënësi ose etiketa “nuk ka miq”.

**Vlera:** më pak ankth dhe koordinim; hosti merr grup më të përshtatshëm; platforma mund të fitojë përsëritje. **Rreziku:** mosparaqitje, ngacmime, barrë organizimi; grupe tepër të segmentuara mbeten bosh. **MVP:** dy hostë, katër aktivitete gjithsej në vend publik, koordinim manual dhe orare të kufizuara. Mos premto grup të garantuar. **Arkitektura:** Plans/Connections plus afat interesi dhe njoftime; kapaciteti dhe anëtarësimi kërkojnë transaksione serveri. Nuk nevojitet motor rekomandimesh.

### O3 — “Kërkoj…” si rrjedhë e kontrolluar kërkesë → përgjigje → hap i konfirmuar

**Problemi:** kërkuesi nuk do një listë të gjatë; do dikë të përshtatshëm që përgjigjet dhe mund ta kryejë punën. **Përdoruesit:** persona me një nevojë konkrete dhe ofrues të vegjël lokalë.

**Mekanizmi:** vetëm një kategori fillestare, p.sh. riparime të vogla, pas kontrollit të përgjegjësive. Formulari mbledh detyrën, zonën, kohën, buxhetin dhe kufizimet. Kërkesa u propozohet deri në tre ofrues të përshtatshëm që kanë pranuar të marrin kërkesa. Përgjigjja ndan çmimin orientues, çfarë përfshihet, disponueshmërinë dhe kushtet. Shfaqen “pa përgjigje”, “nuk përputhet” dhe “mbyllur”. Të dyja palët mund të konfirmojnë një hap pasues; kjo nuk provon pagesën ose cilësinë e punës.

**Delta:** “Kërkoj…” dhe përgjigjet ekzistojnë. E reja është kufizimi i shpërndarjes, formati i krahasueshëm, përgjigjja brenda një dritareje të deklaruar dhe matja e rezultatit. Jo ankand masiv dhe jo shitje automatike e çdo kontakti.

**Vlera:** më pak telefonata të kota për klientin; më pak kërkesa pa lidhje për ofruesin. Mund të mbështesë mjete pune me pagesë më vonë. **Rreziku:** mungesë ofruesish, marrëveshje jashtë platformës, pretendime për cilësi, të dhëna sensitive në përshkrim. Mos kërko adresa të plota ose dokumente në postimin publik. **MVP:** pesë ofrues me pëlqim, dhjetë kërkesa reale të pranueshme, drejtim manual, pa tarifë/pagesë. Mos fabriko kërkesa për të mbushur kampionin. **Arkitektura:** zgjatim i inquiry/request dhe seller scopes; formati i ofertës ndahet nga listing, order dhe payment. Koordinimi manual provon nevojën përpara automatizimit.

### O4 — Besim i shpjegueshëm sipas fushës, pa pikëzim të përgjithshëm social

**Problemi:** një përdorues mund të jetë host i mirë, por jo shitës i verifikuar; email-i i konfirmuar nuk provon identitet ligjor ose aftësi profesionale. **Përdoruesit:** të gjitha palët, sidomos blerësit dhe moderatorët.

**Mekanizmi:** sinjale të ndara: kontakt i konfirmuar; pronësi biznesi e kontrolluar me metodë/datë; pjesëmarrje e deklaruar nga hosti; ndërveprim i konfirmuar nga palët. Secila tregon burimin, fushën, afatin dhe çfarë nuk garanton. Provat sensitive mbahen jashtë profilit publik dhe vetëm aq sa nevojiten. Raportet kanë përgjegjës, arsye, kufizim aksesi dhe apel; historiku i rasteve nuk bëhet spektakël publik.

**Delta:** Governance tashmë demonstron shpjegime të ndershme; rekomandimi i kthen në kontrata prove dhe procedurë reale. Review pas kontakti nuk etiketohet “blerje e verifikuar”. Një rekomandim nga komuniteti nuk zëvendëson kontrollin e biznesit. Pagesa nuk blen badge besueshmërie.

**Vlera:** pritshmëri më të sakta dhe më pak siguri e rreme. **Rreziku:** shpifje, hakmarrje, diskriminim, verifikim i falsifikuar dhe kosto shqyrtimi. **MVP:** kontroll manual i pesë bizneseve me kriter të shkruar, karta shpjeguese dhe feedback privat pas ndërveprimit; pa sistem yjesh publik derisa të ketë bazë dhe apelim. **Arkitektura:** identitet i vetëm, prova me scope; jo score global i përdoruesit. Kontrollet bazë të raportimit/bllokimit janë të domosdoshme para pilotit; regjistri i avancuar i reputacionit mund të presë.

### O5 — Përditësia e ofertës si premtim produkti

**Problemi:** listimi që duket aktiv por ka përfunduar e detyron përdoruesin të humbasë kohë. Kjo është hipotezë e arsyeshme produkti; shpeshtësia lokale duhet matur. **Përdoruesit:** blerës, qiramarrës, kërkues shërbimesh dhe shitës.

**Mekanizmi:** çdo ofertë ka datë përditësimi, afat dhe status të qartë. Ofruesi rikonfirmon me një veprim; pa përgjigje, oferta del nga rezultatet aktive. Para kontaktit, çmimi “nga” dhe përjashtimet shpjegohen. Makina/qira mbeten informacion dhe kërkesë; “e rikonfirmuar sot nga shitësi” nuk do të thotë “rezervim i garantuar nga Illyrian”.

**Delta:** skadimi i kërkesave dhe inventari demonstrues ekzistojnë. Propozimi shton ritëm operativ për përditësinë e listimeve. Nuk ndërton sinkronizim stoku me çdo dyqan.

**Vlera:** më pak kontakte të pavlefshme; ofruesi nuk merr kërkesa për ofertë të mbyllur. **Rreziku:** fshehje e ofertës ende valide ose badge që interpretohet gabim. **MVP:** për 20 oferta të autorizuara mat përputhjen mes statusit dhe përgjigjes së ofruesit; përdor afate sipas kategorisë. **Arkitektura:** `updated_at`, `available_until`, status dhe njoftim; cache/search duhet të respektojnë skadimin. Versionimi serveri shmang rikthimin e një oferte të mbyllur nga klienti i vjetër.

### O6 — “Dy vendet e mia” me kontekst të përkohshëm vizite

**Problemi:** nevoja ndryshon kur je në qytetin ku jeton dhe kur planifikon një qëndrim të shkurtër në vendlindje. **Përdoruesit:** diaspora dhe udhëtarë që ruajnë lidhje me dy qytete.

**Mekanizmi:** përveç dy qyteteve ekzistuese, përdoruesi mund të zgjedhë privatisht “do të jem atje gjatë këtij intervali” dhe të ruajë një event ose kërkesë që përputhet. Konteksti skadon. Nuk shfaqet kalendari publik i udhëtimit ose fakti se shtëpia mbetet bosh.

**Delta:** dy qytetet janë të implementuara në DEMO; ndryshimi është qëllimi me afat, jo një hartë e re. **Vlera:** përgatitje përpara vizitës dhe lidhje më konkrete diasporike. **Rreziku:** nevojë sezonale, privatësi udhëtimi dhe shpërndarje e ofertës në dy tregje të pambushura. **MVP:** 8–10 intervista për vizitën e fundit dhe një listë manuale të përzgjedhur për datat e ardhshme; pa zhvillim fillestar. **Arkitektura:** preferencë private me afat dhe zonë kohore; nuk justifikon pagesa ndërkufitare, remitanca, transport pakosh nga individë ose zgjerim masiv. Aktivizohet vetëm pasi një treg lokal funksionon.

### O7 — Kërkim shumëgjuhësh që kupton detyrën, pa AI të parakohshme

**Problemi:** përdoruesi mund ta kërkojë të njëjtin shërbim me term shqip, italisht, variant pa ë/ç ose shprehje të zakonshme. UI e përkthyer nuk e zgjidh këtë. **Përdoruesit:** diaspora, bizneset dhe përdorues dygjuhësh.

**Mekanizmi:** kategori kanonike, fjalor i vogël sinonimesh dhe shembuj të kërkimit; filtra për zonë, afat dhe gjuhë shërbimi. Renditja fillon me përshtatjen ndaj detyrës dhe disponueshmërinë, me shpjegim të shkurtër. Rezultati bosh ofron ndryshim zone/afati ose “Kërkoj…”, pa e zgjeruar fshehurazi kërkesën.

**Delta:** ruhet i18n dhe përmbajtja origjinale. Nuk ndryshohen emrat/titujt e përdoruesve për të “përkthyer kërkimin”. Përkthimi automatik i UGC, nëse provohet më vonë, është opsional dhe i shënuar, me origjinalin të arritshëm.

**Vlera:** më pak rezultate bosh për të njëjtën ofertë reale. **Rreziku:** sinonime që bashkojnë profesione/kushte të ndryshme; kërkim i mirë mbi katalog bosh sërish dështon. **MVP:** 30 terma nga intervistat dhe kërkime të redaktuara, kontroll manual i rezultateve. **Arkitektura:** taksonomi dhe alias-e mbi bazën relacionale; pa vector DB në pilot. Data e çmimit ruan monedhën ISO dhe njësitë e sakta; gjuha, vendi dhe zona kohore nuk barazohen mes tyre.

### O8 — Rikthim për shkak të një veprimi të vlefshëm

**Problemi:** rikthimi nuk duhet blerë me njoftime të shpeshta që nuk ndihmojnë përdoruesin. **Përdoruesit:** pjesëmarrës, hostë, kërkues dhe ofrues.

**Mekanizmi:** fillimisht konfirmim, ndryshim/anulim, përgjigje e re dhe afat që kërkon veprim. Më vonë, një përmbledhje javore me deri në tre gjëra të përzgjedhura për qytetin/interesin e zgjedhur; preferenca, orar qetësie dhe çregjistrim i lehtë. Hostit i shfaqet puna që duhet bërë, jo një dashboard i ri me numra pa kuptim.

**Delta:** njoftimet janë fondacion i pranuar në blueprint. Propozimi përcakton përmbajtjen dhe metrikën: veprim i kryer pas mesazhit, jo vetëm hapje. **Vlera:** më pak aktivitete të humbura dhe barrë më e ulët organizimi. **Rreziku:** mesazhe të dyfishta, njoftime për përmbajtje tashmë private/anuluar dhe spam. **MVP:** preferenca të deklaruara, një përmbledhje manuale e autorizuar dhe krahasim përshkrues me javën e mëparshme; kampioni i vogël nuk provon shkakësi. **Arkitektura:** evente të versionuara, deduplikim, kontroll aksesi në dërgim dhe preferenca; kanali zgjidhet pasi të vlerësohen kostoja dhe lejet. SMS nuk bëhet parazgjedhje.

## 6. Çfarë të ruajmë, përmirësojmë, shtojmë ose shtyjmë

| Veprimi i propozuar | Përmbajtja | Arsyeja |
|---|---|---|
| Ruaj pa ndryshuar parimet | Ekosistemin e integruar, markën, historikun DEMO, rolet me scope, ID kanonike, sq/en/it, katalogun e vetëm real, gates e pagesave | Janë koherente me problemin dhe shmangin rishkrime të panevojshme |
| Përmirëso | Matjen M0, lidhjet drejt veprimit, përgjegjësinë e hostit/ofruesit, përditësinë e ofertës, operimin e raporteve | Këtu vizioni bëhet rezultat i matshëm |
| Shto vetëm pas miratimit | Kontrata minimale për kërkesë/ofertë/rezultat, afate dhe prova besimi; eksperimentet e këtij raporti | Zgjatin domain-in ekzistues; nuk krijojnë platformë të dytë |
| Shty për më vonë | Reels/video të plota, DM i pakufizuar, katër dashboard-e, shumë kategori të njëkohshme, përkthim masiv UGC, qytete të shumta | Shtojnë media, abuzim, support dhe kosto pa provuar ciklin bazë |
| Mos ndërto për këtë tezë fillestare | Wallet/escrow vetjak, score social global, AI personaliteti, microservices, garanci pagese pa infrastrukturë, badge besimi me pagesë | Kompleksitet/rrezik i lartë dhe lidhje e dobët me provën fillestare |

Nuk propozohet fshirja e funksioneve nga DEMO-ja ose ndryshimi i vendimeve të pronarit. “Shty” do të thotë të mos futen në shtrirjen e parë të produktit real pa prova të reja.

## 7. Validimi përpara investimit në zhvillim

### Zgjedhja e qytetit dhe nevojës

Krahaso një qytet në Shqipëri/Kosovë me një komunitet diasporik të arritshëm personalisht. Mos zgjidh automatikisht tregun më të madh ose qytetin ku banon themeluesi. Përdor prova të dokumentuara për pesë kritere: akses te përdorues me nevojë të fundit; hostë/ofrues që pranojnë të marrin pjesë; frekuencë problemi; mundësi support-i/moderimi; arsye konkrete pse zgjidhja aktuale nuk mjafton. Pesha orientuese 30/25/20/15/10 është propozim për vendimmarrje, jo rezultat matjeje.

“Një qytet” mund të jetë ende tepër i gjerë: njësia e pilotit duhet të jetë një zonë e arritshme × një nevojë × një dritare kohe. Shtrirja ndërkombëtare vjen nga përsëritja e një modeli lokal që funksionon, jo nga aktivizimi i gjuhëve në shumë tregje bosh.

### Eksperimenti i propozuar, pa pagesa ose ndërtim të ri në DEMO

1. **Intervista:** rreth 20 gjithsej — 10 përdorues me nevojë reale të fundit, 5 hostë dhe 5 ofrues. Kërko shembullin e fundit: çfarë bëri, sa kohë humbi, çfarë nuk u realizua, çfarë pagoi tashmë. “A do ta përdorje?” nuk mjafton. Përfshi persona jashtë miqve të themeluesit dhe persona që përdorin zgjidhje ekzistuese me sukses.
2. **Testi i komunitetit:** dy hostë dhe katër aktivitete të vogla; orar/vend i qartë dhe pjesëmarrje e konfirmuar pa publikim të panevojshëm identitetesh.
3. **Testi i kërkesave:** në të njëjtën zonë, pesë ofrues dhe deri në dhjetë kërkesa reale të një kategorie; drejtim manual. Nëse nuk mblidhen dhjetë kërkesa, raporto numrin real dhe arsyen.
4. **Zgjidh një cikël për ndërtim:** vlerëso rezultatin, përsëritjen, punën manuale dhe rrezikun. Mos krahaso drejtpërdrejt “përqindje suksesi” të dy testeve si të ishin eksperimente identike.

Këto janë propozime eksperimentesh. Asnjë person nuk u kontaktua dhe asnjë eksperiment me përdorues nuk u krye në këtë studim.

### Metrikat dhe kriteret e vendimit

| Metrika | Emëruesi i domosdoshëm | Sinjal orientues për vazhdim — jo benchmark industrie |
|---|---|---|
| Aktivizim nga lidhja | Vizitorë unikë të përshtatshëm që e hapën | Përfundim i detyrës së synuar; ndaje nga login/instalim |
| Realizim eventi | Evente të planifikuara në pilot | P.sh. të paktën 3/4 realizohen me ≥4 pjesëmarrës realë secili |
| Përsëritje | Pjesëmarrës me dritare të plotë 28-ditore dhe mundësi reale për event të dytë | P.sh. ≥25% rikthehen; raporto edhe numrin, jo vetëm përqindjen |
| Pavarësi e organizimit | Hostë që e përfunduan eventin e parë | Të dy hostët provojnë një përsëritje pa organizim të plotë nga themeluesi |
| Kërkesë e shërbyer | Kërkesa që plotësojnë kriteret dhe afatin | P.sh. ≥7/10 marrin përgjigje të përshtatshme brenda 48 orësh |
| Hap pasues i konfirmuar | Të gjitha kërkesat e pranueshme, jo vetëm ato me përgjigje | P.sh. ≥4/10 me konfirmim nga palët; nuk quhet shitje e provuar |
| Barra operative | Kërkesa/evente të trajtuara, përfshirë dështimet | Regjistro minuta pune; synim provues ≤15 min/kërkesë, jo premtim publik |
| Gatishmëri për pagesë | Ofrues që kanë përjetuar vlerë reale | P.sh. 3/5 pranojnë test çmimi konkret; deklarata nuk llogaritet si e ardhur |

Pragjet duhen miratuar para testit për të mos ndryshuar kriterin pasi shihen rezultatet. Kampione kaq të vogla japin drejtim, jo siguri statistikore. Në testin e eventeve shëno sa pjesëmarrës janë miq të drejtpërdrejtë të themeluesit; dominimi i tyre dobëson provën e zbulimit organik.

**Ndalo ose ndrysho hipotezën** nëse, pas dy cikleve me ofertë të përgatitur, më pak se gjysma e kërkesave të pranueshme marrin përgjigje; hostët nuk duan të përsërisin; puna manuale shkon rregullisht mbi 30 minuta/kërkesë pa model ekonomik; ose kërkesa kryesore del jashtë shërbimit të zgjedhur. Një incident serioz kërkon shqyrtim dhe pezullim të rrjedhës përkatëse, jo optimizim të marketingut. Mungesa e incidenteve në një pilot të vogël nuk provon siguri.

**Buxhet prove i propozuar:** 4–6 javë kalendarike, rreth 24–40 orë të themeluesit dhe tavan shpenzimi €150–€400 vetëm nëse miratohet veçmas. Afati nuk është premtim që do të gjenden pjesëmarrësit. Nuk përfshin subvencionim vaktesh, tarifa ligjore ose zhvillim produkti; mekanizmat mund të testohen manualisht. Nuk është autorizim shpenzimi.

## 8. Arkitektura e propozuar — shtesa të vogla mbi drejtimin ekzistues

Nuk rekomandohet stack i ri. Ruaj backend modular relacionar dhe një identitet me autorizim sipas objektit. Framework-u dhe ofruesi përzgjidhen pas M0 dhe vlerësimit të aftësive/buxhetit.

| Koncepti minimal i propozuar | Fushat/rregullat kryesore | Varësia dhe kufiri |
|---|---|---|
| Qëllim/disponueshmëri | Lloj, qytet, dritare kohe, dukshmëri, `expires_at` | Privat si parazgjedhje; nuk ruan të gjithë kalendarin e punës |
| Kërkesë/ofertë | Kategori, zonë, kushte, status, afat, ofrues i autorizuar, version | Zgjeron inquiry; nuk e kthen ofertën në order/payment |
| Rikonfirmim listimi | Koha, deklaruesi, afati, status | Deklarim i shitësit; jo provë e inventarit fizik |
| Provë besimi | Subjekti, fusha, metoda, kontrolluesi, data/skadimi, dukshmëria | Akses i kufizuar; prova sensitive nuk shkon te analytics publik |
| Konfirmim rezultati | Referencë domain-i, deklaruesi, statusi dhe koha | RSVP ≠ attendance; kontakt ≠ punë e kryer; nuk bashkon reputacionet |
| Njoftim i lejuar | Event, marrës, çelës deduplikimi, preferencë, gjendje dërgimi | Rishiko aksesin në dërgim; mos ekspozo përmbajtje private në push |

Përdor kontrata eventesh për matje si `request_created`, `qualified_reply_received`, `attendance_confirmed` dhe `outcome_reported`, me versione dhe emërues. Këto janë shembuj propozimi, jo kontrata të miratuara. Eventet mbeten të dalluara sipas domain-it; një shërbim i realizuar dhe një kafe komunitare nuk shndërrohen në të njëjtën pikë besimi.

Për pilotin mund të mjaftojë tekst dhe fotografi me kufij madhësie. M2 nuk duhet të interpretohet se kërkon domosdoshmërisht video/transcoding për të provuar komunitetin. Nuk nevojiten microservices, vector search, model ML, sinkronizim magazinash ose indeks kërkimi i jashtëm përpara matjeve që i justifikojnë.

**Mobile dhe aksesueshmëri:** rrugë e plotë me tastierë, TalkBack/VoiceOver, tekst të zmadhuar, kontrast/fokus të dukshëm, mesazhe gabimi dhe riprovim pa dublim. Provo pajisje reale dhe lidhje të dobët; ruajtja e draftit nuk duhet të ruajë sekrete në pajisje të përbashkët. Për faqet web, objektiva të propozuara janë p75 LCP ≤2.5s, INP ≤200ms dhe CLS ≤0.1 sipas udhëzimit Google [S11]. Këto nuk janë matje të arritura nga Illyrian dhe nuk zëvendësojnë testet e detyrës në native.

**Siguria dhe operimi para pilotit:** izolim përdoruesish, bllokim, rate limits, raportim që shkon te një përgjegjës, minimizim të dhënash, backup/restore, log-e pa sekrete dhe procedurë incidenti. Përcakto orar real support-i; mos premto 24/7. Për tregun e zgjedhur kërko vlerësim profesional për detyrimet e zbatueshme. Komisioni Europian shpjegon se DSA mbulon ndërmjetës/social/marketplace dhe se bizneset e vogla kanë përjashtime nga disa rregulla, jo përjashtim të përgjithshëm [S10]. Ky studim nuk certifikon përputhshmëri.

## 9. Ekonomia: monetizo vlerën që mund të provohet

**Mos fillo nga komisioni i DEMO-s.** Në një produkt inquiry, shitja mund të kryhet jashtë platformës dhe të mos jetë e provueshme. Një përqindje e sajuar mbi volum të panjohur nuk është model biznesi.

Rend i propozuar për testim: shërbim bazë falas për përdoruesin; pastaj mjete të dobishme për ofruesin/organizatorin që tashmë merr vlerë — menaxhim kërkesash, afate, katalog i përditësuar, përmbledhje rezultatesh agregate. Sponsorizimi lokal mund të provohet më vonë, i etiketuar dhe pa shitur besueshmëri. Çdo faturim/subscription kërkon vendim komercial e ligjor më vete. Pagesa për kontakt duhet shtyrë derisa të maten përshtatshmëria, kontakti i dyfishtë, mos-përgjigjja dhe politika e mosvlerës.

**Shembull matematikor, jo parashikim ose tarifë e propozuar për miratim:** nëse të ardhurat neto të supozuara për ofrues janë €20/muaj, kostoja variabile €3 dhe support-i 20 minuta me €18/orë, kontributi është €11. Për €200 kosto fikse duhen të paktën 19 ofrues që paguajnë. Për €1,500 kompensim të themeluesit plus ato €200 duhen të paktën 155, nëse kostot e tjera nuk rriten — supozim që duhet testuar. Nuk përfshihen taksa, kosto shtesë shitjeje, faturimi dhe rritja e support-it. Regjistrimi i 155 bizneseve nuk do të thotë 155 pagues.

Për çdo pilot mat kohën e hostit, kohën e operatorit, koston e marrjes së ofruesit, përqindjen e kërkesave pa ofertë dhe kontributin për ofrues. Për infrastrukturën nuk jepet një çmim mujor i verifikuar pa ofrues, volum, media dhe retention të dhënash të vendosura. Për llogaritje provuese mund të rezervohet tavan €50–€200/muaj për një pilot të vogël tekst/foto, **supozim buxhetor, jo kuotim vendorësh**, pa SMS/video/AI/pagesa dhe pa punë njerëzore. Kostoja e support-it mund ta kalojë shpejt atë të hosting-ut.

Arkitektura e aprovuar në parim ndihmon mirëmbajtjen: një katalog, një identitet, politika të përbashkëta. Duplikimi i Shop/Shop Plus në produktin real, panelet pa burim të përbashkët të dhënash dhe shërbimet e shumta do ta rrisnin koston përpara të ardhurave.

## 10. Roadmap i përmirësuar — propozim që mapohet te M0–M5

Roadmap-i ekzistues mbetet në fuqi. Propozimi më poshtë kërkon shqyrtim dhe miratim; nuk ka ndryshuar asnjë skedar të tij.

| Prioriteti | Gate ekzistues | Propozimi | Kushti për kalim |
|---|---|---|---|
| P0-D | Phase 7 DEMO | Mbyll vetëm punën e autorizuar të cilësisë dhe evidencës; ruaj gjuhët dhe rrugët ekzistuese | SHA/Preview i saktë, CI sipas politikës, review vizual/a11y/telefon dhe sign-off; jo module të reja inovacioni |
| P0 — produkt | M0 | Intervista, zgjedhje qyteti/nevoje, teste të vogla manuale O2/O3, përkufizim rezultatesh dhe buxheti | Zgjidhet një cikël me prova të dokumentuara; PRD i kufizuar dhe vendime të pronarit |
| P0-R | M1 + minimum M5 | Identitet/autorizim, publik/privat, report/block, audit, data lifecycle, operim incidenti dhe restore | Teste të izolimit, person përgjegjës dhe rrjedhë reale e sigurt para përdoruesve realë |
| P1-R | M2 OSE pjesë e M3 | O1 + vetëm vertikalja fituese O2 ose O3; O4 minimal dhe O8 transaksional; O5 nëse zgjidhet marketplace | Rezultat i parë nga dy përdorues realë, pa ndihmë të fshehur dhe me dështime të trajtuara |
| P1 — pilot | M2/M3 + M5 për shtrirjen | Pilot i mbyllur në një zonë; telefoni/a11y/performanca dhe incidentet trajtohen para zgjerimit | Përsëritje, ofertë e qëndrueshme, ngarkesë support-i dhe siguri në rrugët e zgjedhura |
| P2 | Zgjerim i M2/M3 | O7 nëse kërkimi dështon, O8 digest, prova besimi më të plota; provo lidhjen komunitet → ofrues | Prova që përdoruesit kërkojnë kalim mes moduleve; jo supozim që një llogari sjell vetvetiu cross-sell |
| P2/P3 | M0 i tregut të dytë | O6 dhe një komunitet/qytet i dytë; gjuhë e re vetëm kur ka ofertë dhe support | Modeli i parë përsëritet pa themeluesin si operator për çdo veprim |
| P3 | M4 + M5 | Pagesa/porosi reale, kategori me përgjegjësi më të lartë, native/video/realtime më i gjerë sipas nevojës | Miratim komercial/ligjor/ofruesish dhe prova kostoje; native mund të vijë më herët vetëm me arsyetim të matur |

**Ndryshimi më i rëndësishëm i rendit:** mos e interpreto M5 si punë që fillon vetëm pas M4. Kontrollet minimale të publikimit duhen brenda M1 dhe për çdo pilot; M5 i plotë mbetet gate final. Po kështu, formulimi historik “moderation/support pas Shop” nuk duhet të shtyjë report/block dhe përgjegjësin e support-it për pas hapjes së ndërveprimeve reale. Blueprint tashmë ka pjesë të këtyre kërkesave në M1; propozimi e bën varësinë operative të qartë.

Nëse testi i shërbimeve fiton, një pjesë e discovery/inquiry të M3 mund të paraprijë komunitetin e plotë M2, pas M1. Kjo është alternativë e propozuar rendi, jo leje për të anashkaluar gates ose për ta kthyer IllyrianShop në produkt të ndarë.

## 11. Avantazhet konkurruese të mundshme dhe kufijtë e tyre

**Të krijueshme:** rrjet i vogël hostësh/ofruesish që përgjigjen; ritme të përsëritshme aktivitetesh; taksonomi që pasqyron gjuhën reale të përdoruesve; informacion i përditësuar; procedura të besimit dhe zgjidhjes së problemeve; shpërndarje përmes lidhjeve që e ruajnë kontekstin. Këto forcohen nga përdorimi real dhe operimi i mirë.

**Të dobëta si mbrojtje më vete:** marka shqiptare, shumë skeda, badge, chatbot, feed i personalizuar dhe numër gjuhësh. Konkurrentët mund t'i kopjojnë ose tashmë i kanë. Identiteti kulturor mund të ndihmojë afërsinë dhe shpërndarjen; nuk garanton besim ose arsye për t'u rikthyer.

**Rreziku i mbingarkimit:** tetë mundësitë janë portofol vendimesh, jo backlog automatik. Për pilotin syno O1, minimumin e besimit/operimit dhe njërën nga O2/O3, me njoftimet e nevojshme. O5 hyn vetëm për ofertën reale; O6/O7/digest presin provë. Mos i shto të gjitha si “edhe pak punë”.

**Progresi:** nuk jepet përqindje përfundimi. Kanë prova të mira ndërveprimet e DEMO-s dhe drejtimi arkitekturor; nuk janë provuar kërkesa, përsëritja, ekonomia ose gatishmëria e produktit real. Metrikat e progresit të ardhshëm duhet të jenë gate të përmbushura dhe rezultate të përdoruesve, të ndara nga testet automatike.

## 12. Referencat dhe metodologjia

Lexim i dokumentacionit dhe moduleve në snapshot të fiksuar; kontroll i drejtpërdrejtë i PR/degëve/CI; kërkim i jashtëm më 23 tetor 2026. Këto janë burime të mekanizmave dhe gjendjes, jo prova të kërkesës së tregut për Illyrian. Nuk u kryen intervista, anketime ose eksperimente dhe nuk u morën të dhëna personale nga komunitete private.

### GitHub

- **G1:** [PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1), gjendja live gjatë studimit.
- **G2:** [CURRENT_STATE në snapshot](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/CURRENT_STATE.md) dhe [MASTER_HANDOFF](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/MASTER_HANDOFF.md).
- **G3:** [Product Architecture Blueprint, veçanërisht §§1–8 dhe §10](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md). Pjesët historike kanë numra testesh më të vjetër; përdor CURRENT_STATE dhe run-in e saktë për evidencën e fundit.
- **G4:** [Roadmap v1.7, Paketat 1–8](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md).
- **G5:** [Connections — funksionet ekzistuese, rreshtat 41–105](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_CONNECTIONS_v1.7.js#L41-L105).
- **G6:** [Shop Plus — “Kërkoj…” dhe katalogu](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_SHOP_PLUS_v1.7.js).
- **G7:** [Plans](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_PLANS_v1.7.js), [Governance](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_GOVERNANCE_v1.7.js), [i18n architecture](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/architecture/ILLYRIAN_I18N.md).
- **G8:** [Actions run 40012871234](https://github.com/titanfit102-bit/Illyrian/actions/runs/40012871234), [job 120617409133](https://github.com/titanfit102-bit/Illyrian/actions/runs/40012871234/job/120617409133), log: “157 passed (3.4m)” mbi `5940e1d…`.

### Kërkim i jashtëm

- **S1:** [Meta — New Ways to Organize Events in WhatsApp Communities](https://about.fb.com/news/2024/05/events-in-whatsapp-communities/), 1 maj 2024; burim zyrtar mekanizmash.
- **S2:** [Partiful — faqja zyrtare](https://partiful.com/), kontrolluar 23 tetor 2026; lidhje RSVP pa instalim dhe përditësime eventesh.
- **S3:** [Meetup — Manage attendees and track attendance](https://help.meetup.com/hc/en-us/articles/9389668230541-Manage-attendees-and-track-attendance-for-your-Meetup-event-on-the-web), kontrolluar 23 tetor 2026.
- **S4:** [Timeleft — How safety works before, during, and after dinner](https://timeleft.com/blog/safety-starts-before-the-dinner/), 29 korrik 2026; përshkrim nga vetë kompania, jo certifikim i pavarur.
- **S5:** [ProntoPro IT — Quali sono i costi per offrire i miei servizi?](https://prontoproit.zendesk.com/hc/it/articles/10080806589468-Quali-sono-i-costi-per-offrire-i-miei-servizi-su-ProntoPro), përditësim 4 shtator 2024, lexuar 23 tetor 2026.
- **S6:** [Vinted UK — Trust and safety](https://www.vinted.co.uk/safety), kontrolluar 23 tetor 2026; i kufizuar te rrjedha/tregu i deklaruar.
- **S7:** [MerrJep.al — Termat dhe kushtet e reklamimit](https://www.merrjep.al/kujdesi-ndaj-klientit/termat-dhe-kushtet-e-reklamimit), kontrolluar 23 tetor 2026; nuk përdoret si opinion ligjor ose si përshkrim i çdo tregu MerrJep.
- **S8:** [Radio Evropa e Lirë — Shitësit online në shënjestër të mashtruesve](https://www.evropaelire.org/a/shitesit-online-cak-i-mashtruesve/33801986.html), Valbona Bytyqi, 12 korrik 2026; raportim origjinal, jo studim prevalence.
- **S9:** [INSTAT — Diaspora e Shqipërisë në shifra, 2025](https://www.instat.gov.al/sq/publikime/librat/2025/diaspora-e-shqiperise-ne-shifra-2025/), 19 dhjetor 2025. Faqja e publikimit u hap; PDF-ja nuk u përdor për llogaritje TAM pasi hapja e plotë dështoi.
- **S10:** [European Commission — Digital Services Act: Questions and Answers](https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers), kontrolluar 23 tetor 2026; kuadër i përgjithshëm, me dallime sipas llojit/madhësisë së shërbimit.
- **S11:** [Google — Web Vitals](https://web.dev/articles/vitals), kontrolluar në kërkimin e 23 tetorit 2026; pragje orientuese për performancën web.

**Kufiri përfundimtar i autoritetit:** të gjitha idetë, kostot, pragjet dhe ndryshimet e rendit në këtë raport janë propozime për vendimmarrjen e pronarit. Nuk është ndryshuar kodi, dokumentacioni i repository-t, degët, PR-të, roadmap-i ose Production.

## 13. PROPOZIME PËR CHATGPT — SHQYRTIM DHE VENDIMMARRJE

**Ky seksion mund të kopjohet në bisedën kryesore. Është material për shqyrtim, jo urdhër implementimi.**

### Konteksti që duhet ruajtur

- Repository `titanfit102-bit/Illyrian`; snapshot i studimit `6fb4bd696e0b9f1115691c03eb171e5a8ca3e445` në `feat/i18n-shop-feedback-20261022`; [Draft PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1) open/unmerged në kohën e kontrollit.
- [CURRENT_STATE](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/CURRENT_STATE.md), [MASTER_HANDOFF](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/MASTER_HANDOFF.md), [blueprint](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md) dhe [roadmap](https://github.com/titanfit102-bit/Illyrian/blob/6fb4bd696e0b9f1115691c03eb171e5a8ca3e445/demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md) janë burimet e projektit. Rifresko GitHub përpara punës së re; mos mbështetu te SHA historike si HEAD i përhershëm.
- CI [40012871234](https://github.com/titanfit102-bit/Illyrian/actions/runs/40012871234) mbi `5940e1d9130a928d0b917c7022db945f849c8412` ka log të kontrolluar me 157 PASS; kjo është provë DEMO, jo validim produkti.
- Ruaj identitetin/markën, historikun DEMO, sq/en/it, rolet me scope, katalogun unik të produktit real dhe ndarjen e pagesave. RN/Expo/PWA/backend, tregu, MVP dhe biznesi mbeten vendime të hapura. 5% nuk është tarifë e miratuar.

### Çfarë është verifikuar dhe çfarë mbetet hipotezë

Është verifikuar që “Dy vendet e mia”, “Nga interesi te plani”, “Hera e parë”, “Organizo sërish”, “Kërkoj…”, raportimi dhe apelimi **ekzistojnë si DEMO** [G4–G7]. Mos i propozo si funksione të reja. Është verifikuar që vizioni/blueprint kërkon backend, identitet, privatësi dhe gates reale. Nuk është provuar që përdoruesit preferojnë një vertikale, që bizneset do të paguajnë ose që një komunitet lokal ka dendësinë e nevojshme. Mos implemento këto hipoteza si vendime të marra.

### Rendi i rekomanduar i shqyrtimit

1. **P0 — Përfundo veçmas punën aktuale të autorizuar të DEMO-s.** Mos fut idetë e studimit në DEMO dhe mos i përdor për ta shtyrë pa fund Phase 7. Mbaj gates e Preview/SHA, CI, telefonit, aksesueshmërisë dhe sign-off.
2. **P0 — Përgatit propozim M0 për miratim:** një zonë, një nevojë, audienca, kriteret e pranimit, orari i operatorit, buxheti dhe metrikat. Krahaso komunitet/evente me shërbime lokale përmes intervistave dhe testit manual; asnjë kontakt/shpenzim nuk autorizohet nga ky raport.
3. **Vendim i pronarit — Zgjidh vetëm një cikël fillestar.** Komunitet: O2 me host, kohë, vend publik dhe përsëritje. Shërbime: O3 me kërkesë të strukturuar, pak ofrues dhe përgjigje të krahasueshme. Ruaj ekosistemin si destinacion, por mos ndërto të dyja plotësisht menjëherë.
4. **P0-R — Përpara pilotit real, shqyrto M1 + minimumin M5:** autorizim/izolim, privatësi, report/block, rate limits, audit, data lifecycle, restore dhe përgjegjës support-i. Moderimi bazë nuk vjen pas hapjes së Shop ose messaging.
5. **P1-R — Nëse miratohet zhvillimi:** O1 lidhje publike → identifikim → veprim; vertikalja e zgjedhur; O4 minimal dhe O8 njoftime për veprimin. Për Shop përfshi O5 përditësi/afate. Rivlerëso kostot pas specifikimit; vlerësimet e raportit nuk përfshijnë gjithë fondacionin.
6. **P2 — Pas provës së rezultatit/përsëritjes:** O7 sinonime dhe taksonomi vetëm nëse ka kërkime problematike; digest vetëm me pëlqim; reputacion më i pasur vetëm me prova dhe apel. Testo nëse social → inquiry sjell vlerë reale.
7. **P2/P3 — Më vonë:** O6 vizitë e përkohshme/dy qytete; treg i dytë, gjuhë të reja dhe pagesa vetëm pas gates përkatëse. Mos nis wallet/escrow, AI matching ose microservices.

### Provat/testet për t'u kërkuar nëse propozimet miratohen

- **O1:** faqja publike/preview/cache nuk rrjedh pjesëmarrës privatë ose adresë të kufizuar; login ruan kontekstin; lidhja e anuluar/fshirë jep gjendje të ndershme; veprimi i mbrojtur s'bëhet pa identitet.
- **O2:** dy përdorues konkurrojnë për vendin e fundit; interes i skaduar nuk numërohet; hosti konfirmon draftin; anulimi lirohet pa njoftim të dyfishtë; i bllokuari nuk hyn në grup; prova e pjesëmarrjes dallohet nga RSVP; test në ndryshim zone kohore/DST.
- **O3/O5:** kërkesa private u shfaqet vetëm ofruesve të lejuar; kufiri i përgjigjeve dhe afati zbatohen në server; retry nuk dublon; version i vjetër nuk rihap listimin; statusi/çmimi/kushtet mbeten të dallueshme; “pa përgjigje” nuk quhet sukses.
- **O4:** email i konfirmuar nuk jep pretendim KYC/biznesi; prova është scoped dhe skadon; review nuk etiketohet transaksion i verifikuar pa transaksion; përdoruesi mund të raportojë/apelojë dhe moderatorët kanë kufij aksesi.
- **O7/O8:** sinonimet nuk ndryshojnë UGC ose kodet kanonike; origjinali mbetet; njoftimet respektojnë çregjistrim/orar qetësie, status dhe privatësi të përditësuar; testet kapin dërgime të dyfishta.
- **Për rrugën reale të zgjedhur:** telefon fizik, screen reader, tastierë/zoom, lidhje e dobët, draft/retry, backup/restore dhe skenar incidenti. Suksesi automatik nuk zëvendëson matjen e detyrës me përdorues.

### Vendimet që duhen para çdo implementimi të ri

Të miratohen: teza fillestare; zona dhe segmenti; eksperimenti/buxheti; rezultati dhe kriteret e ndalimit; kufijtë e moshës/sigurisë; platforma/ofruesit; çfarë hyn në P1 dhe çfarë përjashtohet nga ai release. ChatGPT duhet t'i krahasojë propozimet me vendimet më të fundit, të shpjegojë konfliktet dhe të paraqesë një plan të kufizuar për vendimmarrjen e pronarit. Ky raport nuk autorizon ndryshim roadmap-i, kod, merge, deploy ose shpenzim.
