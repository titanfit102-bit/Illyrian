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



## P0-D — Shop/form i18n + storage rollback — 23 October 2026, verified follow-up
- Source: Draft PR #1, branch `feat/i18n-shop-feedback-20261022`, last code/test SHA `b0a85f1119149d092328ae912d79299a87b9862f`. This is **not merged** into `demo/v1.7-illyrian-shop`, `main` or Production.
- Shop base: all persistent modifications (create/edit/delete listing, add/remove cart, demo checkout/inquiry) now use transactional `transact(change)`; if `localStorage.setItem` fails, memory state rolls back and no success/confirmation is shown. Failed new/edit form stays on the input screen to permit retry.
- Shop Plus, Connections and Governance: retain last successfully serialized state and restore it if persistence fails; checkbox/interest messages in Connections no longer claim saved data on failure. This is DEMO storage reliability, **not** server transactionality. Shop Plus/Governance may still need improvements for preserving unsaved form input after failed writes.
- i18n: explicit stable `<option value>` on relevant Shop Plus request/report options, Connections timeslots, Governance report reasons; historical Albanian codes remain valid in stored data even when labels change language.
- **CI proof:** GitHub Actions [#39868919668](https://github.com/titanfit102-bit/Illyrian/actions/runs/39868919668) on exact code+test SHA `b0a85f1119149d092328ae912d79299a87b9862f`: **65/65 Playwright Chromium PASS (2.1m)**. Includes 8 new quota/error and multilingual form tests beyond prior 57. The earlier 60/62 failure was QA selector targeting backdrop instead of actual close button; corrected without deleting coverage. Baseline 53/53 and 57/57 are historical.
- Coverage boundary: Chromium E2E is not certification of every i18n string, localStorage edge case, mobile browser, a11y or physical phone. Remaining work: complete explicit UI translation & UGC exclusion, audit all forms/controllers beyond selected paths, fuller QA/visual/a11y, resolve Vercel preview/version route and owner phone screenshots; Shop and Shop Plus remain separate demo storage models until planned domain consolidation.
- Owner-accepted vision/architecture prompts and conditional decisions remain recorded in Product Blueprint §10; do not implement new business features automatically. Keep projects isolated and no merges/deployments to main/production without owner approval.



## Handoff — i18n Connections + Governance, 23 Oct 2026 (verified)
- Branch-only integration: `feat/i18n-shop-feedback-20261022`, Draft PR #1 to DEMO branch, `main` and Production untouched.
- Added **23 semantic i18n feedback keys** across `connections` (9) and `governance` (14) in sq/en/it. Catalog parity and exact root/demo mirrors validated; now **319 keys/locale across 15 namespaces**. Runtime messages cover storage failures, validation, success, interest/cities, private notes, reports, appeal/review and local drafts.
- Governance user-authored report titles/details, moderation notes, and local draft names/notes have explicit `data-user-content` on relevant DOM paths, preventing phrase translator from changing user text. Canonical persisted report reasons and selected city codes are NOT localized.
- Added six Chromium browser scenarios (two per locale), including report content `Mbyll` surviving locale changes; adjusted two existing storage quota tests to explicitly select sq rather than assume the browser locale. No test removed.
- **VERIFIED: Actions #39930979544**, code+tests SHA `f5478b1716289bec575dfd5e23cd4294132dfcad`, **71/71 Chromium Playwright PASS (2.1m)**. An earlier run #39930560220 had 69 pass/2 fail because historic quota assertions expected Albanian with an English browser; fixed by pinning the intended test locale.
- CI workflow `.github/workflows/illyrian-v17-browser-qa.yml` now listens to `i18n/**` root source catalog changes as well as `demo/**` and `qa/**` (new workflow commit later than tested code). Keep per-SHA CI evidence distinct.
- OPEN: Shop Plus, Plans, Privacy and remaining conditional UI strings; UGC inventory beyond patched paths; screens/a11y/phone/Preview verification, required PR checks, real backend/MVP work. Keep original M0–M5 release gates and previously agreed architecture decisions.



## P1-D Shop Plus localization and retry-state checkpoint — 23 October 2026
- **Branch only, Draft PR #1:** `feat/i18n-shop-feedback-20261022`; code/tests SHA `893538c33dd7cdecf9aa77e359a999d649a7a247`. Demo integration, main and Production were NOT changed.
- Shop Plus: **18** new semantic `shopPlus:*` messages for validation and status (filters, listings, stock, vehicles, rentals, requests, answers, reports, simulated orders and quota failure), all in **sq/en/it**. Total catalogs: **337 identical keys/locale in 15 namespaces** at `i18n/locales` and `demo/i18n/locales`. Do not alter legacy `type`, `city`, `reason` or stored domain values.
- On failed `localStorage.setItem`, Shop Plus restores its last persisted data snapshot, retains user-entered form DOM/values and shows localized failure rather than navigating to a false success screen. Only after successful save does the create/request/response/report workflow change screen. This is DEMO client-side safety, not an ACID backend.
- UGC protection expanded to Shop Plus listing title/store/description, request title/details, answers, report targets, and shop identifiers in relevant views via `data-user-content`. This does NOT claim full UGC isolation in other modules.
- Added **9 Chromium tests** after 71 baseline: 3-language request feedback/canonical data (3), 3-language listing validation (3), storage failure with input retention/retry (1), listing UGC across locale changes (1), request UGC across locale changes (1).
- **VERIFIED**: [Actions #39935174398](https://github.com/titanfit102-bit/Illyrian/actions/runs/39935174398) on `893538c33dd7cdecf9aa77e359a999d649a7a247`: **80 / 80 passed (2.4m)**, Chromium. Previous run #39934891160 (70/71) failed because an older quota test presumed Albanian in an English browser; fixed by explicitly selecting sq. No test removed.
- OPEN: Shop Plus remaining *static* and generated UI copy, i18n form option display labels while keeping canonical values, Plans, Privacy, Settings audits, comprehensive UGC protection, live switching in every open dialog, visual/a11y/Android checks, Vercel Preview candidate. 80/80 is only controlled Chromium suite success, not production/mobile sign-off.
- Next: continue semantic i18n localization in Plans & Privacy, then full demo QA, owner phone screenshots, and Phase 8 design gates M0–M5; maintain approved architecture decisions in blueprint §10. No merge to main or Production without explicit user approval.


## P1-D Shop Plus static-form localization — 23 October 2026 (verified)
- Branch `feat/i18n-shop-feedback-20261022` (Draft PR #1). **No merge** into DEMO integration, main or Production.
- Catalogs gained **37** curated `shopPlus:form*` UI phrase entries per sq/en/it, reaching **374 keys/locale, 15 namespaces**; root and `demo/i18n` mirrors equal. Covers create listing, pricing/stock/cars/property/rental, buyer request deadlines/details, reporting reasons and form buttons. UI uses the **existing transitional DOM phrase adapter** for these static labels; direct key binding remains an open migration task. No new i18n system or separate service was added.
- User-entered fields and persisted domain options remain immutable; report reason values remain historical Albanian codes while displayed text translates. Coverage checked with **nine new Chromium Playwright cases** across sq/en/it for listing, request and report forms; live language changes preserve entered values and option codes.
- Verified Actions [#39937253596](https://github.com/titanfit102-bit/Illyrian/actions/runs/39937253596), **89/89 PASS (2.6m)** on exact SHA `429927296870ea6b6d6ca1e90ab3cb4726cb307d`. Earlier 80/80 PASS is historical. A locale-only commit `6294d7c...` also passed CI but is superseded by this code+test SHA.
- Open gaps: Shop Plus full static prose and dynamic generated fragments not proven complete; direct semantic bindings, Plans/Privacy localization and quota handling, UGC exclusions in remaining modules, phone/responsive/a11y/Preview release checks. 89/89 is automated Chromium scope, not production certification.


## P1-D Plans dynamic i18n + storage integrity — 23 October 2026, verified
- Development branch `feat/i18n-shop-feedback-20261022`, Draft PR #1. Code+test SHA `8c2ebfd57227f6f4f22ffa377a2067f83022c072`; DEMO integration `015ce439...` and main `9f91b5c...` were not merged/updated by this change.
- Plans adds **18 direct semantic runtime keys** (`plans:*`) in sq/en/it for cancellation, participation, review, waitlist, message, validation, activity save and draft notices, while reusing existing `plans:localStorageError`. Mirrored locale catalogs: **392 keys/language, 15 namespaces**.
- DEMO Plans persistence now maintains `lastSaved` serialized state; failed browser write restores events/requests/messages/attendance, shows an error rather than a false-success view and preserves the active new/edit form input for retry. Action-level failures display an inline notice without rebuilding the form. This is DEMO localStorage behavior, not a transactional production server.
- Event titles in targeted summary/detail DOM paths are protected via `data-user-content`. Wider audit of place, conditions, messages and other module UGC is NOT complete.
- Added six Playwright Chromium scenarios since 89 baseline: failed new activity and cancellation with state preservation (2) + en/it form validation/success and localized quota handling (4). Existing sq-storage tests explicitly select sq. The earlier run with 94/95 passed one fewer case because the Italian test expected alternate wording rather than the actual catalog translation; assertion was aligned to source without masking coverage.
- **CI VERIFIED:** [Actions #39938445963](https://github.com/titanfit102-bit/Illyrian/actions/runs/39938445963) on SHA `8c2ebfd57227f6f4f22ffa377a2067f83022c072`: **95/95 Playwright Chromium PASS (2.7m)**.
- OPEN: full Plans static copy, UGC protection for descriptions/chat, Privacy map localization and local state failure rollback, static Shop Plus prose/direct-key replacement, a11y/visual/phone testing, Vercel Preview code identity, owner phone screenshot review. Do not merge to DEMO/main/Production without owner's express authorization.


## P1-D Privacy Map localization + failure-safe local access states — 23 October 2026
- **Development only:** Draft PR #1 `feat/i18n-shop-feedback-20261022`. Code/tests SHA `2048ca78c9d062cb2afa8028251a6f600456c36a`. No merge into DEMO integration, main or Production.
- Privacy & Map gained **26** direct semantic sq/en/it keys (status labels for `none/pending/accepted/declined/blocked`, follow/group request approval, rejection, withdrawal, blocking, local storage failure, map kind labels, plan state notices and invalid filters), resulting in **418 keys per language / 15 namespaces**, exact root/demo catalog mirrors.
- Retains existing persisted domain codes (`follow`, `membership`, map `all/activity/business`, city IDs, public/private) without rewriting user-authored names. Relevant selected map items and public activity titles marked `data-user-content` so UI phrase translations do not alter user-originated text.
- Private-demo writes maintain last successful stored snapshot of follow/membership. A refused `localStorage.setItem` rolls back in-memory values and displays a localized failure, instead of claiming a follow, group membership, or block was saved. This remains **client-side simulation**, not server-enforced authorization or real data privacy.
- Removed duplicate notice rendering in the statuses view. Prior run #39939898357 showed **98 PASS / 3 FAIL** due to the duplicate status region; after the fix, **[Actions #39939993711](https://github.com/titanfit102-bit/Illyrian/actions/runs/39939993711)** on exact code/tests SHA `2048ca78c9d062cb2afa8028251a6f600456c36a`: **101 / 101 Chromium Playwright PASS (2.7m)**. Six new tests cover quota rollback/retry, stable map enums/localized labels, plan-state notices, user-authored activity title across languages.
- Remaining: complete Privacy static copy, Plans/Shop Plus static prose, full app-wide UGC inventory and semantic binding migration, real accessibility/mobile QA, current Vercel Preview candidate, owner's phone review with screenshots. Do not claim release readiness or mobile app completeness.


## P1-D Privacy UI direct-binding migration — 23 October 2026 (verified)
- Work continued **in place**, not a restart: `feat/i18n-shop-feedback-20261022` / Draft PR #1; code/test SHA `d803758ee14cfaa26bc5cab4eee8e27571d5a535`. No merge into DEMO integration, main or Production.
- Converted scoped Privacy & Map headers, navigation tabs, accessibility labels, warning/footer, map filtering labels/search placeholder, group introduction and activity-state headings to direct semantic `privacy:*` keys. Added **17 new curated static keys**, raising synchronized `sq/en/it` catalogs to **435 keys/locale, 15 namespaces** (Privacy 55 keys).
- Added `data-i18n-direct` contract in the shared root/demo DOM i18n adapters: nodes already translated with direct semantic keys must be excluded from the transitional phrase-based repaint. This fixed an actual collision in Italian where semantic `privacy:profiles=Profili` was being rewritten as `Profilo` via another phrase key. Do not disguise this regression by changing the expected translation; maintain the explicit marker and regression test.
- Active Privacy dialog refreshes on `illyrian:language-changed`. Map form preserves unsent `city`, `kind`, `q` values and input focus across sq/en/it switches, without migrating persisted enum IDs or silently submitting the form.
- Profile/group names and descriptions in tested Privacy views receive `data-user-content` exclusion; no promise of fully audited UGC across the entire app.
- **VERIFIED GitHub Actions [#39944600826](https://github.com/titanfit102-bit/Illyrian/actions/runs/39944600826)**: **110/110 Chromium Playwright PASS (2.9m)** on exact code/test SHA `d803758ee14cfaa26bc5cab4eee8e27571d5a535`. Nine tests added after prior 101 baseline: three direct existing labels by locale, live map fields/focus, profile/group UGC, three additional map/group/status labels, and one targeted collision sentinel. Earlier 105/106 and 108/109 failed specifically on Italian `Profili` collision; corrected by explicit direct-key boundary, not removing coverage. Intermediate adapter fix reached 109/109 PASS at #39944510635.
- OPEN: other Privacy static blocks and dynamic badges, full Plans and Shop Plus static/direct semantic migration, remaining UGC inventory, a11y/visual/native-phone QA, current Vercel Preview/SHA routing, final owner screenshots. The DEMO remains a simulated local browser product, not real privacy authorization. Keep original product Phase 8 M0–M5 gates.


## P1-D Plans direct form semantics and live locale switching — 23 Oct 2026 (verified)
- Continued existing DEMO in isolated `feat/i18n-shop-feedback-20261022` / Draft PR #1, no merge or production deployment. Exact tested code+QA commit: `5961a1d90a25b8d7768fe022ec3de3f3760e78a7`.
- **25 new direct `plans:*` locale keys** in Albanian, English and Italian: event title, kind, city, venue, date/time, capacity/contribution, visibility, conditions, safe-demo notice, action buttons, form placeholders and technical option display labels. Totals now **460 keys/language across 15 namespaces**, mirrored exactly at `i18n/locales` and `demo/i18n/locales`.
- `choose(values,current,keyOf)` keeps unchanged persisted values (`Sport`, `Miqësi dhe komunitet`, `Kulturë`, `Alumni`, `Bashkëpunim`; `public/private`, and cities) while translating visible option labels; input labels and options are scoped `data-i18n-direct` to prevent legacy phrase adapter interference.
- Added Plans handler for `illyrian:language-changed`: an open event form preserves all typed/select values, field focus and validation text; open chat draft is also preserved on re-render. No implicit local save, event publish or persisted-code mutation on language change.
- Expanded `data-user-content` protection on event venue in summary/detail, event conditions, chat names/messages, and created-event title. **This is scoped UGC protection**, not proof of complete app-wide isolation.
- **Current verified CI:** [Actions #39946187468](https://github.com/titanfit102-bit/Illyrian/actions/runs/39946187468) at the exact code/tests SHA above, **115/115 Playwright Chromium PASS (3.0m)**. Five added tests versus the prior 110 baseline: 3 language-specific semantic form/enum tests, 1 unsaved-field/focus/persistence locale-switch scenario and 1 UGC locale-switch scenario. Syntax and catalog parity were also checked independently.
- OPEN: remaining static text and labels outside the Plans form; Shop Plus conversion from transitional phrase mapping to direct keys, additional Privacy areas, global UGC audit, browser accessibility/visual/mobile QA, Vercel preview SHA verification and owner's physical phone screenshot review. No native mobile or production readiness certification implied. Phase 8 real-app gates M0–M5 remain separate.
