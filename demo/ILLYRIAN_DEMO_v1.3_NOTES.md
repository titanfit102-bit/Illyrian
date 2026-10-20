# ILLYRIAN — Demo v1.3 | Komunitetet dhe aktivitetet

**Baza:** ILLYRIAN v1.2, e ruajtur në GitHub.
**Kategoria:** përmirësim i prototipit interaktiv HTML. Nuk ka përdorues, organizatorë ose mesazhe reale.

## Përmirësimet
- Çdo aktivitet demonstrues lidhet me një nga komunitetet shembull: Milano, Romë ose Krijuesit shqiptarë.
- Nga karta e aktivitetit mund të hapësh komunitetin, dhe nga komuniteti të shohësh planin përkatës.
- Në detajet e planit shfaqen organizatori (profil demonstrues), pjesëmarrës shembull, kategoria, qyteti, orari dhe kapaciteti i përshkruar.
- Rruga kërkesë → pritje → pranim simulues → bisedë e grupit është më e lidhur. Kërkesa mbetet në ekran dhe statusi ndryshon menjëherë.
- Biseda e grupit shfaq lidhjet për kthimin te plani dhe te komuniteti.
- Rastet e aktiviteteve të anuluara / të mbushura vazhdojnë të bllokojnë kërkesa të reja.
- Ruajtja lokale e statusit pas hapjes së re të demonstrimit.
- Navigimi minimalist me 5 ikona, fotografia dinamike e profilit dhe Light/Dark/Automatik mbeten nga v1.2.

## Testimi
- Kontroll sintakse JavaScript me Node.js: kaloi.
- Chromium: 19 kontrolle automatike për navigimin, lidhjet ndërmjet ekraneve, profilet, pjesëmarrjen, bisedën, skenarët e bllokuar, ruajtjen e gjendjes dhe temat: kaluan.
- Nuk u gjetën përjashtime JavaScript në rrjedhat e testuara.
- Pamja 430 × 900 në Light dhe Dark u kontrollua pa tejkalim horizontal.
- Shfletuesi i testimit bllokonte navigimin te localhost, ndaj testet u ekzekutuan duke ngarkuar përmbajtjen direkt dhe duke simuluar ruajtjen lokale. Kjo **nuk** zëvendëson testimin e plotë në telefon real.

## Kufizimet
- Profili i organizatorit, pjesëmarrësit dhe numrat e vendeve janë të dhëna ilustrative.
- Nuk ka backend, autorizim të vërtetë të organizatorit, databazë apo chat ndërmjet përdoruesve realë.
- Nuk ka publikim të të dhënave nga shfletuesi.
- Versioni v1.2 dhe versionet e mëparshme mbeten të rikthyeshme.

## Hapi i rekomanduar më tej
Testim i përvojës së përmbajtjes / lidhjeve mes postimit, Reels dhe aktiviteteve, pa shtuar module të paplanifikuara dhe pa nisur ende aplikacionin final.
