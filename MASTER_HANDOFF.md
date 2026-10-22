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
