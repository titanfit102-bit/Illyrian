# ILLYRIAN — Demo v1.2 | Navigimi minimalist

**Status:** demo lokale, jo aplikacioni real. **Baza:** v1.1 e ruajtur pa ndryshime.

## Ndryshimet
- Navigimi i poshtëm përmban 5 hyrje me ikona vektoriale ~24 px: Kryefaqja, Zbulo, Reels, Mesazhe, Profili.
- Stili është i pastër, me vijë të hollë, pa 3D, neon apo gradientë të ikonave; elementi aktiv shënohet në mënyrë diskrete me të kuqe.
- Profili shfaq foton e llogarisë demonstrative në një rreth; fotoja mund të ndryshohet te **Profili → Ndrysho profilin** dhe ruhet lokalisht si miniaturë 160×160.
- Krijimi i postimeve (+), Eventet (kalendar) dhe Njoftimet (zile) janë në pjesën e sipërme. Eventet mbeten të aksesueshme edhe nga hyrjet e kryefaqes.
- Light, Dark dhe Automatik vazhdojnë sipas cilësimeve ekzistuese.
- Ndryshimi i emrit/bios së profilit ruan fotografinë e zgjedhur.

## Verifikimi i bërë
- Sintaksa JavaScript: Node.js `--check` kaloi.
- Chromium (render lokal): pesë tab-et, Reels, Inbox, profili, Eventet, krijimi i postimit, foto JPG dhe ruajtja e saj lokale u testuan.
- Light dhe Dark: paraqitja në pamje telefoni 420 × 910, pa tejkalim horizontal, pa gabime JavaScript në rrjedhat e kontrolluara.
- U verifikua restaurimi i fotografisë përmes ripërdorimit të gjendjes së ruajtur në një sesion të ri prove.
- **Jo i verifikuar:** testim në telefon fizik dhe sjellja e shpërndarjes publike pas një hapjeje reale të linkut.

## Kufizime
- Nuk ka login, databazë, mesazhe apo njoftime reale.
- Fotoja e zgjedhur mbetet vetëm në shfletues. Nuk dërgohet në server.
- Figurat e profileve të demonstrimit janë ilustrative; fotot reale të llogarive nuk ekzistojnë ende.
- Versioni v1.1 dhe versionet më të hershme ruhen të paprekura në GitHub.
