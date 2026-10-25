# ILLYRIAN — arkivi i vazhdimësisë

Ky është arkivi i dedikuar i krijuar më 25 tetor 2026: inventari i plotë i HEAD-it nuk kishte një arkiv ekzistues vazhdimësie. `docs/research/` mbetet arkiv kërkimi; nuk përzihet me checkpoint-et operative.

## Lexo vetëm sipas nevojës

Gjendja aktive: [CURRENT_STATE](../../../CURRENT_STATE.md). Objektivat/arkitektura/autorizimet: [MASTER_HANDOFF](../../../MASTER_HANDOFF.md). Këtu ruhen **të plota** të dy dokumentet nga commit-i `58e0189f7da1cf9f8de08295c86c3dd10a7fd831`, përfshirë vendimet, autorizimet, SHA-të, testet PASS/FAIL/pending dhe Preview-t historike. Statuset e vjetra nuk janë detyra aktuale dhe nuk japin autorizim të ri.

## Kopjet dhe integriteti

Kopjet përmbajnë gjithë tekstin origjinal, me një notice historik dhe vetëm destinacionet Markdown relative të prefiksuara `../../../`, për të ruajtur lidhjet nga dosja e re. Heqja e notice-it dhe kthimi i këtij prefiksi rikthen përmbajtjen origjinale byte-for-byte; kjo u verifikua para commit-it. Burimet immutable mbeten gjithashtu në historikun Git.

| Burimi / kopja e plotë | Git blob origjinal | UTF-8 bytes / SHA-256 origjinal |
|---|---|---|
| [CURRENT_STATE.md](CURRENT_STATE.pre-58e0189.md) · [burimi immutable](https://github.com/titanfit102-bit/Illyrian/blob/58e0189f7da1cf9f8de08295c86c3dd10a7fd831/CURRENT_STATE.md) | `14e8c978e0c7ce46566efffd1e5519c07d74da48` | 111,240 / `a7f3061d40b4b85e7ddec46cd4c6a2621a0d0eb998a050f9f151afcbdce1202d` |
| [MASTER_HANDOFF.md](MASTER_HANDOFF.pre-58e0189.md) · [burimi immutable](https://github.com/titanfit102-bit/Illyrian/blob/58e0189f7da1cf9f8de08295c86c3dd10a7fd831/MASTER_HANDOFF.md) | `a458cd92dac005a1ee09d068b1ae40ff2b7f842e` | 131,084 / `544b7052281765ac1c2a7f088ab8899535739a1196bf50fc4aff0f6aa2d4706d` |

## Harta e rikuperimit

- **CURRENT_STATE i arkivuar:** autorizimi aktiv i 23 tetorit në §0/§4; F01–F10, F05/F06/Preview, UX-P2 dhe ciklet e keyboard/i18n; A1-01–A1-07 me SHA/CI/dështime ndërmjetëse; M16/M17; security/Stories/Messages/Phase 1 në krye. Gjej titullin ose ID-në konkrete, jo lexim të plotë çdo herë.
- **MASTER_HANDOFF i arkivuar:** vizioni dhe preferencat A–H; parimet arkitekturore dhe alternativat e hapura; vendimet strategjike të 23 tetorit; historia e cikleve i18n nga 22 tetori; kontratat, testet dhe autorizimet kronologjike.
- Provat aktive për modulet dhe kufijtë: [Phase 1 QA](../../PHASE1_QA_HANDOFF.md); siguria: [SECURITY_REGISTER](../../security/SECURITY_REGISTER.md); vendimet e miratuara: [blueprint §10](../../../architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md#10-consolidated-architecture-decisions--23-october-2026-approved-direction-not-implementation); i18n: [kontrata](../../../architecture/ILLYRIAN_I18N.md).

## Kontrolli i konsolidimit

U verifikuan ekzistenca e destinacioneve relative dhe anchors të dokumenteve të ndryshuara, mungesa e referencave hyrëse me anchor drejt seksioneve të hequra nga dy dokumentet aktive, rikthimi identik i burimeve, dhe diff vetëm dokumentues. Integrimi/main mbeten referencat e verifikuara në CURRENT_STATE; PR #1 mbetet Draft/unmerged. Nuk u ripërsërit QA funksional manual për këtë riorganizim pa ndryshim runtime; CI e HEAD-it të ri kontrollohet në GitHub pas ruajtjes. Lidhjet historike të jashtme ruhen si prova; nuk pretendohet rikontroll HTTP i çdo Preview/burimi të vjetër.

Përditësime të ardhshme: mbaj përmbledhjet aktive të shkurtra, provat në raportin/regjistrin kanonik dhe Git history; mos krijo një snapshot të ri të plotë pas çdo ndryshimi të vogël.
