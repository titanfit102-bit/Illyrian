# ILLYRIAN — Demo v1.4 | Nga përmbajtja te pjesëmarrja

Statusi: prototip HTML lokal. Baza: v1.3, e ruajtur pa ndryshime.

## Çfarë ndryshoi
- Feed: postimi demonstrues i Besës për takim shoqëror lidhet tani me planin korrekt "Kafe dhe njohje të reja" në Romë. U korrigjua ikona kontekstuale e mëparshme e futbollit, që nuk përputhej me aktivitetin.
- Story: Story i Besës paraqet vetëm një buton të qartë që çon te i njëjti plan, me qytetin dhe orarin.
- Reels: demonstrimet e Leonit dhe Besës përmbajnë lidhje kontekstuale për planin përkatës, pa e paraqitur një fotografi të animuar si video reale.
- Në dritaren e planit shfaqet përmbajtja burimore (Feed / Story / Reel) dhe butoni "Kthehu", që rikthen kontekstin e mëparshëm.
- Hyrja normale te Eventet nuk shfaq një burim të vjetër.
- Statuset e kërkesave, komuniteti, organizatori dhe pjesëmarrësit vazhdojnë të përdorin mekanizmin demonstrues të v1.3.
- Pesë ikonat minimaliste të miratuara, fotografia dinamike e profilit, Light/Dark/Automatik dhe hyrjet e Eventeve mbeten të paprekura.

## Testimi i kryer
- JavaScript: kontroll sintakse me Node.js --check.
- Chromium me përmbajtjen HTML të ngarkuar lokalisht dhe ruajtje lokale të simuluar: Feed → plan → kthim, Story → plan → kthim, Reel → plan → kthim, hyrje normale te Eventet, ndërrim statusi i kërkesës.
- Pamja në 430 × 900 në Dark dhe Light; pa tejkalim horizontal.
- Asnjë përjashtim JavaScript në rrjedhat e kontrolluara.
- Krijimi i postimeve, lidhja e profilit dhe ruajtja e të dhënave në telefon fizik nuk janë ritestuar plotësisht në v1.4.

## Kufizime
- Nuk ka backend, përdorues, media, njoftime ose komunikim real.
- Përmbajtjet, komunitetet, eventet, fotografitë dhe statuset janë demonstrime.
- Lidhjet kuratore janë shembuj të hardkoduar, jo algoritëm rekomandimi.
- Nuk është verifikuar ende hapja e adresës publike në pajisjen e përdoruesit.
- Ky version nuk ndryshon specifikimet e miratuara ose dokumentet në Google Drive.
