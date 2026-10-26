# ILLYRIAN — CURRENT_STATE

Përditësuar: 26 tetor 2026 (Europe/Rome). **Faza aktuale: DEMO private për përdorimin e pronarit; repository PUBLIC.** Faza 1 mbetet PARTIAL / pranim final OPEN. Integrimi i Fazës 3 është i verifikuar vetëm në skenarët e raportuar; backend/native nuk janë implementuar.

## Gjendja e verifikuar

| Elementi | Gjendja / prova |
|---|---|
| Repository / dega | `titanfit102-bit/Illyrian` / `feat/i18n-shop-feedback-20261022` |
| PR | [#1](https://github.com/titanfit102-bit/Illyrian/pull/1), OPEN / DRAFT / UNMERGED → `demo/v1.7-illyrian-shop` |
| Kandidati i fundit i verifikuar plotësisht | `01c59571fc0ee26a69117e24cab8092ad1a890fe`; runtime/testet browser të pandryshuara nga `7b8943147fdd7a8189866b9d62257d279d63f531`. HEAD LIVE kontrollohet në GitHub, jo nga ky checkpoint |
| Browser QA | [40340427070](https://github.com/titanfit102-bit/Illyrian/actions/runs/40340427070), **296 Chromium +16 Linux WebKit PASS**, **12 classifier tests PASS** mbi `01c5957`; logjet 121633337637/121633436192/121637203714 të inspektuara. Test steps dhe base marker `015ce439e7c6d736149c6c300391586517664f62` SUCCESS; provë e plotë e ripërdorshme |
| Security | [40340427181](https://github.com/titanfit102-bit/Illyrian/actions/runs/40340427181) PASS mbi `01c5957`, job 121633327142: 7 fixtures negative, bounded scan/syntax/vendor dhe npm audit 0 në atë ekzekutim; jo audit global. Security ekzekutohet edhe në rrugën dokumentuese |
| Izolimi | Integrimi `015ce439e7c6d736149c6c300391586517664f62`; main `9f91b5c083b4482a70a2149483cc799360e6102c`; pa merge/Production |
| Preview | [Alias fiks i telefonit](https://illyrian-demo-git-feat-i18n-shop-feedback-20261022-un24.vercel.app/). `01c5957`: [immutable](https://illyrian-demo-n9raszgft-un24.vercel.app/), deployment `dpl_2gwBTaRxLon3cER9SiYvRzT2Ah92`, READY/target null dhe alias i lidhur sipas Vercel LIVE. Vetëm metadata/izolim i verifikuar këtu; jo app HTTP/assets PASS |

## Funksionet dhe provat që ruhen

- HTML/vanilla JS/localStorage; fixtures, jo llogari/autorizime/mesazhe/pagesa reale. Modulet, identiteti ILLYRIAN dhe të dhënat ekzistuese ruhen.
- Home: **Stories → composer ekzistues → Shop → Feed**. Mundësi ka 8 hyrje: Biznese, Tregu, Punë, Shërbime, Çfarë kërkon tani?, Aktivitetet e tua, Plane, Komunitete. Përdoren veprimet ekzistuese; Studio Story/Reel dhe formularët e postimit ruhen. Harta e saktë: [blueprint §14](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#14-knowledge-preservation-and-demoapk-boundary--26-october-2026).
- sq/en/it, semantic keys + adapter legacy; UGC/domain values të pandryshuara. Mirrors root/demo kontrollohen nga CI; numri i çelësave nuk provon përkthimin global.
- Audit IA-01/02/03/04/05/06/09: korrigjime të kufizuara për Plans stored-data rendering, stale Connections, draft/Retry Connections/Governance, Shop historical sort, header i18n, CI provenance dhe kontrast Reels Light. [Regjistri/provat](docs/security/SECURITY_REGISTER.md); jo mbulim global i çdo writer-i/sink-u. A1 të vjetra nuk rihapen pa kundërshembull të ri.
- [Faza 3](docs/PHASE3_INTEGRATION_QA.md): postime/komente Communities, c4 Shkolla & Universiteti, lidhje me Plans, GPS opsional/qytete manuale, IANA/DST dhe expiry. Repeat krijon draft manual; jo scheduler/auto-invite. Nuk ka provë të veçantë për checkpoint 3.2.

## Politika aktive dhe çështjet e hapura

Zbato [AGENTS: DEMO vs APK](AGENTS.md#demo-vs-apk--permanent-owner-policy). Informacionet për aplikacionin real ruhen te blueprint/roadmap; nuk kthehen në kërkesa implementimi të çdo patch-i DEMO. [MASTER_HANDOFF](MASTER_HANDOFF.md#authorization) mban autorizimet. Pa merge, main/Production, UI/funksione të ndryshuara nga kjo detyrë, backend/native, migrime destruktive ose shpenzime.

| Fusha | Statusi / hapi |
|---|---|
| QA fizike / review vizual | OPEN/NOT TESTED: M01–M18, Android/iPhone, TalkBack/VoiceOver, tastierë/safe areas, text scaling dhe performancë. [Worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md); jo kusht për çdo edit dokumentues, por pranim fizik pa prova nuk deklarohet |
| Kontrast Reels | Korrigjimi minimal dhe testi browser PASS në source 15f3a0e; review fizik/vizual mbetet OPEN. Shënimi i vjetër CODE FIXED/CI PENDING është superseded |
| i18n/UGC/a11y/ruajtja | PARTIAL: gjendje të rralla, own-media drafts, legacy writers dhe simultaneous races jo të certifikuara globalisht; mos bëj audit të plotë pa ndryshim relevant |
| F06 / IA-07 | Enforcement administrativ mungon, rulesets []/degët protected:false në kontrollin aktual. **Shtyrë për aplikacionin real me vendimin e pronarit**, jo bllokues i zhvillimit të DEMO-s. CI/ndalimi i merge pa miratim ruhen |
| Siguria reale | Auth/API/DB/DM/payment BACKEND; private disclosure/restore/operacionet UNKNOWN. Weekly schedule jo aktiv pa workflow në default branch; pa pretendim monitorimi në sfond |

## Hapi i saktë pasues

Vazhdo testimin e pronarit dhe përmirësimet DEMO sipas kërkesës konkrete: baseline automatik + teste relevante për ndryshimin; përdor CI të kaluar të të njëjtit kod pa e përsëritur manualisht. Regjistro defekte fizike kur ka pajisje/prova. Për fillimin e APK-së duhen vendimet M0/MVP/platformë dhe zgjerimi i hartës ekran→veprim→API/permission/error vetëm për slice-in e miratuar; mos ndërto backend paraprakisht.

## Konsolidimi i kësaj detyre

Vetëm dokumentacion: politikë e përhershme në AGENTS, hartë ruajtjeje në blueprint §14 dhe referenca historike në [arkivin ekzistues](docs/archive/continuity/README.md#consolidation-2026-10-26). Nuk hiqen teste/mbrojtje, nuk ndryshojnë Actions/required checks/release gates, UI ose kontratat. Verifikimi lokal: lidhje/anchors, ruajtje burimesh dhe diff vetëm Markdown; rezultati remote i këtij commit-i lexohet nga Actions, jo supozohet.

## GitHub Actions — risk-based documentation path

PR synchronize events use an incremental before→head delta, then require a successful full Chromium+WebKit run on an ancestor with the same PR base and only allowed Markdown changes since that tested source. Missing evidence/API errors/unknown files force full QA. Security/AGENTS/F06/workflow/test/config changes never qualify. Existing PR check names remain completed jobs on the light path; no pending path-filtered checks and no browser PASS claim for tests not executed. Security workflow is unchanged. Full remote execution on `01c5957` is verified above: the classifier correctly chose `full: runtime/config/security/unknown delta` after CI changes. This documentation-only evidence refresh is the real light-path verification candidate; its authoritative outcome is the [branch Actions history](https://github.com/titanfit102-bit/Illyrian/actions?query=branch%3Afeat%2Fi18n-shop-feedback-20261022), specifically browser-scope's evidence URL and skipped browser execution steps, plus the separately executed security-baseline. Read the run attached to this update's SHA; do not create another commit merely to record its CI outcome. No measured savings recorded in this snapshot. Recent LIVE history has one browser and one security PR run per SHA, no feature-push duplicates; different SHAs can still run concurrently. Keep cancel-in-progress:false: automatic cancellation is unimplemented and would need separate evidence about PR checks and reusable full-run availability.
