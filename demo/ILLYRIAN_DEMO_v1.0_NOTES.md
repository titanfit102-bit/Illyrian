# ILLYRIAN — Demo v1.0 · Shënimet e versionit

**Statusi:** prototip HTML me të dhëna demonstrimi, jo aplikacion profesional dhe jo një MVP i publikuar.
**Baza:** ILLYRIAN Demo v0.9; origjinali ruhet pa ndryshime.

## Përmirësimet e v1.0

- **Planet e mia:** hyrje e drejtpërdrejtë nga kryefaqja; ndarje e aktiviteteve në *Të gjitha*, *Kërkesat e mia* dhe *Të pranuara*.
- **Rrjedhë aktivitetesh e lidhur:** dërgimi i kërkesës, statusi në pritje, pranimi i simuluar dhe rikthimi te aktiviteti. Nuk dërgohen kërkesa reale.
- **Feed më transparent:** butoni *Pse po e shoh?* në postime jep një shpjegim të ndershëm sipas pamjes së zgjedhur. Në *Për ty* sqaron se nuk ka algoritëm real personalizimi.
- **Veprime në kontekst:** nga shpjegimi i postimit mund të shikohet profili, të fshihet postimi nga Feed dhe të raportohet vetëm si simulim lokal.
- **Shpërndarja:** hapet një pamje e qartë për kopjimin e tekstit të postimit; nuk pretendohet se ekziston URL reale individuale.
- **Dizajn:** karta të lehta dhe status të lexueshëm, duke ruajtur logon dhe paletën e miratuar, si edhe Automatik/Light/Dark.
- **Etiketat:** tregojnë v1.0 si *version i demos*, jo v1.0 të produktit final.

## Testet e kryera

- Kontrolli i sintaksës JavaScript: **kaloi**.
- Ndërveprimi *Pse po e shoh?* dhe mbyllja e dialogut: **kaluan**.
- Nga Home te Planet e mia; gjendja bosh dhe filtrat: **kaluan**.
- Nga kërkesa te pranimi simulues dhe lista *Të pranuara*: **kaluan**.
- Ruajtja e gjendjes në testin e ri-renderimit (me ruajtje lokale të simuluar): **kaloi**.
- Kalimi nëpër postime, pëlqime, komente, kërkim, evente dhe Dark Mode: **kaloi**.
- Pamja me gjerësi 390 px: **nuk pati overflow horizontal**.
- Gabime JavaScript në rrjedhat e testuara: **nuk pati**.

**Kufijtë e testimit:** Chromium në mjedis të izoluar, me faqe të injektuar në dokument dhe localStorage të simuluar. Nuk është provuar realisht në Android/iPhone, dhe s'ka verifikim real të rikthimit pas një rifreskimi HTTP ose të shpërndarjes së clipboard-it në çdo pajisje.

## Kufijtë e produktit

Nuk ka ende backend, llogari reale, algoritëm personalizimi, kërkesa/evente reale, mesazhe mes pajisjeve, siguri serveri, pagesa ose shpërndarje si APK. Versionet përfaqësojnë sofistikimin e konceptit e UX-it; nuk tregojnë progresin e implementimit profesional.

## Çfarë nuk u ndryshua

Demo v0.7, v0.8 dhe v0.9, projektet e tjera, dokumentet në Google Drive dhe kodi i ardhshëm Android/iOS.
