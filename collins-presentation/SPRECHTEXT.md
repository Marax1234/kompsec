# Sprechtext – Collins Aerospace Ransomware-Angriff

**Navigationshinweise:**
- `→` / `Space` = nächste Folie (horizontal)
- `↓` = vertikale Sub-Folie (bei Stack-Folien 4 und 8)
- `[KLICK]` = Fragment aufdecken (Space oder →)
- `[PAUSE]` = kurze Sprechpause, Publikum lesen lassen
- `[WARTEN]` = auf Animation warten (CountUp / Typed.js)

---

## Folie 1 – Titelfolie

Montagmorgen, 06:00 Uhr, BER. 29 Flüge gestrichen. Kein einziger Check-in-Kiosk funktioniert. Niemand weiß genau warum.

Das ist kein Szenario. Das ist der 20. September 2025.

Heute analysieren wir, wie ein drei Jahre alter Infostealer-Fund die kritische Infrastruktur von fünf europäischen Flughäfen lahmlegt – und was das über den Zustand unserer Supply Chains aussagt.

---

## Folie 2 – Agenda

`[KLICK]` – linke Spalte erscheint

Wir starten mit der Angriffskette selbst: Timeline, Akteure, technische Details und das MITRE ATT&CK Mapping.

`[KLICK]` – rechte Spalte erscheint

[PAUSE]

Dann die Konsequenzen: Was fällt aus, welche Daten gehen verloren, welche rechtlichen Pflichten greifen – und was hätte verhindert werden können.

---

## Folie 3 – Timeline

Die Angriffskette läuft in drei Wochen ab. Wir gehen sie Schritt für Schritt durch.

`[KLICK]` – 10. Sept.

10. September: Everest hat Zugang. Der Einstieg war kein Zero-Day, keine ausgeklügelte Methode – es waren FTP-Credentials, die seit 2022 kompromittiert sind und nie rotiert wurden.

`[KLICK]` – 11. Sept.

Einen Tag später beginnt die Exfiltration. Das System erkennt den Zugang und blockiert ihn – aber zu spät.

`[KLICK]` – 15.–18. Sept.

Vier Tage Verhandlung. RTX zahlt nicht. Everest weiß, dass ihnen noch eine Karte bleibt.

`[KLICK]` – 19. Sept. (rot hinterlegt)

19. September. [PAUSE] HardBit wird deployed. Die MUSE Core-Databases werden verschlüsselt. An fünf europäischen Flughäfen gehen gleichzeitig die Lichter aus.

`[KLICK]` – 20.–22. Sept.

Drei Tage Chaos. BER, Heathrow, Brüssel, Dublin – alle im manuellen Betrieb. Das bedeutet: Handzettel, Stift, und Warteschlangen bis auf die Straße.

`[KLICK]` – 24. Sept.

Vier Tage nach dem Ausfall: Festnahme eines 40-Jährigen in West Sussex. Der Deployer – vermutlich kein Everest-Mitglied, sondern ein RaaS-Affiliate.

`[KLICK]` – 29. Sept.

Nach zehn Tagen läuft ein Ersatzsystem. Die Normalisierung beginnt.

`[KLICK]` – 11. Nov.

Und dann, sieben Wochen später: 23 Gigabyte im Darknet. Lösegeld wurde nicht gezahlt – also veröffentlicht Everest. Das ist doppelte Erpressung als Geschäftsmodell.

Bevor wir die Angriffskette im Detail aufschlüsseln, kurz zum System, das angegriffen wurde.

---

## Folie 4A – Collins & MUSE: Überblick
*(Stack – mit `↓` zur nächsten Sub-Folie)*

Collins Aerospace ist eine RTX-Tochter – Raytheon Technologies, US-Rüstungs- und Luftfahrtkonzern. Ihr MUSE-System ist keine spezialisierte Lösung für einen Flughafen, sondern eine gemeinsame Plattform für rund 170 Flughäfen weltweit.

CUPPS – Common Use Passenger Processing Standard – bedeutet: Airlines teilen sich Schalter, Kiosks, Gates. Eine Infrastruktur, viele Nutzer. Das ist effizient. Und es ist ein Single Point of Failure.

Warum das problematisch ist, sehen wir auf der nächsten Sub-Folie. `[↓]`

---

## Folie 4B – Kritische Schwachstellen
*(↓ aus Folie 4A)*

`[KLICK]` – GlassFish

Oracle GlassFish Server Version 3.1.2.9 – veröffentlicht 2012. Die aktuelle Version ist 7.0.25. Dreizehn Jahre ohne Update in produktionskritischer Software, die Check-in-Systeme an 170 Flughäfen bedient.

`[KLICK]` – HTTP-Webmail

Webmail-Login über HTTP. Keine Verschlüsselung der Anmeldedaten. Das ist nicht 2012 – das ist 2025.

`[KLICK]` – FTP-Credentials

Und das ist der eigentliche Einstiegspunkt: FTP-Credentials, die 2022 durch RedLine Infostealer gestohlen wurden. Drei Jahre lang nicht rotiert.

[PAUSE]

Das ist der Befund, den Lawfare *„incredibly basic"* nennt. Kein Zero-Day. Keine Nation-State-Technik. Nur nicht gepatchte Software und nicht geänderte Passwörter.

---

## Folie 5 – Angriffsvektor

`[KLICK]` – Schritt 1

2022: RedLine – ein klassischer Infostealer – kompromittiert den Rechner eines Collins-Mitarbeiters. Die FTP-Credentials `aiscustomer` und `muse-insecure` landen in einem Credential-Leak-Dump.

`[KLICK]` – Schritt 2

Drei Jahre später, 10. September: Everest nutzt diese Credentials, authentifiziert sich an `ftp.arinc.com` – dem vMUSE-Backend. Legitimes Protokoll, legitime Credentials, keine Anomalie die auffällt.

`[KLICK]` – Schritt 3

11. September: 1,5 Millionen Passagierdatensätze, 3.637 Mitarbeitereinträge, über 50 Gigabyte Netzwerktopologie. [PAUSE] 50 GB Netzwerktopologie – das ist kein Dokument, das ist ein vollständiger Blueprint der gesamten Infrastruktur.

`[KLICK]` – Schritt 4 (rot)

19. September: HardBit verschlüsselt die Core-Databases. Was bisher Datendiebstahl war – schlimm, aber reversibel – wird jetzt zum operativen Ausfall.

Was diese Angriffskette MITRE-technisch bedeutet, kommen wir jetzt dazu.

---

## Folie 6 – MITRE ATT&CK Mapping

Wir mappen die Angriffskette auf MITRE ATT&CK. Das gibt uns eine strukturierte Sprache für das, was hier passiert ist.

`[KLICK]` – TA0001 Initial Access

T1078 – Valid Accounts. Nicht erkannt, weil die Credentials legitim sind. T1199 – Trusted Relationship, weil der FTP-Server ein regulärer Teil der Supply Chain ist.

`[KLICK]` – TA0002 Execution

T1204 – User Execution. Der RedLine-Infostealer braucht Nutzerinteraktion zur Erstinfektion 2022. Das ist der entfernteste Punkt der Kette – und der Ursprung aller Folgeprobleme.

`[KLICK]` – TA0005 Defense Evasion

T1078 nochmal – dieselbe Technik erlaubt gleichzeitig Initial Access und Defense Evasion. Legitime Credentials generieren keine Alerts in Standard-IDS-Systemen.

`[KLICK]` – TA0009 Collection

T1005 – lokale Daten. Passagier-, Mitarbeiter-, Topologiedaten. Alles was erreichbar ist, wird mitgenommen.

`[KLICK]` – TA0010 Exfiltration

T1048 – Exfiltration over Alternative Protocol. FTP über `ftp.arinc.com`. Regulärer Kanal, kein Tunnel, kein obfuscierter Traffic.

`[KLICK]` – TA0040 Impact

T1486 – Data Encrypted for Impact. HardBit. Der finale Schlag, der aus Datendiebstahl einen Infrastrukturausfall macht.

---

## Folie 7 – Threat Actors

Wir reden von zwei Akteuren – und das ist kein Zufall, das ist Geschäftsmodell.

Everest ist seit 2020 aktiv, russischsprachig, hybrid aufgestellt: sowohl Ransomware-Operator als auch Initial Access Broker. 105 Opfer in zwölf Monaten. Ihre Rolle hier: Exfiltration und Verkauf des Zugangs.

`[KLICK]` – HardBit-Karte

HardBit ist RaaS – Ransomware as a Service. Jeder der zahlt, kann es deployen. Kein eigenes Portal, keine Infrastruktur. Was HardBit bemerkenswert macht: es ist erkennbar mit Standard Windows Defender. Ein Affiliate, der Standard-AV nicht deaktiviert hat, deployt erfolgreich Ransomware an kritischer Infrastruktur.

`[KLICK]` – Blockquote

[PAUSE]

Das ist das Dual-Incident-Szenario. Everest verkauft den Zugang weiter. Ein separater Akteur deployt die Ransomware. Beide profitieren. Dieses Modell ist heute Standard im Ransomware-Ökosystem.

---

## Folie 8A – Schadensausmaß: Kennzahlen
*(Stack – mit `↓` zur Detailtabelle)*
*[WARTEN – CountUp läuft ca. 3 Sekunden]*

Fünf Flughäfen. 29+ gestrichene Flüge allein am ersten Tag. 1.000 kompromittierte Computer. 600 Prozent Anstieg von Cyberangriffen auf die Luftfahrt in den letzten Jahren. Zehn Tage bis zur Normalisierung.

Das sind die Zahlen. Welche Flughäfen konkret betroffen sind und wie unterschiedlich die Auswirkungen ausfielen, sehen wir auf der nächsten Folie. `[↓]`

---

## Folie 8B – Auswirkungen auf fünf Flughäfen
*(↓ aus Folie 8A)*

`[KLICK]` – BER

BER trifft es am härtesten sichtbar – zusätzlich erschwerend: Der Berlin-Marathon am selben Wochenende. Maximale Störung, maximale Öffentlichkeit.

`[KLICK]` – Heathrow

Heathrow ist begrenzt betroffen, weil British Airways ein eigenes System parallel betreibt. Das ist bereits eine Lektion.

`[KLICK]` – Brüssel

Brüssel fällt vollständig aus und hat die langsamste Recovery. Rein manueller Betrieb über Tage.

`[KLICK]` – Dublin

Dublin Terminal 2 muss Server from scratch rebuilden. Das bedeutet: keine Backups, die einen schnellen Restore erlauben.

`[KLICK]` – Cork

Cork betroffen, aber weniger gravierend.

Wie es zur Exfiltration im Einzelnen kam und was genau gestohlen wurde, sehen wir jetzt.

---

## Folie 9 – Datenexfiltration & Darknet-Leak

`[KLICK]` – Passagierdaten-Karte

1.533.900 Passagierdatensätze. Frequent-Flyer-Details, Reisedaten, Passagier-IDs. Das ist personenbezogene Daten nach DSGVO-Definition – meldepflichtig innerhalb von 72 Stunden.

`[KLICK]` – Mitarbeiterdaten-Karte

3.637 Mitarbeiterdatensätze. Namen, Benutzernamen, E-Mail-Adressen, Login-Metadaten. Das ermöglicht gezielte Folgeangriffe auf Mitarbeiter oder weitere Systeme.

`[KLICK]` – Netzwerktopologie-Karte

50+ GB Netzwerktopologie. Workstation-Naming, Device-IDs, Application-Stack-Fingerprints, Segmentierungsdetails. [PAUSE] Das bedeutet: Jeder der diesen Datensatz hat, kennt die Infrastruktur der betroffenen Flughäfen besser als deren eigene Teams.

[WARTEN – Typed.js Terminal läuft]

Lösegeld wurde nicht gezahlt. Am 11. November 2025 veröffentlicht Everest 23 Gigabyte – Binaries, Diagnostik-Logs, interne Tools. Eine vollständige Air Arabia-Datenbank wird separat für zwei Millionen Dollar angeboten.

Diese Daten sind jetzt dauerhaft im Netz. Sie verschwinden nicht mehr. Und damit kommen wir zur strukturellen Ursache, die das alles ermöglicht hat.

---

## Folie 10 – Supply-Chain & Konzentrationsrisiko

Die Grafik zeigt das Problem: Ein Anbieter, fünf Flughäfen, eine Plattform. MUSE ist Multi-Tenant – ein Ausfall trifft alle Kunden gleichzeitig.

`[KLICK]` – Konzentrationsrisiko-Karte

37 Prozent aller Cyber-Versicherungsschäden im Jahr 2024 gehen auf Vendor-Incidents zurück. Und es gibt ein positives Gegenbeispiel: FMO Münster betreibt ein eigenes System – und blieb unberührt.

`[KLICK]` – CrowdStrike-Vergleich

Das kennen wir alle noch: CrowdStrike, Juli 2024. Fehlerhaftes Update, globaler Ausfall. Der Mechanismus ist verschieden – dort Fehler, hier gezielter Angriff – aber die gemeinsame Schwachstelle ist dieselbe: Single Points of Failure in kritischer Infrastruktur.

Effizienz durch Konsolidierung produziert Fragilität. Das ist keine IT-Frage, das ist eine architektonische Entscheidung mit geopolitischen Konsequenzen.

---

## Folie 11 – Dual-Incident-Szenario

Wir haben die Akteure bereits eingeführt. Jetzt die konkrete Arbeitsteilung.

Everest übernimmt die erste Phase: Zugang, Exfiltration, Erpressungsversuch. Als der Erpressungsversuch scheitert, ist der Zugang bereits verkauft.

`[KLICK]` – Pfeil und Akteur-2-Karte

Ein zweiter Akteur deployt HardBit. Separat eingekauft, separat operiert. Reinfektionen bei Recovery-Versuchen deuten darauf hin, dass der zweite Akteur noch längere Zeit im Netz persistiert.

`[KLICK]` – Blockquote

[PAUSE]

Das ist das moderne Ransomware-Ökosystem: Arbeitsteilung, Spezialisierung, Marktplätze für Zugänge. Everest muss die Ransomware nicht selbst betreiben – sie verdienen am Verkauf des Zugangs und an der Erpressung mit den gestohlenen Daten. Gleichzeitig.

---

## Folie 12 – Rechtlicher Rahmen

Was das regulatorisch bedeutet, auf vier Ebenen.

`[KLICK]` – NIS2

NIS2: 24 Stunden Erstmeldung, 72 Stunden Detailbericht. Luftfahrtinfrastruktur fällt als Essential Entity darunter. Und NIS2 führt Geschäftsführerhaftung ein – persönlich, nicht nur unternehmensseitig.

`[KLICK]` – DSGVO

DSGVO: Die 1,5 Millionen Passagierdatensätze lösen Meldepflicht aus. Bußgelder bis 4 Prozent des weltweiten Jahresumsatzes. Bei RTX, einem Konzern mit über 70 Milliarden Dollar Umsatz, ist das eine relevante Zahl.

`[KLICK]` – SEC Filing

RTX hat am 26. September 2025 Form 8-K eingereicht – sechs Tage nach dem Ausfall. Das ist die US-amerikanische Meldepflicht an die Börsenaufsicht. Board-Level-Verantwortung, dokumentiert und öffentlich.

`[KLICK]` – CRA & EASA

Cyber Resilience Act und EASA Part-IS vervollständigen den europäischen Rahmen: ENISA-Meldung für schwere Incidents, luftfahrtspezifische Cybersecurity-Anforderungen die jetzt direkt greifen.

Und was hätte man konkret anders machen müssen?

---

## Folie 13 – Lessons Learned

`[KLICK]` – Credential Hygiene

Der direkteste Hebel: Credentials aus dem 2022er Leak hätten erkannt und rotiert werden können. Infostealer-Monitoring ist kein exotisches Tool – Have I Been Pwned und entsprechende Enterprise-Lösungen existieren. MFA auf FTP-Zugängen hätte den Initial Access blockiert, selbst bei bekannten Credentials.

`[KLICK]` – Patch Management

GlassFish 3.1.2.9 aus dem Jahr 2012 in Produktion. Das ist kein Versehen, das ist eine Entscheidung über Jahre. Lifecycle-Management für alle Komponenten, inklusive Abhängigkeiten – das ist Grundlage, nicht Best Practice.

`[KLICK]` – Supply-Chain-Audits

Lieferantenbeziehungen müssen Sicherheitsanforderungen vertraglich abbilden. Regelmäßige Penetrationstests auf Supply-Chain-Infrastruktur, Redundanzanforderungen – das wäre der Rahmen gewesen.

`[KLICK]` – Zwischentrenner erscheint

`[KLICK]` – Netzwerk-Segmentierung

MUSE ist außerhalb des RTX-Kernnetzwerks betrieben – das ist positiv. Aber die interne Segmentierung fehlte offenbar: Einmal im System, war Lateralbewegung bis zu den Core-Databases möglich.

`[KLICK]` – Incident Response

Reinfektionen während der Recovery sind das deutlichste Zeichen für einen unvollständigen IR-Plan. Containment bedeutet: vollständige Isolation, bevor Wiederherstellung beginnt. Ein IR-Plan der Supply-Chain-Vorfälle nicht explizit abdeckt, ist kein vollständiger IR-Plan.

`[KLICK]` – Redundanz & Fallback

FMO Münster war nicht betroffen – weil sie ein eigenes System betreiben. Graceful Degradation statt Totalausfall: Offline-Fallback-Verfahren, die tatsächlich funktionieren und trainiert werden.

---

## Folie 14 – Zusammenfassung

`[KLICK]` – Technisch (rot)

Technisch: Veraltete Infrastruktur, nicht rotierte Credentials, fehlende Segmentierung. Drei lösbare Probleme, die zusammen einen *„incredibly basic"* Angriff mit kontinentalem Impact ermöglichen.

`[KLICK]` – Organisatorisch (orange)

Organisatorisch: Single Point of Failure durch zentrale Multi-Tenant-Architektur, kombiniert mit dem Dual-Incident-Modell als Standard moderner Cyberkriminalität.

`[KLICK]` – Rechtlich (grün)

Rechtlich: NIS2, DSGVO, CRA, SEC-Meldepflichten – alle greifen. §30 BSIG-E hätte eine Supply-Chain-Risikobewertung erzwungen, die den Vendor-Lock-in bei Collins sichtbar gemacht hätte.

`[KLICK]` – Methodisch (gelb)

Und methodisch: MITRE ATT&CK gibt uns das Vokabular, um von T1078 Initial Access über T1048 Exfiltration bis T1486 Impact die gesamte Kette zu benennen und Gegenmaßnahmen direkt zu adressieren.

[PAUSE]

Dieser Angriff war technisch nicht ausgeklügelt – er war konsequent. Was ihn möglich gemacht hat, sind Entscheidungen: nicht patchen, Credentials nicht rotieren, kein Fallback planen. Das sind lösbare Probleme. Und genau deshalb lohnt es sich, diesen Fall zu verstehen.

Gibt es Fragen?

---

## Folie 15 – Quellen

*(Keine Moderation notwendig – Quellenfolie zur Ansicht)*
