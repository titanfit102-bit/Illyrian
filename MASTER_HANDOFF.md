# ILLYRIAN — MASTER HANDOFF (Status i18n, 22 tetor 2026)

## Për të vazhduar në një bisedë tjetër

**Repository:** `titanfit102-bit/Illyrian` (private) · **Dega aktive:** `demo/v1.7-illyrian-shop` · **Mbrojtja:** mos ndrysho `main` ose Vercel Production pa miratimin e pronarit. Mos përziej projektet e tjera.

**Qëllimi i produktit:** komunitet/rrjet social shqiptar global + aktivitete dhe njohje + marketplace `ILLYRIAN Shop` (produkte, dyqane, makina, banesa me qira, shërbime). Kërkimi, shporta dhe komisioni ilustrues 5% janë **DEMO lokale**, jo pagesa/inventar/përdorues realë.

**Kodi:** HTML + vanilla JS (demo/ILLYRIAN_DEMO_v1.7.html) dhe module Shop, Shop Plus, Plans, Connections, Privacy/Map, Governance. Teknologjia e re i18n: i18next 25.7.0 me katalogë en/sq/it dhe fallback en. Lexo `architecture/ILLYRIAN_I18N.md` për API, vendim teknik, dublimin e katalogëve te demo/, testet dhe kufijtë. Lexo `architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md` për produktin real të Fazës 8 dhe `demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md` për historikun e plotë.

**Evidencë historike:** GitHub Actions run #39839958152: 32/32 Playwright PASS në Chromium dhe 273/273 kontrolle të brendshme QA Lab (126 bazë + 147 advanced), para shtimit të i18n. U krijuan 42 screenshots të QA për 7 përmasa × 6 ekrane, jo certifikim vizual.

**i18n:** Katalogët kanë 206 çelësa/14 namespace për secilën gjuhë. Anglishtja është baza teknike. Locale e ruajtur prevalon mbi gjuhën e telefonit; UI përzgjedh gjuhën në Profile → Settings → Gjuha. Nuk preket llogaria e përdoruesit, postimet, komentet apo mesazhet. **Mbulimi i të gjitha frazave të trashëguara nuk është përfunduar**, prandaj nuk deklarohet produkt i përkthyer 100%. Mos përkthe automatikisht përmbajtjen e përdoruesve. RTL ka mbështetje arkitekturore, por nuk është testuar ose aktivizuar.

**Hapi pasues:** kontrollo së pari GitHub Actions të commit-it aktual për testet e i18n, korrigjo vetëm defektet e riprodhuara, zgjero inventarin e përkthimeve dhe testet për të gjitha rrugët dhe gjendjet e formularëve. Përditëso roadmap dhe këtë handoff pas çdo faze. Testi final fizik i gjithë projektit do të bëhet nga përdoruesi në fund, me screenshot-e. Nuk lejohen ndryshime destruktive ose të palidhura.

**Kufiri i release:** DEMO nuk është backend, aplikacion i certifikuar për Play Store/App Store ose pagesa reale. Faza 7 mbyllet pas auditit vizual/telefonik; Faza 8 blueprint ≠ prodhim funksional.
