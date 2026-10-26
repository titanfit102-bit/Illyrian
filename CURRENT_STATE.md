# ILLYRIAN — CURRENT_STATE

Përditësuar: 26 tetor 2026 (Europe/Rome). **Faza aktuale: DEMO private për përdorimin e pronarit; repository PUBLIC.** Faza 1 historike e QA-së mbetet PARTIAL / pranim final OPEN; nuk është faza 1 e re e programit Shop më poshtë. Integrimi i Fazës 3 është i verifikuar vetëm në skenarët e raportuar; backend/native nuk janë implementuar.

## Gjendja e verifikuar

| Elementi | Gjendja / prova |
|---|---|
| Repository / dega | `titanfit102-bit/Illyrian` / `feat/i18n-shop-feedback-20261022` |
| PR | [#1](https://github.com/titanfit102-bit/Illyrian/pull/1), OPEN / DRAFT / UNMERGED → `demo/v1.7-illyrian-shop` |
| Kandidati runtime i verifikuar | `60bf624b2e8d9b4bdc21f8afe6712cba0897232f`, faza 2 e programit Shop; commit-i vijues i provave është vetëm dokumentacion. HEAD LIVE kontrollohet në GitHub |
| Browser QA | [40387000948](https://github.com/titanfit102-bit/Illyrian/actions/runs/40387000948), **322 Chromium +16 Linux WebKit PASS**, **12 classifier tests PASS** mbi `60bf624`; logjet 121797812360/121797903206/121801919143 të inspektuara. Suite e plotë e ekzekutuar, jo ripërdorim; përfshin 12 testet e reja të fazës 2 |
| Security | [40387001033](https://github.com/titanfit102-bit/Illyrian/actions/runs/40387001033) PASS mbi `60bf624`, job 121797812790: 7 fixtures negative, 87-file bounded scan, syntax/vendor dhe npm audit 0 në atë ekzekutim; jo audit global |
| Izolimi | Integrimi `015ce439e7c6d736149c6c300391586517664f62`; main `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge/Production |
| Preview | [Alias fiks i telefonit](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/). Runtime `60bf624`: [immutable](https://illyrian-demo-bh3hsqqx3-un24.vercel.app/), `dpl_6T1aasMMm2QmD4ngfHhjBqFCkti8`, READY/target null dhe alias i lidhur sipas Vercel LIVE. Root HTTP200 me burimin HTML të plotë + Vercel feedback script; tri JS, CSS dhe tri locale të ndryshuara HTTP200/exact source parity. Commit-i i provave vijues ndiqet nga alias/Actions, pa redeploy manual |

## Funksionet dhe provat që ruhen

- HTML/vanilla JS/localStorage; fixtures, jo llogari/autorizime/mesazhe/pagesa reale. Modulet, identiteti ILLYRIAN dhe të dhënat ekzistuese ruhen.
- Home: **Stories → composer ekzistues → Shop → Feed**. Mundësi ka 8 hyrje: Biznese, Tregu, Punë, Shërbime, Çfarë kërkon tani?, Aktivitetet e tua, Plane, Komunitete. Përdoren veprimet ekzistuese; Studio Story/Reel dhe formularët e postimit ruhen. Harta e saktë: [blueprint §14](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#14-knowledge-preservation-and-demoapk-boundary--26-october-2026).
- sq/en/it, semantic keys + adapter legacy; UGC/domain values të pandryshuara. Mirrors root/demo kontrollohen nga CI; numri i çelësave nuk provon përkthimin global.
- Audit IA-01/02/03/04/05/06/09: korrigjime të kufizuara për Plans stored-data rendering, stale Connections, draft/Retry Connections/Governance, Shop historical sort, header i18n, CI provenance dhe kontrast Reels Light. [Regjistri/provat](docs/security/SECURITY_REGISTER.md); jo mbulim global i çdo writer-i/sink-u. A1 të vjetra nuk rihapen pa kundërshembull të ri.
- [Faza 3](docs/PHASE3_INTEGRATION_QA.md): postime/komente Communities, c4 Shkolla & Universiteti, lidhje me Plans, GPS opsional/qytete manuale, IANA/DST dhe expiry. Repeat krijon draft manual; jo scheduler/auto-invite. Nuk ka provë të veçantë për checkpoint 3.2.

## Politika aktive dhe çështjet e hapura

Zbato [AGENTS: DEMO vs APK](AGENTS.md#demo-vs-apk--permanent-owner-policy). Informacionet për aplikacionin real ruhen te blueprint/roadmap; nuk kthehen në kërkesa implementimi të çdo patch-i DEMO. [MASTER_HANDOFF](MASTER_HANDOFF.md#authorization) mban autorizimet. Scope aktiv: vetëm faza 3 e programit Shop, e autorizuar pas përfundimit të fazës 2; staf/inbox demonstrues në panelin ekzistues dhe specifikime APK. NDALO përpara fazës 4. Kufizimi i mëparshëm vetëm CI/dokumentacion i përkiste detyrës së mbyllur. Pa merge, main/Production, backend/native, migrime destruktive ose shpenzime.

| Fusha | Statusi / hapi |
|---|---|
| QA fizike / review vizual | OPEN/NOT TESTED: M01–M18, Android/iPhone, TalkBack/VoiceOver, tastierë/safe areas, text scaling dhe performancë. [Worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md); jo kusht për çdo edit dokumentues, por pranim fizik pa prova nuk deklarohet |
| Kontrast Reels | Korrigjimi minimal dhe testi browser PASS në source 15f3a0e; review fizik/vizual mbetet OPEN. Shënimi i vjetër CODE FIXED/CI PENDING është superseded |
| i18n/UGC/a11y/ruajtja | PARTIAL: gjendje të rralla, own-media drafts, legacy writers dhe simultaneous races jo të certifikuara globalisht; mos bëj audit të plotë pa ndryshim relevant |
| F06 / IA-07 | Enforcement administrativ mungon, rulesets []/degët protected:false në kontrollin aktual. **Shtyrë për aplikacionin real me vendimin e pronarit**, jo bllokues i zhvillimit të DEMO-s. CI/ndalimi i merge pa miratim ruhen |
| Siguria reale | Auth/API/DB/DM/payment BACKEND; private disclosure/restore/operacionet UNKNOWN. Weekly schedule jo aktiv pa workflow në default branch; pa pretendim monitorimi në sfond |

## Programi Shop — faza 1 (26 tetor 2026)

Kërkesa burimore për të pesë fazat është ruajtur e plotë në [roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md#marketplace-programme--owner-request-26-october-2026); klasifikimi DEMO/BACKEND/vendime dhe kontratat e fazës 1 në [blueprint §15](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#15-marketplace-programme--phase-1-shop-26-october-2026). Numërimi është i ri, jo Faza 1/3 historike e QA-së.

- IMPLEMENTUAR DEMO: pamja Bizneset dhe profile në Shop, profile të përbashkëta si paraqitje në Shop Plus (pa kopjim katalogu), kërkim pa ë/ç dhe me kategori sq/en/it, Prona/Punë, pagë opsionale, filtra specifikë, fusha të parëndësishme të çaktivizuara duke ruajtur draftin dhe përkthimet. Stoku/oraret/kontakti mbeten fiktive ose të panjohura; GPS nuk thirret.
- RUHEN: Shop/Shop Plus, kodet/IDs/çelësat e ruajtjes, Kërkoj/krahasimi/stoku/porositë/raportimet, rollback/Retry, funksionet sociale dhe 5% vetëm ilustrues. Nuk ka bashkim localStorage, backend, pagesë, abonim ose reklamim real.
- SPECIFIKUAR BACKEND, jo ndërtuar: një katalog Seller→Shop→Listing, mapping i kontrolluar i burimeve, ekranet/veprimet/statuset/lejet/API-të dhe pranimi Android/iOS. Harta reale/provider/monetizimi/MVP/politikat e punës mbeten vendime të mëvonshme.
- Teste të reja: 14 raste browser për discovery/profile/GPS/manual city, kategori/filtra, Prona/Punë, ruajtje të ndarë, UGC dhe draft/fokus/gjuhë. Lokalisht **87/87 regresione relevante PASS**, përfshirë **14/14 të reja**. Sintaksë/vendor parity, 12 classifier tests, secret detector (7 negative fixtures), locale mirrors dhe npm audit 0 PASS. Lista e vjetër prej 4 kategorish në 6 assertions tani përfshin Prona/Punë, pa hequr kontrollet ekzistuese. Remote **VERIFIED** në `01e1270`: 310/310 Chromium, 16/16 Linux WebKit, 12/12 classifier dhe Security PASS ([browser 40351708229](https://github.com/titanfit102-bit/Illyrian/actions/runs/40351708229), [Security 40351707783](https://github.com/titanfit102-bit/Illyrian/actions/runs/40351707783)). Shqyrtim i pavarur i diff-it: pa gjetje vepruese; dy pamje 390px të inspektuara, jo certifikim fizik.

## Programi Shop — faza 2 (26 tetor 2026)

Kërkesa e re e pronarit “vazhdojm 2shin” autorizon vetëm fazën 2; ndalimi i mëparshëm para saj është përmbushur/superseded. Fazat 3–5 mbeten PLANNED. Origjinali i pesë fazave është i pandryshuar në roadmap; [blueprint §16](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#16-marketplace-programme--phase-2-social-commerce-26-october-2026) ruan design/plan/API/statuset/lejet/Android+iOS dhe kufijtë realë.

- IMPLEMENTUAR DEMO: një biznes + një produkt/shërbim si etiketa në postim/foto; produkt në Story/Reel duke ruajtur lidhjen ekzistuese me aktivitet. Referencat `{source,type,id}` hapin Shop ose Shop Plus ekzistues, pa katalog/porosi të kopjuara.
- Sponsorizuar · DEMO me shpjegim të veçantë pagesë≠verifikim në postime dhe profil, opsion në media; një shembull i etiketuar te Search/Biznese referon ofertën promovuese ekzistuese të Shop Plus. Shop ruan etiketat/katalogun ekzistues. Pa reklamim real, pixels, pagesa, abonime ose vendime çmimi.
- Listim i fshirë/munguar, i skaduar, status jo aktiv ose pa stok: shfaqje e kufizuar/çaktivizuar, rikontroll para publikimit dhe klikimit. Asnjë fallback sipas emrit/ID-je të burimit tjetër. Draftet, kuota/Retry, gjuha, scroll, përgjigjja e papërfunduar dhe fokusi i burimit ruhen në rrjedhat e mbuluara.
- Lokalisht **51/51 regresione relevante PASS**, përfshirë **12/12 të reja**; sintaksë/vendor, detector me 7 fixtures negative/current-tree scan, locale mirrors dhe npm audit 0 PASS. Rishikimi i pavarur gjeti një kthim fokusi të pasaktë për etiketa të përsëritura; i korrigjuar dhe mbuluar. Escape nuk mbyll më edhe viewer-in e rikthyer. Observer-i nuk zëvendëson butonin identik të fokusuar. Kontrolluar dy pamje 390px/320px; jo certifikim fizik.
- Remote **VERIFIED** në `60bf624`: 322/322 Chromium (12 teste të reja), 16/16 Linux WebKit, 12/12 classifier dhe Security PASS; Preview READY/source parity, sipas provave sipër. Backend/ID autoritative, pronësi/privatësi/miratim/moderim dhe kriteret reale janë specifikime, jo kontrolle server-side të implementuara. Emri ekzistues lokal i biznesit është vetëm ID demonstrimi, jo identitet juridik.

## Programi Shop — faza 3 (26 tetor 2026)

Pronari autorizoi fazën 3 pas dorëzimit të fazës 2. [Blueprint §17](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#17-marketplace-programme--phase-3-business-team-and-shared-inbox-26-october-2026) ruan planin, matricën e lejeve dhe kontratat/API/statuset/testet reale. Faza 4–5 mbeten PLANNED.

IMPLEMENTUAR DEMO, ende pa verifikim remote: Governance → Panele pune → Biznes për staf/inbox fiktiv, lidhur nga profilet ekzistuese Shop/Plus. Persona fiktivë me IDs të ndara, ftesë/pranim si vetja, role dhe revokim, zgjedhje publike vetëm për veten, caktim bisedash/përgjigje në emër të dyqanit, aktor i brendshëm dhe numër bisedash pa përgjigje. `businessTeams` është shtesë opsionale e çelësit ekzistues Governance; katalogët dhe mesazhet personale nuk bashkohen/importohen. Lejet janë vetëm simulim UI në këtë panel, jo autentikim ose autorizim real i DEMO-s.

Lokalisht: 61/61 regresione relevante PASS; pas korrigjimeve të fundit, 24/24 Business/Governance PASS, përfshirë 13 testet e reja. U testuan sq/en/it, kthimi/fokusi nga Shop/Plus, ftesat/rolet/revokimi, caktimi/përgjigjja e vetme/aktor i brendshëm, opt-in publik sipas burimit, kuota/Retry, konfliktet mes skedave/me mungesë storage event, të dhëna të keqformuara/UGC literal dhe biznes i hequr. Rifreskimi i stafit publik pas opt-out/revokimit, mesazhi i saktë i konfliktit dhe drafti i rolit gjatë ndërrimit të gjuhës u korrigjuan me prova. Rishikimi i pavarur përfundoi pa gjetje të mbetura. Pamjet 390px/320px të inspektuara; në 320px pa tejkalim horizontal dhe butonat ≥44px, jo certifikim fizik.

Sintaksë/vendor, 7 detector fixtures/skanim i kufizuar, locale mirrors, burimi origjinal dhe npm audit 0 PASS. Remote i fazës 3 mbetet **NOT VERIFIED** deri në inspektimin e Actions/Preview. Katalogët/IDs/çelësat, mesazhet personale dhe fazat 1–2 ruhen; asnjë backend/pagesë/abonim ose fazë 4–5 nuk është ndërtuar.

## Hapi i saktë pasues

Faza 2 mbetet e përfunduar në kufirin DEMO. Përfundo verifikimin lokal/remote dhe Preview të fazës 3, përditëso provat dhe **NDALO përpara fazës 4**. Fazat 4–5 mbeten PLANNED; QA fizike dhe gates reale mbeten OPEN. Mos ndërto backend/native nga specifikimet.

## Konsolidimi historik — vetëm dokumentacion

Vetëm dokumentacion: politikë e përhershme në AGENTS, hartë ruajtjeje në blueprint §14 dhe referenca historike në [arkivin ekzistues](docs/archive/continuity/README.md#consolidation-2026-10-26). Nuk hiqen teste/mbrojtje, nuk ndryshojnë Actions/required checks/release gates, UI ose kontratat. Verifikimi lokal: lidhje/anchors, ruajtje burimesh dhe diff vetëm Markdown; rezultati remote i këtij commit-i lexohet nga Actions, jo supozohet.

## GitHub Actions — risk-based documentation path

PR synchronize events use an incremental before→head delta, then require a successful full Chromium+WebKit run on an ancestor with the same PR base and only allowed Markdown changes since that tested source. Missing evidence/API errors/unknown files force full QA. Security/AGENTS/F06/workflow/test/config changes never qualify. Existing PR check names remain completed jobs on the light path; no pending path-filtered checks and no browser PASS claim for tests not executed. Security workflow is unchanged. Full remote execution on `01c5957` remains archived in the linked baseline run. Optimization was completed before this new objective: docs-only source `0a8f798c2fecce89e51a15258ad2eea23c63df75`, [light run 40345540113](https://github.com/titanfit102-bit/Illyrian/actions/runs/40345540113) reused full evidence 40340427070; both browser execution steps SKIPPED and reuse steps SUCCESS, 12 classifier tests PASS. [Security 40345539825](https://github.com/titanfit102-bit/Illyrian/actions/runs/40345539825) actually executed/PASS. Sum of browser workflow job elapsed times: 487s full versus 16s light; billed minutes not measured. Do not reopen optimization or create commits merely to record minor CI outcomes. Recent history had one browser and one security PR run per SHA; different SHAs can run concurrently. Automatic cancellation remains unimplemented, cancel-in-progress:false unchanged.
