Hier sind die konsolidierten Best Practices für einen Sprechtext, der zum Thema, zum technischen Niveau und zum Präsentationsformat passt.

***

## Tonalität: Der richtige Modus

Für eine Studenten-Präsentation über einen realen Cyberangriff gilt der **„kompetenter Analyst"-Ton** – weder zu akademisch-steif noch zu lässig. Konkret bedeutet das:

- **Aktive Sprache:** „Everest *stiehlt* die Credentials" statt „Die Credentials *wurden gestohlen*"
- **Präsens für den Angriff:** Die Timeline wird im Präsens erzählt – das erzeugt Spannung und Unmittelbarkeit
- **Fachbegriffe mit kurzer Einbettung:** Nicht erklären *wie ein Lehrbuch*, sondern wie jemand der es schon kennt und dem Publikum schnell Kontext gibt: „RedLine – ein klassischer Infostealer – kompromittiert den Rechner eines Collins-Mitarbeiters"

***

## Struktur eines guten Sprechtexts pro Folie

Jede Folie folgt dem gleichen **3-Satz-Rhythmus**:

```
1. Hook        → Einstieg, der neugierig macht oder überrascht
2. Kernaussage → Die eine Information dieser Folie
3. Brücke      → Überleitung zur nächsten Folie
```

**Beispiel für die Ransomware-Folie (19. Sept.):**
> *„Bis hierhin war es reiner Datendiebstahl – schlimm, aber reversibel. Am 19. September ändert sich das: HardBit wird deployed, die MUSE Core-Databases werden verschlüsselt – und damit gehen an fünf europäischen Flughäfen gleichzeitig die Lichter aus. Was das konkret bedeutet, sehen wir jetzt."*

***

## Technisches Niveau kalibrieren

Da es ein Studentenreferat im Kurs „Methodenkompetenz IT-Sicherheit" ist, gilt:

| Was | Wie |
|---|---|
| **MITRE ATT&CK** | Nicht erklären was es ist – direkt anwenden: „T1078 – Valid Accounts – genau das passiert hier" |
| **RaaS / IAB** | Einmalig kurz definieren, danach frei verwenden |
| **Fachbegriffe auf Englisch** | Im Original lassen (Exfiltration, Payload, Credential Stuffing) – kein Deutsch-Ersatz |
| **Zahlen kontextualisieren** | „50+ GB Netzwerktopologie – das ist keine Datei, das ist ein vollständiger Blueprint der Infrastruktur" |
| **Bekannte Parallelen** | CrowdStrike-Vergleich kurz nutzen: „Das kennen wir alle noch – und das Grundproblem ist dasselbe" |

***

## Sprechtempo & Pausen

Gerade bei immersiven Web-Präsentationen muss der Sprechtext mit den **Fragment-Animationen synchron** sein:

- **Vor jedem Fragment-Klick eine Mikropause** – das Publikum braucht einen Moment um zu lesen
- **Nach dramatischen Momenten explizit schweigen:** Nach „MUSE-Systeme verschlüsselt" → 2 Sekunden Stille, keine weiteren Worte
- **Zahlen immer ausreden lassen:** „Eins-Komma-fünf *Millionen* Passagierdatensätze" – nicht hetzen

***

## Dos & Don'ts für den Sprechtext

**✅ Dos**
- Direkte Ansprache für Kernfragen: „Was würdet ihr tun, wenn euer komplettes System am Montag früh verschlüsselt ist?"
- Knappe Bewertungen: „Und das ist – technisch gesehen – erschreckend simpel"
- Zitate aus dem Quellmaterial: Der Lawfare-Artikel nennt den Angriff *„incredibly basic"* – das ist Gold wert
- Überraschungsmomente sprachlich ankündigen: „Was jetzt kommt, ist das eigentlich Interessante an diesem Fall..."

**❌ Don'ts**
- Folie vorlesen: Wenn auf der Folie „19. Sept. – Ransomware aktiviert" steht, nicht das sagen – sondern *mehr* sagen
- „Wie man sieht..." / „Auf dieser Folie sieht man..." – schwache Einleitungen
- Konjunktiv bei gesicherten Fakten: Nicht „könnte passiert sein" wenn es dokumentiert ist
- Zu viele Nebensätze: Kurze Hauptsätze wirken im Vortrag kompetenter als verschachtelte Konstrukte

***

## Sprechtext-Template pro Folie

```
[HOOK – 1 Satz, überraschend oder provokativ]
[KERNFAKT – 1–2 Sätze, klar und präzise]
[KONTEXTUALISIERUNG – 1 Satz, was bedeutet das wirklich?]
[BRÜCKE – 1 Satz, Überleitung]
```

**Vollbeispiel für die Darknet-Leak-Folie:**
> *„Lösegeld wurde nicht gezahlt – also veröffentlicht Everest am 11. November 23 Gigabyte. Darunter Binaries, Diagnostik-Logs, interne Tools – und eine vollständige Air Arabia-Datenbank, die separat für zwei Millionen Dollar verkauft werden soll. Das bedeutet: Der Schaden ist jetzt dauerhaft. Diese Daten verschwinden nicht wieder aus dem Darknet. Und damit kommen wir zur Frage, was das rechtlich bedeutet."*

***

## Einstieg & Schluss

Der **Cold Open-Sprechtext** braucht keine Begrüßung – direkt ins Geschehen:
> *„Stellt euch vor: Montagmorgen, 06:00 Uhr, BER. 29 Flüge gestrichen. Kein einziger Check-in-Kiosk funktioniert. Und niemand weiß genau warum. – Das ist kein Szenario. Das ist der 20. September 2025."*

Der **Schluss** gibt dem Publikum Handlungsfähigkeit zurück:
> *„Dieser Angriff war technisch gesehen nicht ausgeklügelt – er war konsequent. Was ihn möglich gemacht hat, sind Entscheidungen: nicht patchen, Credentials nicht rotieren, kein Fallback planen. Das sind lösbare Probleme. Und genau deshalb lohnt es sich, diesen Fall zu verstehen."*