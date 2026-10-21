# ILLYRIAN — Demo v1.5 | Krijimi i Stories dhe Reels

**Status:** Prototip lokal HTML. **Baza:** v1.4 ruhet veçmas, pa ndryshime.

## Funksionet e reja
- Studio në kryefaqe për krijimin e një **Story me fotografi** ose një **Reel demonstrues nga një fotografi e animuar**.
- Fotografitë JPG/PNG/WebP mund të zgjidhen nga pajisja (deri në 8 MB para zvogëlimit); përndryshe ka fotografi shembull.
- Shto përshkrim deri në 180 karaktere, shiko pamjen paraprake, dhe lidh opsionalisht Story/Reel me një aktivitet ekzistues.
- Publiko në **demonstrimin lokal**: përmbajtja shfaqet në kryefaqe dhe profil, mund të hapet, pëlqehet dhe fshihet.
- Nga Story/Reel i krijuar kalon te aktiviteti i lidhur dhe kthehesh te përmbajtja.
- Përmbajtja ruhet vetëm në `localStorage` të shfletuesit; deri në gjashtë Stories dhe gjashtë Reels demonstrues. Nuk dërgohet te serveri.
- Lidhja me fotografi, navigimi me pesë ikona, njoftimet, Eventet dhe postimet ekzistuese mbeten funksionale.
- U hoq një bllok i dyfishuar për krijimin e përmbajtjes në kryefaqe.

## Testet e kryera
- `node --check`: pa gabime sintakse JavaScript.
- Chromium në madhësi telefoni: krijimi i Story dhe Reel, pamja paraprake, lidhja e një aktiviteti, kthimi, fshirja, ruajtja/ringarkimi i gjendjes me `localStorage` të simuluar.
- Ngarkimi dhe zvogëlimi i fotografisë nga pajisja: kaloi, imazhi u shfaq dhe u ruajt si JPEG lokal.
- Dritaret e Reels, navigimi dhe profili: rrjedhat e kontrolluara funksionuan pa përjashtime JavaScript.
- Light dhe Dark Mode: kontrollet vizuale dhe temat kaluan.
- Pamja në gjerësi telefoni: pa tejkalim horizontal në rastet e kontrolluara.
- **Kufizim testimi:** shfletuesi i automatizimit nuk lejon navigim te `localhost`. Testet përdorën `set_content` dhe një `localStorage` të simuluar; nuk janë provë e instalimit apo përdorimit në një telefon fizik.

## Kufizimet dhe kontrollet e ardhshme
- Reels e krijuara në v1.5 janë **fotografi me animacion**, jo video të vërteta. Nuk ka ngarkim video, kodim video apo shpërndarje mes llogarive.
- Nuk ka backend, regjistrim të vërtetë, identitet, moderim, ose ruajtje në server.
- Ruajtja varet nga hapësira dhe politikat e shfletuesit. Rifreskimi / fshirja e të dhënave të shfletuesit mund të largojë përmbajtjen.
- Testimi në telefon fizik dhe vizita reale e URL-së publike mbeten për verifikim nga përdoruesi.
- Nuk është modifikuar Google Drive ose ndonjë projekt tjetër.
