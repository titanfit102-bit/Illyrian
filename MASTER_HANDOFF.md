# ILLYRIAN — MASTER_HANDOFF

## ACTIVE SNAPSHOT — vazhdimësia

26 tetor 2026 (Europe/Rome). Për progres, CI, Preview, bllokues dhe hapin e radhës lexo [CURRENT_STATE](CURRENT_STATE.md). Ky dokument ruan kontekstin afatgjatë; faktet LIVE dhe udhëzimi më i ri eksplicit i pronarit kanë përparësi. Historiku i plotë është [i arkivuar](docs/archive/continuity/README.md), jo i fshirë.

Politika e përhershme: [DEMO vs APK në AGENTS](AGENTS.md#demo-vs-apk--permanent-owner-policy), detyruese deri në ndryshimin eksplicit të fazës nga pronari. DEMO është prototip për testim privat; repository mbetet PUBLIC. Specifikimet e APK-së ruhen në [blueprint §14 / hartën e informacionit](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#14-knowledge-preservation-and-demoapk-boundary--26-october-2026); gjendja/CI/hapi pasues vetëm te CURRENT_STATE. Checkpoint-et e hollësishme para konsolidimit ruhen [immutable në arkiv](docs/archive/continuity/README.md#consolidation-2026-10-26).

<a id="authorization"></a>
## Autorizimet dhe kufijtë aktivë

- **Vetëm** `titanfit102-bit/Illyrian`, dega `feat/i18n-shop-feedback-20261022`, Draft PR #1 → `demo/v1.7-illyrian-shop`. Mos përziej projekte, kod ose kredenciale nga repository të tjera. Repository është PUBLIC: pa sekrete/personale ose detaje sensitive dobësish të pazgjidhura.
- Autorizimi i vazhdueshëm i pronarit, 23 tetor: zhvillim normal, i vogël dhe i kthyeshëm për **të gjithë DEMO-n v1.7**: korrigjime, lokalizim, refaktorime të vogla, QA/Playwright/CI, screenshot-e, dokumentacion dhe Preview i izoluar; nuk kërkohet leje për çdo patch të tillë. Kufizimet e vjetra “vetëm Shop Plus” dhe ndalimi i çdo Preview janë historike.
- **Miratim i veçantë përpara** çdo merge (edhe në integrim), prekjes së `main`/Production, shpenzimit/planit me pagesë, ndryshimit madhor arkitekturor/produkt/roadmap, ndryshimit masiv/destruktiv, migrimit të rrezikshëm, global auth/secrets/SSO, branch protection/rulesets ose veprimit tjetër me rrezik të lartë. Native/backend/stack/provisioning nuk autorizohen nga një dokument themeli ose test PASS.
- Preview: vetëm projekti `illyrian-demo`, team `un24` dhe dega e verifikuar; kontrollo target Preview/izolimin **përpara** deploy/alias/config. Përdor vetëm mekanizma të kufizuar të aksesit të përkohshëm të autorizuar; mos ul SSO globalisht dhe mos regjistro URL me token/kredenciale. 403 i lidhjes është problem aksesi, jo leje për ta anashkaluar politikën.
- **Preview i përhershëm për testimin në telefon (26 tetor, kërkesë eksplicite):** përdor [alias-in e degës](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/) që Vercel e përditëson automatikisht pas çdo push/deployment READY. Në vazhdim, kontrollo HEAD GitHub → latest READY Preview → alias target/source SHA + izolim + CI dhe jep gjithmonë këtë URL fikse në përgjigje. Mos bëj redeploy të dyfishtë ose zhvendos alias-e Production; dokumento SHA/URL immutable për prova QA. Mos premto automatizim kur Git integration dështon ose kur QA nuk ka përfunduar; mbrojtja e hyrjes Vercel mbetet e pandryshuar.
- **Vendimi më i ri, 25 tetor:** ridizajnimi premium A/B/C shtyhet; asnjë drejtim vizual nuk u miratua. Ruaj ILLYRIAN, logon/simbolin/ikonën origjinale, ngjyrat, dizajnin, ekranet dhe funksionet; pa Forum të veçantë. Konceptet jashtë repository-t janë vetëm propozime.
- **Autorizim i ri vizual, 25 tetor:** Instagram-inspired precision vetëm për Stories/Feed, pesë ikonat e navigimit, header, safe areas dhe hapësirat e shell-it mobile. Ky përjashtim scoped nuk miraton ridizajnim global A/B/C, ndryshim të logos/paletës, funksioneve, arkitekturës ose admin settings. Screenshot-et e referencës kërkojnë rishikim manual para pranimit final.
- **Home header, vendimi aktiv i 26 tetorit:** `ILLYRIAN | Kalendari | Mundësi | Njoftime` vetëm në Home; popover vertikal me **Biznese, Tregu, Punë, Shërbime, Çfarë kërkon tani?, Aktivitetet e tua, Plane, Komunitete**. Biznese/Punë lidhen me Explore, Tregu/Shërbime përdorin overlay dhe filtrat ekzistues ILLYRIAN Shop (jo marketplace paralel). Plus/Compose ruhet jashtë Home; asnjë backend, pagesë, Production ose ridizajnim global.
- **Scope i kërkesës së mëparshme (Faza 3), 25 tetor:** integrime/korrigjime të kufizuara sociale/Communities/location në DEMO dhe kontrata dokumentuese backend/API. Pa backend/native, migrime të rrezikshme, bashkime destruktive ose ndryshim madhor arkitekture. Kufizimi “vetëm dokumentacion” i konsolidimit të mëparshëm i përkiste asaj detyre, jo kësaj kërkese.

**Vendimet aktive të Home (26 tetor):** Stories → composer ekzistues → Shop → Feed; pa composer paralel. Mundësi ka tetë hyrjet/destinacionet e dokumentuara në blueprint §14; katër hyrjet Interesi/Aktivitetet/Plane/Komunitete janë zhvendosur nga Home, jo hequr si funksione. F06 administrative enforcement shtyhet për aplikacionin real sipas pronarit; nuk aktivizohet automatikisht dhe nuk është detyrë për çdo ndryshim DEMO.

## Objektivi dhe vendimet e produktit

Një ekosistem ILLYRIAN social, komunitar dhe marketplace për shqiptarët/diasporën, i projektuar për zgjerim ndërkombëtar dhe gradualisht miliona përdorues. Kjo është ambicie, jo kapacitet i provuar. Ruaj Home/Feed, Profile/Settings/Onboarding, Messages/Inbox, Stories/Reels, Communities/Search, Plans/Events, Connections, Shop/Shop Plus, Privacy/Map dhe Governance. Pronari teston DEMO-n e plotë në telefon pas stabilizimit; screenshot-et dhe sign-off janë gate të domosdoshme.

Parimet e miratuara, jo implementimi i backend-it: [blueprint §10](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#10-consolidated-architecture-decisions--23-october-2026-approved-direction-not-implementation).

- Identitet i vetëm me role/capabilities scoped dhe autorizim **në server** për çdo objekt/veprim; privatësi, lifecycle, moderim, media, notifications, safe deep links dhe observability të përbashkëta sipas nevojës reale.
- Shop brenda ILLYRIAN, jo APK store. Katalog real kanonik `Seller/Organization → Shop → Listing`; rrjedha të dallueshme për produkte fizike, classifieds makinë/pronë, shërbime/qira. Social → listing me ID, pa kopjuar objektin kanonik. Shop dhe Shop Plus nuk bashkohen tani.
- Analytics me kontrata eventesh dhe emërues KPI; vizita/reach të agreguara, pa ekspozim identitetesh vizitorësh. Dashboards Personal/Creator/Business/Organizer aktivizohen vetëm kur ekziston funksioni dhe mbrojtja përkatëse; statistikat DEMO etiketohen si të simuluara.
- Pagesat/payouts veç katalogut; **5% është ilustrim, jo tarifë e miratuar**. PSP/KYC/KYB, komisionet, refund/disputes dhe GDPR/DSA/GPSR sipas zbatueshmërisë kërkojnë shqyrtim dhe gates para produktit real; pa trajtim vetjak të kartave sensitive.
- Module të qarta, integritet të dhënash dhe migrime të kthyeshme; pa microservices/AI/infrastrukturë të shtrenjtë pa nevojë të provuar.

**Ende pa vendim final:** MVP/exclusions, roli i Shop në pilot, vendi/qyteti/tregu i parë, React Native/Expo vs Web/PWA, Postgres/Supabase/provider, auth, monetizimi/PSP, licencimi/ekspozimi publik, operatorët/kostot dhe scope i DM/video/dashboards. Kandidatët teknologjikë nuk janë stack i implementuar ose autorizim shpenzimi. Mbështetja e 100+ gjuhëve është aftësi e synuar, jo përkthime të dorëzuara.

## Arkitektura ekzistuese dhe kontratat që ruhen

- **DEMO statike**, jo React Native/Expo i implementuar: [HTML v1.7](demo/ILLYRIAN_DEMO_v1.7.html), vanilla JS/CSS dhe module `demo/ILLYRIAN_*_v1.7.js`; fixtures dhe `localStorage`. Nuk ka auth/API/DB server-side, DM real, pagesa, moderim shërbimi ose APK.
- i18next **25.7.0**, vendor lokal; sq/en/it, fallback teknik `en`; zgjedhja manuale e ruajtur përpara device detection; Intl për numra/EUR/data/plural. Prefero semantic keys. `[data-i18n-direct]` pengon ritranslatimin legacy; `[data-user-content]` mbron tekstin e autorit. Adapteri `MutationObserver` sipas frazave ende ekziston. [Kontrata i18n](architecture/ILLYRIAN_I18N.md).
- Mos ndrysho pa migrim të aprovuar çelësat `illyrian_demo_v09_state`, `illyrian_demo_v17_shop`, `illyrian_demo_v17_shop_plus`, `illyrian_demo_v17_plans`, `illyrian_demo_v17_connections`, `illyrian_demo_v17_privacy_map`, `illyrian_demo_v17_governance`, `illyrian_demo_ui_language_v1`, fallback-et historike, IDs dhe strukturat ekzistuese. Lista nuk zëvendëson inventarin e kodit për çdo rrugë.
- `option.value`, city/type IDs, statuset, sort/period/reason codes dhe UGC mbeten të pandryshuara nga gjuha. Shembuj historikë: `Produkte/Makina/Banesa me qira/Shërbime`, `Të gjitha`, `muaj/javë`, `public/private`; etiketat vetëm për shfaqje lokalizohen. Statuset e panjohura shfaqen të escape-uara si origjinali, pa konvertim të rremë në pending/return.
- Quota/write failure: pa sukses të rremë; rollback i rrugës së mbuluar, draft/fokus të ruajtur dhe Retry pa dublime. Normalizimi i korruptimit bëhet në memorie; mos rishkruaj raw storage vetëm nga load. Stale-write guards në Shop Plus, Plans dhe Messages/Story paths janë **mitigime të vrojtuara, jo atomic CAS** ose garanci globale.
- Integrimi i Fazës 3 ripërdor core posts/comments për diskutime brenda Communities (jo Forum/store paralel). `c4` = Shkolla & Universiteti; pa të dhëna personale shkollore/direktori të miturish. Fusha opsionale `communityId` lidh postime/Plans; `timeZone` shtohet në ruajtjen e re të aktivitetit, ndërsa legacy inferohet nga qyteti pa rishkrim në load. Helper-i `demo/ILLYRIAN_ACTIVITY_TIME_v1.7.js` është i përbashkët për Plans/Connections; DST gap/duplicate refuzohen. GPS ende nuk thirret; qytetet manuale mbeten scoped. [Kontratat e ardhshme §13](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#13-social-community-and-activity-api-contracts--phase-3-design), jo backend i implementuar.
- Reset aktual është **vetëm social/core** pas konfirmimit, jo `localStorage.clear()`: ruan module/language; dështimi nuk bën reload/sukses të rremë.
- Konflikte strukturore të regjistruara, jo të bashkuara: Shop `kind` vs Shop Plus `type`; Events legacy vs Plans; profile/block/membership dhe raportime lokale kundrejt enforcement global. Produkti real kërkon pronësi/objekt kanonik dhe migrim të versionuar.

<a id="evidence"></a>
## Indeksi i provave — mos përsërit punën e verifikuar

Këto janë korrigjime **në skenarët e testuar**, jo certifikim i gjithë modulit. SHA-të dhe dështimet ndërmjetëse ruhen në [arkivin e plotë CURRENT_STATE](docs/archive/continuity/CURRENT_STATE.pre-58e0189.md). Provat e fundit dhe kufijtë për çdo modul: [Phase 1 QA](docs/PHASE1_QA_HANDOFF.md).

| Çështja / rezultati | Source ose QA SHA | Actions PASS |
|---|---|---|
| A1-01 korruptim/shape core, raw ruhet | `28fbb21651e7ea5c3587c6ec4beb1c383868d51c` | [205 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40182289194) |
| A1-02 Settings/Profile/Messages quota, draft/Retry | runtime `701ea1c8f047029e831b3cb0ed566d1d25bcdaa3`; QA `13b98d5b863116339e46ffa0fcd5c5ac60917a75` | [214 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40183539754) |
| A1-03 Plans stale-tab rejection | `b9bf7baf6dcdebbc584ae7adc9d3f5d68d6b5423` | [215 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40184192757) |
| A1-04 UGC Connections / A1-06 ARIA escaping | runtime `821030e1e309aa13f302dd9aef1a30d49538987a`; QA `94fac5f962078e2e96b40d5f28d037b5301977a6` | [217 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40186477490) |
| A1-05 Plans detail locale | runtime `1b24651791db0af53981e6e5eba72440cffb2313`; QA `0b7bc279f8dca8e85fd55c3f08499e2900e19f38` | [218 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40187454699) |
| A1-07 reset social/quota | `11bdf46b7e9736475a1081444b1a7bcaccad8aac` | [221 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40188067150) |
| M16 Shop Plus field error association | `ec70a92c56b207a4bd5ccaa79f01d73f38bd36ac` | Përfshihet në suite-n e fundit; pending WebKit historik nuk është bllokues aktual |
| Story timer/draft/Retry dhe Messages stale tab | `0deea7d4128de63ed1dedf2184d231121f67036f` | [232 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40206834620) |
| Governance status historik i panjohur | `00fdf0196b4a9201e884e7bc3a1a6a61dd4f6559` | [235 +16](https://github.com/titanfit102-bit/Illyrian/actions/runs/40208002522) |

[Phase 3 QA](docs/PHASE3_INTEGRATION_QA.md): source `a9a380cfa570a2a07c3c7b0ae814817e630e8e99`, 22/22 teste të reja lokale dhe 6/6 probe responsive/fokus; prova remote/SHA dhe kufijtë ruhen në raport/CURRENT_STATE. IN9 ekzistuese u ripërdorën; nuk u gjet një checkpoint i veçantë 3.2 në HEAD bazë. Interesi i skaduar/i pavlefshëm nuk paraqitet si match, “Organizo sërish” është draft, jo recurrence/auto-invite. Follow-up `7418636`: njoftimi i parë i Connections/Hera e parë tani shfaq suksesin ose dështimin pa rindërtuar formularin; 6 prova të reja sq/en/it dhe kandidat i ri ruhen në të njëjtin raport. Kontratat/IDs/ruajtja nuk ndryshojnë.

**Mobile UI precision — i verifikuar vetëm në browser:** source `08d773cca9398f7d454abb6ada2aed7b14cd2201`, [267 Chromium +16 WebKit PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137), [security PASS](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035149), immutable Preview [READY](https://illyrian-demo-2gv5m563l-un24.vercel.app/). Korrigjim i renditjes Stories vs Shop inject; menu 5 tabs dhe touch targets 44+px, fake status/homebar hidden vetëm në mobile; desktop mockup i ruajtur. Captures: [para](https://github.com/titanfit102-bit/Illyrian/actions/runs/40241438045/artifacts/12617440183) / [pas](https://github.com/titanfit102-bit/Illyrian/actions/runs/40246035137/artifacts/12618099658); **pa pixel-diff/manual screenshot PASS ose certifikim Android/iOS**. Hapat e hapur vetëm te CURRENT_STATE dhe worksheet fizike.

Provat e vjetra F01–F10, ciklet i18n, dështimet e korrigjuara të testeve, Preview-t dhe vendimet e autorizimit mbeten në arkiv. F05 ka kandidat të verifikuar; F06/A1-09 nuk është enforced. A1-08 metadata është rifreskuar, por një PR description historik nuk mbizotëron ndaj gjendjes LIVE. Visual suite: 63 bazë +24 sq/en/it portrait/landscape (87 të pritshme); kapja e screenshot-eve nuk është pixel-diff ose provë shqyrtimi të çdo pamjeje. CSS root 200% dhe Linux WebKit nuk janë OS text scaling, Safari fizik, TalkBack/VoiceOver.

## Siguria, cilësia dhe procesi

[AGENTS](AGENTS.md) dhe [SECURITY_REGISTER](docs/security/SECURITY_REGISTER.md) udhëheqin punën; regjistri është burimi i vetëm i gjendjes së sigurisë. Arkitektura/threat model/matrix/release gates ekzistojnë te `docs/security/`; raportimi te [SECURITY](SECURITY.md). Për çdo ndryshim vlerëso riskun; zbato mbrojtjet dhe kontrollet përkatëse. Ndryshimet kozmetike/dokumentuese nuk kërkojnë audit të plotë. Mos anashkalo kontrolle kritike ose zbulo detaje sensitive publike.

CI ekzistuese: [browser QA](.github/workflows/illyrian-v17-browser-qa.yml), [security](.github/workflows/illyrian-security.yml), `qa/*.spec.cjs`, konfigurimet Playwright dhe inventari locked `security/`. PR drejt integrimit pa path filter; feature-push i dyfishtë është hequr. Security-baseline kontrollon pattern secrets/current tree, disa static hazards, sintaksën, vendor parity dhe advisories; jo SAST/histori gjithëpërfshirëse. Schedule javor nuk ekzekutohet sa workflow është vetëm në feature branch; pa pretendim monitorimi në sfond.

Checks e propozuara për enforcement: `browser-smoke-pull_request`, `webkit-smoke-pull_request`, `security-baseline`; [F06](docs/F06_REQUIRED_CHECKS_DECISION.md) për procedurën administrative. Mos ndrysho politikat tani. CI e kaluar nuk është leje merge. Në CI BLOCKED/NOT RUN ruaj statusin real, jo PASS.

Procesi: verifiko HEAD/PR/diff → riprodho problemin → korrigjim minimal brenda scope-it → teste relevante → CI/source SHA → përditëso provat/dokumentet. Për performance mbaj para/pas të krahasueshme; pa thresholds të aprovuar/pa pajisje nuk deklarohet PASS. Ruaj Draft PR dhe release HOLD derisa të plotësohen gates/manual QA dhe miratimi.

## Plani dhe çfarë nuk është backlog i miratuar

1. **Faza 7 / P0-D–P1-D:** përfundo DEMO QA/i18n/UGC/a11y, korrigjimet e provuara, kandidatin Preview, M01–M18 fizik dhe sign-off për pranimin e deklaruar; F06 është shtyrë për fazën reale, pa ndryshim të mekanizmave/gates ekzistuese. Hapi i radhës konkret ruhet vetëm te CURRENT_STATE.
2. **Faza 8 / M0–M1:** validim i tregut/nevojës dhe MVP; vendim klient/backend, kontrata data/API/error, threat model, identitet/privacy/object authorization me negative tests.
3. **M2–M3 / P1-R:** vertical slice/pilot i kufizuar; community/plan/capacity, messaging/media/notifications dhe discovery/inquiry Shop vetëm sipas scope-it të miratuar.
4. **M4 / P2:** pagesa/KYC/KYB/refund vetëm pas provave ekonomike/ligjore/provider; **M5 / P3:** security/device/a11y, operacione/monitorim/backup-restore, staged release dhe sign-off; zgjerim sipas metrikave.

[Blueprint §12](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#12-demo--androidios-implementation-map-2026-10-25-readiness-design) mban hartën DEMO → Android/iOS, outbox/idempotency/lifecycle, Google Play/App Store dhe native/backend prerequisites; janë kërkesa, jo APK i ndërtuar. [Roadmap-i ekzistues](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md) dhe M0–M5 nuk zëvendësohen nga etiketat P0–P3.

[Raporti strategjik O1–O8](docs/research/ILLYRIAN_PRODUCT_INNOVATION_STRATEGIC_REVIEW_2026-10-23.md) është kërkim, jo ndryshim roadmap-i ose autorizim implementimi/shpenzimi/kontaktimi. O1 link→veprim, O2 grupe të vogla, O3 kërkesa/oferta, O4 besim, O5 disponueshmëri, O6 diaspora, O7 kërkim shumëgjuhësh, O8 rikthim përmes veprimeve. O2/O3 janë alternativa për validim, jo dy veçori të miratuara bashkë. Vlerësimet e kohës/kostos/metrikave nuk janë kuotime ose kërkesë e provuar. Të drejtat/licencat për materiale të jashtme shqyrtohen para ripërdorimit real.

## Si ruhet vazhdimësia pa fryrë dokumentet

- Lexo CURRENT_STATE → këtë ACTIVE SNAPSHOT → AGENTS/security register dhe vetëm seksionet e nevojshme të blueprint/i18n/QA. Verifiko LIVE HEAD, diff pas checkpoint-it, PR/CI; Preview vetëm kur relevant. Mos nis nga zero dhe mos hamendëso histori të paarritshme.
- Pas ndryshimit domethënës e të verifikuar, përditëso automatikisht të dy skedarët sipas rolit: status/bllokues/hapi pasues në CURRENT_STATE; vetëm ndryshimet afatgjata të arkitekturës/vendimeve/kontratave/planit këtu. Kur një pjesë nuk ndryshon, mos shto tekst të dyfishuar vetëm për të prekur skedarin.
- Zëvendëso përmbledhjen e vjetër aktive, mos prepend checkpoint-e të plota në të dy dokumentet. Provat e hollësishme mbeten në raportin/regjistrin përkatës dhe Git commits; arkivo vetëm histori me vlerë unike. Regjistri i sigurisë ndryshohet kur ndryshon realisht risku/kontrolli/prova.
- [Arkivi i vazhdimësisë](docs/archive/continuity/README.md) ruan të dy dokumentet e plota para konsolidimit, integritetin dhe referencat. Lexoje sipas nevojës, jo në çdo bisedë. Nuk ka punë automatike në sfond pa mekanizëm të autorizuar.

## Browser CI evidence reuse — 26 October 2026

The owner authorized conservative documentation-only Actions optimization. Existing workflow triggers/check names stay; scripts/ci/browser_scope.py defaults to full QA and requires a same-base ancestor with actual successful browser test steps before documentation-only reuse. Do not use the accumulated PR diff as the incremental change or inherit a green light-only job as full test proof. Security-baseline always executes; no tests deleted or administrative policies changed. Current results belong in CURRENT_STATE/Actions.


## Marketplace programme — active owner direction, 26 October 2026

The previous GitHub Actions optimization is complete; see CURRENT_STATE/Actions. New five-phase request is preserved **in full** in the [existing roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md#marketplace-programme--owner-request-26-october-2026). At the phase 1 checkpoint only Shop was authorized and the agent stopped before phase 2. The owner has now explicitly requested phase 2; see the current direction below. Phases 3–5 remain PLANNED. New numbering does not replace historical QA Phase 1/3 or Phase 7/8/M0–M5.

[Blueprint §15](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#15-marketplace-programme--phase-1-shop-26-october-2026) holds phase 1 design, plan, canonical real catalog/data/API/roles/states/mobile acceptance and decisions. Apply AGENTS classification automatically. DEMO now adds business discovery/profile presentation, accent-insensitive multilingual category search, property/jobs and relevant filters/forms; optional salary is explicitly unknown, never free work. The shared `IllyrianShopDiscovery` helper shares **presentation/search only**, not catalog/state. Existing `Banesa me qira` storage code and all old keys/IDs remain; no raw rewrite or destructive merge. Shop Plus comparisons, Kërkoj, stock, simulated orders/returns/promotion/reporting remain. Real Shop/Plus are future views over one Seller→Shop→Listing/order source, not separate inventories.

GPS remains optional/unused. Business profile example hours are fictional, other hours/availability unknown; no real contact or verified identity. Optional actual Map/provider, real hiring policy/MVP, payments and monetization remain DECISION REQUIRED. Phase 2 tagging/promotions is now authorized by the subsequent owner request below; phase 3 staff/inbox, phase 4 verification/Pro and phase 5 moderation remain outside the current task. Task 6B support references must be resolved from actual project evidence when phase 5 is reached; never invent a parallel admin system. Latest CI/source/Preview and practical next action belong only in CURRENT_STATE.


### Current direction — programme phase 2 only

Owner request “vazhdojm 2shin”, 26 October 2026, explicitly opened phase 2 after the verified phase 1 stop. Phase 2 is now delivered and remotely verified within the DEMO boundary; exact source/CI/Preview evidence is in CURRENT_STATE. **STOPPED before phase 3; phases 3–5 remain PLANNED until the owner continues.** [Blueprint §16](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#16-marketplace-programme--phase-2-social-commerce-26-october-2026) maps all phase 2 requirements and real-app prerequisites. New `demo/ILLYRIAN_COMMERCE_v1.7.js` is a bounded presentation/reference helper, not another marketplace/inventory/order store. It reads source-qualified adapters in existing Shop/Plus; content metadata stays in the existing core/creator stores as optional `commerceRefs` / `commerceSponsored`. Unchanged historical records remain valid; no raw rewrite on load.

Posts/photos can tag a business and product/service; local Story/Reel can reference a product while retaining their existing activity link. Taps recheck source/existence/expiry/status/stock, open the exact existing catalog view, and restore source/reply draft/scroll/focus. Missing/expired/no-stock targets are disabled, not replaced by a lookalike. Sponsorship is an explicit DEMO flag/disclosure, never verification or a paid service; Search's contextual example reuses existing promoted Shop Plus k2. Feed/Profile share the same content references; Shop promotion chips remain. New reference parsing/output is bounded/escaped, with draft-retaining publication rejection, quota rollback and Retry. No network tracker, backend, billing, staff/inbox, verification or moderation system was added. Browser evidence remains bounded and current results belong only in CURRENT_STATE.
