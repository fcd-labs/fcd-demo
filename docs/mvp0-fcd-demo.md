# mvp0-fcd-demo

**Dit bestand is leidend.** Het is de enige opdracht voor Claude Code voor mvp0 van de showcase Demo. Eerdere opdrachten (zoals `opdracht-showcase-demo.md`) vervallen.

Demo van Full Circle Delivery (FCD) met de showcase Demo, voor iedereen die het FCD-concept wil zien. FCD verkoopt zichzelf: het model, de site en de showcase spreken voor zich.
Bron: de chat van 19 tot en met 21 november 2026 in het project "Product: Full Circle Delivery". Product owner: sim007.
Deze opdracht zegt wat er moet komen en waarom. Het hoe is aan Claude Code.

---

## 1. Oorspronkelijke vraag van sim007

> Ik wil fcd demo-en met de showcase demo, zodat de kijker overzicht en inzicht krijgt in het fcd concept.
>
> Belangrijk hierin is dat het fcd demo een journey is vanaf:
> https://fcd-labs.github.io/fcd/verhaal-presentatie/
> https://fcd-labs.github.io/fcd/showcases/demo/
> Tonen van deelproduct bestellen met de praatplaat van showkitchen
> Maken van patch wijziging die klaar staat
> Tonen van dashboard
>
> * starten van de pipeline op het dashboard
> * real-time kunnen zien welke stappen er gedaan voor services en deelproduct
> * tonen andere staps
> * dashboard laat alleen voor showcase demo, dus geen fcd deelproducten
>
> NFRs:
>
> * pipeline binnen 5 minuten (alleen voor demo een explain)
> * demo herhaalbaar dus start met x.y.0 realtime volgen van de stappen x.y.1
> * geen push naar remote
> * Tonen nieuwe versie
>
> Van belang:
>
> * consistent verhaal website en showcase demo
> * er mogen van demo mvp nog issues die opgepakt kunnen worden
> * mvp0 demo op een Mac

## 2. Vragen en antwoorden

**V1. Wat is "de praatplaat van ShowKitchen"?**
De productplaat op de site: wat zit in wat (product, deelproduct, containers, stubs).

**V2. Welke wijziging staat klaar als patch?**
Een bewuste fout in Bestellen 1.0.0: een bestelling komt niet aan bij de bar, door een typfout in de broncode. In het deelproduct is de fout zichtbaar (rood naar bar) en het key result op het Dashboard is rood. De patch 1.0.1 herstelt de typfout; daarna is alles groen. Zo sluit de cirkel: meten, leren, herstellen.

**V3. Hoe start de pipeline op het Dashboard?**
Met een knop op het Dashboard die sim007 indrukt, als goedkeuring. Zijn naam komt in de logregel als "wie triggert". De pull request met de patch is dan al gemerged in de lokale git.

**V4. Hoe zie je de stappen voor services en deelproduct?**
Per container (frontend en backend) een eigen rij met de stappen tot en met bouwen en testen. Daaronder één rij voor het deelproduct Bestellen als geheel: integratie, security, deployen, end-to-end, releasen. Zo is zichtbaar dat containers een eigen lifecycle hebben en het deelproduct samen wordt uitgerold.

**V5. Wat betekent "tonen andere stappen"?**
Allebei: stappen die nog niet gebouwd zijn grijs als backlog (de pipeline is bewust niet compleet, grow through doing), en stappen die voor de demo zijn ingekort, gemarkeerd met hun explain.

**V6. Tonen keuken, bar en kassa (de stubs) op het Dashboard?**
Alleen in het key result (aangekomen bij keuken, bar en kassa: ja of nee), niet in de pipeline. Stubs zijn geen deelproduct en lopen niet door de pipeline van Bestellen. Er staat expliciet "stub" bij.

**V7. Met welke versie begint de demo?**
Bestellen 1.0.0, met de fout. De patch maakt er 1.0.1 van. Op de site, in de code en op het Dashboard dezelfde versies.

**V8. Hoe blijft de pipeline binnen 5 minuten?**
Alle stappen en gates blijven. Zware stappen worden sneller: de security- en versheidsscan uit een cache van de voorbereiding, end-to-end alleen het pad "bestelling plaatsen", images vooraf opgewarmd. Ingekorte stappen krijgen een explain (alleen voor de demo) en zijn gemarkeerd. Vóór de start van de demo draaien FCD (Pipeline en Dashboard) en ShowKitchen 1.0.0 al.

**V9. Wat betekent "geen push naar remote" voor 1.0.1?**
Alles blijft lokaal: een lokale git-server op de Mac als bron, een lokale tag v1.0.1, geen GitHub Release. Het Dashboard toont de nieuwe versie. De changelog staat op het Dashboard als eigen tab. Na de demo kan sim007 de run en het statusrapport bewaren, zonder push.

**V10. Hoe zet je de demo terug op 1.0.0?**
Een knop "Demo opnieuw" op het Dashboard, alleen zichtbaar in de demomodus en met een bevestiging. Erachter zit `./fcd demo reset` (ook in de terminal):
1. de huidige run en het statusrapport bewaren, als sim007 dat wil;
2. de lokale git terugzetten naar de tag `demo-start` (Bestellen 1.0.0 met de fout, de patch klaar als branch);
3. ShowKitchen 1.0.0 opnieuw uitrollen;
4. een lege log starten, zodat het Dashboard schoon begint.
De reset komt zelf als logregel in de log. Het blijft een showcase en een demo.

**V11. Hoe houden we de site en de showcase consistent?**
Claude past de site aan in de chat, vóór de demo, op basis van de samenvatting van Claude Code (zie "Terugmelden").

**V12. Hoe eindigt de demo?**
Met een korte samenvatting van wat de kijker zag (de cirkel rond: intent, bouwen, meten, herstellen, nieuwe versie), de backlog van mvp0 als "grow through doing", en één vraag: wat vind je van het model?

## 3. De journey

| # | Stap | Waar | Ongeveer |
|---|---|---|---|
| 0 | Voorbereiding: `./fcd demo reset`; FCD (Pipeline, Dashboard) en ShowKitchen 1.0.0 draaien | Mac | vooraf |
| 1 | Het verhaal: waarom FCD, de cirkel, de praatplaat | site: /verhaal-presentatie/ | 5 min |
| 2 | De showcase Demo: intent Bestellen, deelproduct, productplaat (wat zit in wat), Full Circle Delivery-plaat | site: /showcases/demo/ | 3 min |
| 3 | De fout zien: een bestelling plaatsen; de bar krijgt niets. Op het Dashboard is het key result rood (stub bar) | ShowKitchen 1.0.0, Dashboard | 2 min |
| 4 | De patch: de klaarstaande wijziging (typfout in de broncode) als pull request, lokaal gemerged | lokale git | 2 min |
| 5 | De pipeline: sim007 drukt op de knop (goedkeuring); live de stappen per container en voor het deelproduct, de gates, de grijze backlogstappen en de ingekorte stappen met explain | Dashboard | 5 min |
| 6 | Het resultaat: Bestellen 1.0.1, de changelog-tab, een nieuwe bestelling komt aan bij de bar, het key result is groen | ShowKitchen 1.0.1, Dashboard | 2 min |
| 7 | Afsluiting: samenvatting, backlog van mvp0, en de vraag: wat vind je van het model? | — | 3 min |
| 8 | Na de demo: run en statusrapport bewaren als sim007 dat wil; daarna "Demo opnieuw" | Dashboard | na afloop |

---

## 4. Wat er gebouwd wordt

### 4.1 Architectuur: code in FCD, configuratie per showcase

De waarde van FCD zit in de data: elke showcase moet alleen met configuratie te maken zijn.

| Repository | Wat | Soort |
|---|---|---|
| `fcd` | Het FCD-model, de site en de generatoren van de platen | bestaat al; niet aanpassen (gaat via de chat) |
| `fcd-pipeline` | Deelproduct Pipeline van het product FCD | nieuw, code |
| `fcd-dashboard` | Deelproduct Dashboard van het product FCD | nieuw, code |
| `fcd-demo` | De showcase Demo: way of working, configuratie, vastgelegde versies, log | nieuw, geen code |
| `sk-demo` | Het product ShowKitchen in de showcase Demo | nieuw, code |
| `fcd-classic`, `sk-classic`, `fcd-ideal`, `sk-ideal` | De showcases Classic en Ideal | placeholder: alleen een README met een link naar de showcasepagina |
| `.github` | De organisatiepagina | nieuw |

- **Eén Pipeline en één Dashboard** voor alle showcases. Demo, Classic en Ideal meten met hetzelfde gereedschap; de cijfers verschillen alleen door de manier van werken.
- **Wat per showcase verschilt, staat in de configuratie**, niet in de code: CI-stappen en volgorde, quality gates en drempels, de manier van uitrollen en releasen, kaders en goedgekeurde afwijkingen, en wat het Dashboard toont. Kan iets niet als configuratie: een issue in `fcd` (het model is dan nog niet rijk genoeg).
- **Elke showcase legt de versies vast** van Pipeline en Dashboard die hij gebruikt.
- **Data per showcase:** eigen log, eigen store, eigen rapporten, een eigen draaiende omgeving.
- **Een repository gaat nooit over de grens van een deelproduct heen.**
- mvp0 is de eerste versie binnen de showcase Demo; het is geen naam van een repository.

### 4.2 Alles lokaal

- **Randvoorwaarden:** git, bash, en een container-runtime met `docker` en `docker compose`.
- **`./fcd check`** zegt wat er mist. Controleer alleen of `docker` en `docker compose` werken, niet welke app ze levert.
- **Eén commando** start de showcase Demo: ShowKitchen, Pipeline en Dashboard, met de configuratie en versies uit `fcd-demo`.
- **Geen GitHub Actions**, geen runner van GitHub op de Mac.
- **Tijdens de demo geen push naar remote** (V9). De repositories worden wél op GitHub gepubliceerd (open source), na goedkeuring van het plan.
- **Docker Desktop** mag voor de demo, maar FCD hangt er niet van af: alleen gewone `docker`- en `docker compose`-commando's (ook Rancher Desktop met dockerd, Colima, Podman).
- **Windows** later via WSL2. Houd er rekening mee: alles in containers, bash alleen in het script, images voor arm64 en amd64.

### 4.3 De showcase-repository fcd-demo

Geen code. Wel:
- `fcd-mvp0.md`: de way of working, met de CI-stappen, de gates en de goedgekeurde afwijkingen.
- De declaratieve bestanden `fcd-demo.fcd.yaml` en `sk-demo.fcd.yaml`. Ze staan nu in `fcd/fcd/`: kopieer ze naar `fcd-demo` en breid ze daar uit met de configuratie. Laat `fcd` zelf ongemoeid.
- De vastgelegde versies van Pipeline en Dashboard.
- De log per demo-run.

De configuratie volgt de objecten van het FCD-model (`fcd/src/content/docs/model.md`) en de stijl van de bestaande bestanden (`apiVersion: fcd/v0`, `kind`, `metadata`, `spec`, Engelse namen). Minimaal: product, deelproducten, containers en stubs, repositories, CI-stappen, gates en drempels, manier van uitrollen en releasen, kaders en afwijkingen, vastgelegde versies, en wat het Dashboard toont.

### 4.4 ShowKitchen in sk-demo

- Het deelproduct Bestellen (frontend en backend) en de stubs keuken, bar en kassa.
- **Versie 1.0.0 met de bewuste fout** (V2): een typfout in de broncode waardoor een bestelling niet aankomt bij de bar. De **patch 1.0.1** staat klaar als branch en pull request in de lokale git.
- **Het key result meten:** per bestelling of hij aankomt bij keuken, bar en kassa. De meting gaat naar het Dashboard.
- **Contract first:** het contract van de bestelling (OpenAPI) staat in git, met een eigen versie. Eerst het contract, dan de code. Controleer of de bestaande code contract first is; zo niet, stel herstel voor en meld het als afwijking.
- `sk-1dp-mvp0.md` als intent, `showkitchen.md`, het datamodel van het menu.
- `CHANGELOG.md`, `SECURITY.md`, README in het Nederlands met een link naar https://fcd-labs.github.io/fcd/showcases/demo/

### 4.5 Deelproduct Pipeline (fcd-pipeline)

Een agent op de Mac die de pipeline is, voor elke showcase. Hij leest de configuratie van de showcase, haalt wijzigingen op uit de lokale git (pull, GitOps), draait het bash-script, rolt uit met docker-compose, en stuurt per stap en per gate een logregel bij het begin en het einde naar het Dashboard.

- Eén bash-script is de enige weg om te bouwen, te testen, te controleren, uit te rollen en te releasen.
- Hij start via de knop op het Dashboard (V3), en draait alleen wat gemerged is.
- Testen vóór het mergen gebeurt lokaal met hetzelfde script.
- Alleen de Pipeline rolt uit; met de hand uitrollen is een afwijking.

**CI-stappen.** De stappen zijn niet compleet; voor de demo zijn ze een mooi voorbeeld. Maak ze niet compleet: wat ontbreekt is backlog (grijs op het Dashboard, en een issue in `fcd-demo`). Stel per stap de uitwerking voor; sim007 kiest.

| # | Stap | Niveau | Wat |
|---|---|---|---|
| 1 | Statische controle | per container | Formattering en lint |
| 2 | Unittests | per container | Kader: TDD en unittests |
| 3 | Contracttest | per container | Klopt de code met het contract (contract first) |
| 4 | Bouwen | per container | Container-image, met de versie uit de ene bron |
| 5 | Integratietests | deelproduct | Binnen het deelproduct |
| 6 | Security en versheid | deelproduct | Kwetsbaarheden, geheimen, versheid van libraries (in de demo uit cache, met explain) |
| 7 | SBOM en licenties | deelproduct | CycloneDX; alle licenties open source en toegestaan |
| 8 | Deployen | deelproduct | Het hele deelproduct met docker-compose, lokaal |
| 9 | End-to-end tests | deelproduct | Playwright (in de demo alleen "bestelling plaatsen", met explain) |
| 10 | Releasen | deelproduct | Lokale tag, changelog (geen GitHub Release in de demo) |

**Quality gates.** Stel per gate de drempel voor; sim007 kiest. Drempels zijn kaders; afwijken alleen met een goedgekeurde afwijking (reden, goedkeurder, einddatum).

| Gate | Na stap | Door als (voorstel) |
|---|---|---|
| Codegate | 1–3 | Lint schoon, unittests groen, contract klopt |
| Bouwgate | 4–5 | Images gebouwd, integratietests groen |
| Securitygate | 6–7 | Geen kritieke of hoge kwetsbaarheden, geen geheimen, libraries vers genoeg, licenties toegestaan |
| Uitrolgate | 8–9 | Uitrol gelukt, end-to-end groen |
| Goedkeuring | start en vóór 10 | sim007 keurt goed (de knop op het Dashboard) |

- Valt een gate dicht, dan stopt de pipeline. Er wordt niet uitgerold of gereleased.
- **NFR: de pipeline duurt maximaal 5 minuten** (V8). Afwijking, alleen voor de demo: scan uit cache, end-to-end alleen het kernpad, images opgewarmd.

### 4.6 Deelproduct Dashboard (fcd-dashboard)

Eén Dashboard voor alle showcases, per showcase geconfigureerd en met eigen data. Opbouw: frontend, backend en store. De kaders voor architectuur gelden (zoals "Database: PostgreSQL"); een afwijking voor de demo is mogelijk, met explain.

**Voor de demo toont het alleen de showcase Demo, geen FCD-deelproducten.**

1. **Het key result:** aangekomen bij keuken, bar en kassa, met expliciet "stub"; rood bij 1.0.0, groen bij 1.0.1.
2. **De startknop** voor de pipeline (goedkeuring), met de naam van sim007 in de logregel.
3. **Live weergave van de pipeline**, zonder verversen (Server-Sent Events of WebSockets; stel voor):
   - per container (frontend, backend) een rij tot en met bouwen en testen; daaronder een rij voor het deelproduct;
   - per stap: wachtend, bezig (met lopende tijd), gelukt, mislukt, overgeslagen;
   - per gate: open of dicht, met reden;
   - tellers van de tests lopen mee;
   - grijze backlogstappen, en ingekorte stappen gemarkeerd met hun explain;
   - een presentatiemodus voor een groot scherm.
4. **De nieuwe versie** (1.0.1) en welke containerversies erin zitten.
5. **De changelog** als eigen tab.
6. **De knop "Demo opnieuw"** (V10), alleen in de demomodus, met bevestiging.
7. **Het statusrapport** van een run: te bewaren na de demo (V9).

Wat het Dashboard per showcase toont, komt uit de configuratie in `fcd-demo`.

### 4.7 De logregel (contract)

De logregel is een contract (contract first) tussen sk-demo, de Pipeline en het Dashboard. Gebaseerd op CDEvents: per stap en per gate een logregel bij het begin (started) en het einde (finished). Eigen versie, in git.

| Veld | Betekenis |
|---|---|
| tijd | Wanneer de activiteit begon (ISO 8601, UTC) |
| duur | Hoe lang de activiteit duurde, in seconden |
| wie triggert | Een mens (de product owner), een AI-agent, of een automatische update |
| showcase | Welke showcase (demo) |
| run | Welke run, en of het een demo-run is |
| deelproduct | Welk deelproduct, met versie, en welke container als het om een container gaat |
| actie | Welke stap of gate, en de uitkomst (bezig, gelukt, mislukt, overgeslagen; bij een gate open of dicht, met reden) |

Voor testen daarnaast: aantal tests, geslaagd, mislukt, overgeslagen. Voor de meting van het key result: per bestelling aangekomen bij keuken, bar en kassa. Stel extra velden voor; sim007 kiest.

### 4.8 De demo herhalen

- Een vaste tag `demo-start` op de repositories van de showcase Demo: Bestellen 1.0.0 met de fout, de patch als branch, de configuratie, een lege log.
- Een lokale git-server (bare repository op de Mac) als bron voor de Pipeline. Tags en releases van de demo blijven lokaal.
- `./fcd demo reset` en de knop "Demo opnieuw" (V10).

### 4.9 Versies

- **ShowKitchen** (product, deelproduct Bestellen, containers, stubs) begint op **1.0.0**; de patch is **1.0.1** (V7).
- **Het product FCD** (Pipeline en Dashboard) begint op **0.1.0**.
- Semantic versioning. **Releasen op het deelproduct.** Containers hebben een eigen lifecycle; per versie van het deelproduct staat vast welke containerversies erin zitten.
- Elke versie staat op één plek (single source of truth). De pipeline leest hem daar; de image-tags volgen hem. Verhogen met de hand; stel voor hoe.

### 4.10 Changelog en security-log

- `CHANGELOG.md` per deelproduct-repository, formaat "Keep a Changelog", in het Nederlands. Ook zichtbaar als tab op het Dashboard.
- `SECURITY.md` per deelproduct-repository: bovenaan kort hoe je een kwetsbaarheid meldt; daaronder het log, één regel per security-actie (datum, actie), nieuwste bovenaan.

### 4.11 Alles open source

- Code: MIT, voor alle repositories. Alle libraries, tools en scanners open source; noem per tool de licentie.
- Geen open source alternatief: leg een afwijking vast en vraag sim007 om goedkeuring.
- **Goedgekeurde afwijkingen** (vastleggen in `fcd-mvp0.md`):
  - **GitHub** als plek voor repositories, issues en board. Reden: gratis en de de-facto-standaard. Exitstrategie: alles staat in git en de pipeline draait lokaal; elke git-host werkt.
  - **Docker Desktop** voor de demo. Reden: gratis voor persoonlijk gebruik en kleine organisaties, en de de-facto-standaard. Exitstrategie: alleen gewone `docker`- en `docker compose`-commando's.
  - **Pipeline binnen 5 minuten**, alleen voor de demo (V8).

### 4.12 Het harnas is nog niet compleet

De kaders samen zijn het harnas: de guardrails voor AI. Bij 17 van de 26 kaders is niet bekend of explain is toegestaan, en 18 hebben nog geen label. Ook de CI-stappen zijn niet compleet. Werk binnen wat er is; wat ontbreekt of onduidelijk is: een issue in `fcd-demo`. sim007 beslist.

### 4.13 Vindbaarheid op GitHub

- **Topics:** `fcd`: fcd, full-circle-delivery, software-delivery. `fcd-pipeline`, `fcd-dashboard`: fcd, full-circle-delivery. `fcd-<showcase>`: showcase-<naam>, fcd, full-circle-delivery. `sk-<showcase>`: showcase-<naam>, showkitchen.
- **Organisatiepagina** (`.github/profile/README.md`, Nederlands): één zin wat FCD is, met de ondertitel "AI needs delivery. Delivery needs AI." en een link naar https://fcd-labs.github.io/fcd/; een tabel met de drie showcases; het gereedschap (`fcd`, `fcd-pipeline`, `fcd-dashboard`).

### 4.14 Werkmap op de Mac

Alle repositories naast elkaar in `fcd-labs/`, met een `CLAUDE.md` voor wat overal geldt (architectuur, woordkeuze, kaders, "eerst een voorstel, dan pushen", FCD verkoopt zichzelf) en per repository een eigen `CLAUDE.md`. Stel de inhoud voor.

### 4.15 Prioriteit

Zodat er bij tijdgebrek toch een demo staat:

| | Wat | Demo |
|---|---|---|
| a | sk-demo 1.0.0 met de fout, de patch 1.0.1 klaar, het key result gemeten | nodig |
| b | Pipeline met de CI-stappen en gates uit de configuratie, binnen 5 minuten | nodig |
| c | Dashboard: key result, startknop, live weergave, nieuwe versie, changelog-tab | nodig |
| d | `./fcd demo reset` en "Demo opnieuw" | nodig |
| e | Statusrapport bewaren | gewenst |
| f | Apicurio Registry als API-register voor de contracten, met een compatibiliteitsregel die de codegate laat dichtvallen | gewenst |
| g | DORA-metrics, en de logregels van FCD zelf (FCD meet zichzelf) | backlog na mvp0 |

Wat niet af komt: een issue. Issues van mvp0 mogen openblijven.

### 4.16 Kaders en niet doen

Kaders (comply or explain): wat niet beschreven is, is buiten scope; CI/CD – the only way to production, ook bij spoed; een mens keurt goed (sim007); bestanden in het Nederlands, code in het Engels; woorden zoals op de site (intent, product, deelproduct, container, stub, quality gate, showcase; niet deelsysteem).

Niet doen:
- Geen verwijzingen naar bedrijven, collega's, klanten, opdrachten of deelname: niet in de code, niet op het Dashboard, niet in de teksten. FCD verkoopt zichzelf. De product owner als "wie triggert" mag wel.
- De repository `fcd` niet aanpassen.
- Geen code in een showcase-repository; geen showcase-specifieke code in `fcd-pipeline` of `fcd-dashboard`.
- Geen wachtwoorden, sleutels of tokens in de code; controleer dit vóór de eerste push.
- Ontbrekende kaders of stappen niet zelf invullen.
- Geen code uit pull requests van anderen automatisch draaien.
- Geen gate overslaan.
- Niets pushen of repositories aanmaken vóór sim007 het plan heeft goedgekeurd.

### 4.17 Terugmelden

Aan het eind een korte samenvatting die sim007 in de chat plakt, zodat de site klopt:
- de links naar de repositories;
- per deelproduct en container: naam, versie, technologie, belangrijkste libraries (met of ze open source zijn);
- de velden van de configuratie, met de declaratieve bestanden van Demo als voorbeeld;
- de CI-stappen en gates met drempels, welke stappen backlog zijn en welke ingekort (met explain);
- het contract van de logregel, met een voorbeeld;
- de duur van de pipeline in de generale repetitie;
- twee schermafbeeldingen van het Dashboard: key result rood, en de live pipeline.

---

## 5. Startprompt voor Claude Code

Start een nieuwe sessie in `fcd-labs/` en plak:

```
Je start in fcd-labs op mijn Mac. Hier staan alle repositories van de GitHub-organisatie fcd-labs naast elkaar.

Lees eerst ./mvp0-fcd-demo.md helemaal. Dat bestand is leidend; eerdere opdrachten vervallen.

Je werkt voor de showcase Demo: de repositories fcd-demo (configuratie, geen code) en sk-demo (ShowKitchen).
Pipeline (fcd-pipeline) en Dashboard (fcd-dashboard) bouw je generiek, voor alle showcases. Demo is de eerste configuratie; Classic en Ideal volgen later met alleen een eigen configuratie.

Context
- De bestaande mvp0 van ShowKitchen staat in ./sk-demo. Staat die er niet, vraag me waar hij staat. Ga niet opnieuw bouwen.
- De repository fcd staat in ./fcd. Staat die er niet, clone https://github.com/fcd-labs/fcd.git naar ./fcd. Pas daar niets in aan.

Werk zo
1. Controleer eerst of git, bash, docker en docker compose werken, en meld wat er mist.
2. Maak een plan, volgens de prioriteit in 4.15: wat er al is, wat nog moet, in welke volgorde, met een schatting van de tijd per onderdeel. Zeg eerlijk wat niet haalbaar is vóór de demo.
3. Doe bij elk punt waar het bestand "stel voor" zegt een concreet voorstel, met je advies. Ik kies.
4. Maak geen repositories aan en push niets tot ik het plan goedkeur.
5. Sluit af met een generale repetitie: de journey (stap 0 tot en met 8) twee keer achter elkaar, met "Demo opnieuw" ertussen. Meld hoe lang de pipeline duurde.
6. Geef de terugmelding uit 4.17.
7. Zet na mijn goedkeuring van het plan dit bestand in fcd-demo als docs/mvp0-fcd-demo.md (het hoort bij de showcase Demo), en haal het daarna uit de map fcd-labs.

Schrijf in het Nederlands, kort en bondig, met de vragen aan mij apart onderaan. Code is Engels.
```

## 6. Daarna in de chat

- De site bijwerken met de terugmelding van Claude Code (V11).
- Verdere aanpassingen aan de FCD-site, waaronder de achternaam uit de footer en de LICENSE.
