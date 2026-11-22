# fcd-demo

De way of working van de showcase Demo (eerste experiment: mvp0).

Way of working van de showcase Demo, voor Claude Code. De eerste, kleinste way of working van Full Circle Delivery (FCD) die de hele cirkel rond gaat: intentie, proces, product, leren. AI als versneller.
Hoort bij een intent, zoals `sk-1dp-mvp0.md` in [sk-bestellen](https://github.com/fcd-labs/sk-bestellen).

## Organisatie
- Squad: Claude Code met agents. De squad bestaat alleen uit AI-agents.
- Daarom is de product owner eigenaar van het deelproduct en keurt hij afwijkingen goed.

## Kaders
Bij elk kader geldt comply or explain: wijk je af, leg dan uit waarom. De product owner keurt de afwijking goed.

| Kader | Label | Explain toegestaan | Explain |
|---|---|---|---|
| Een mens keurt afwijkingen goed. | ? | N | |
| Wat niet beschreven is, is buiten scope. | | ? | |
| Technische keuzes die niet in de kaders staan, legt Claude Code eerst voor aan de product owner. | | ? | |
| Secure: alles is veilig, van contract en code tot container, pipeline en omgeving. | Security | ? | |
| Containers draaien als gewone gebruiker, niet als root, met zo min mogelijk rechten. | Security | ? | |
| Kleine basis-images met vaste versies. | Security | ? | |
| Poorten alleen open waar nodig. Lokaal alleen bereikbaar via 127.0.0.1. | Security | ? | |
| Elke aanvraag wordt gecontroleerd tegen het contract. Prijzen komen uit het menu, nooit van de gast. | Security | ? | |
| Foutmeldingen geven geen interne details prijs. | Security | ? | |
| De frontend stuurt beveiligingsheaders mee. | Security | ? | |
| build.sh scant afhankelijkheden, images en configuratie op kwetsbaarheden en geheimen. Bij een ernstige bevinding stopt de build. | Security | ? | |
| ~~GitHub Actions: acties op een vaste versie, minimale rechten.~~ | Security | ? | Vervallen: geen GitHub Actions (besluit sim007, 20 november 2026) |
| Versleuteld verkeer (HTTPS). | Security | ? | mvp0: lokale omgeving, geen HTTPS (voorstel, nog goed te keuren) |
| Inloggen en autorisatie waar gebruikers zijn. | Security | ? | mvp0: de intent kent geen gebruikersaccounts (voorstel, nog goed te keuren) |
| Contract first: tussen deelproducten eerst het contract, dan de code. Het schema is onderdeel van het contract. Contracten in OpenAPI. | | ? | |
| Datamodel first: binnen een deelproduct eerst het datamodel, dan de code. | | ? | |
| Opbouw: micro-frontend (Angular), UX-API (Kotlin), backend (Kotlin), datastore | Architectuur | ? | mvp0: frontend en backend |
| Database: PostgreSQL | Architectuur | ? | mvp0: geen opslag, het menu is een bestand |
| Containerization | | J | |
| Docker-compose | | ? | |
| Kubernetes | | J | mvp0: docker-compose |
| Omgevingen: OTAP | | ? | mvp0: één omgeving |
| Automate everything | | J | |
| Single source of truth | | J | |
| Everything as code | | J | |
| Declarative | | J | |
| GitOps: alles staat in git, en de pipeline rolt uit | | J | |
| CI/CD – the only way to production, ook bij spoed. | | N | |
| Een bash-script is de enige weg om te bouwen en uit te rollen. | Continuous Delivery | ? | |
| ~~GitHub Actions roept hetzelfde bash-script aan.~~ | Continuous Delivery | ? | Vervallen: de Pipeline (fcd-pipeline) draait het bash-script lokaal (besluit sim007, 20 november 2026) |
| Test-driven development (TDD). | Testen | ? | |
| Unittests. | Testen | ? | |
| Integratietests binnen het deelproduct. | Testen | ? | |
| End-to-end tests met Playwright. | Testen | ? | |
| Deze bestanden zijn in het Nederlands. Code is Engels: termen en variabelen in het Engels. | | ? | |
| Het deelproduct is de eenheid van deployment. Het bestaat uit één of meer containers. De pipeline deployt altijd het hele deelproduct. | | ? | |
| Het deelproduct heeft een eigen versie. | | ? | |
| Stubs (zoals voor andere deelproducten) zijn losse containers, niet onderdeel van het deelproduct. | | ? | |

## CI-stappen, quality gates en drempels

Besluit van sim007 (20 november 2026): de pipeline bestaat uit stappen, met quality gates. Besluit van 20 november (later): Pipeline en Dashboard zijn deelproducten van FCD, voor alle showcases; wat per showcase verschilt staat in de configuratie.

**De configuratie van deze showcase staat in [fcd/fcd-demo.fcd.yaml](fcd/fcd-demo.fcd.yaml)**, in het FCD-model. Het is een kopie: de bron is `fcd` (`fcd/fcd/*.fcd.yaml`, besluit sim007, 22 november 2026).
- `Pipeline`: vastgelegde versie van de Pipeline, bron (`local-git`: een lokale git-server, geen push naar remote), trigger (`dashboard-button`: de startknop op het Dashboard; alleen wat op `main` gemerged is), uitrollen (docker-compose, het hele deelproduct), releasen (lokale tag en changelog, geen GitHub Release), de stappen in volgorde, de stappen in de backlog, en de demo (`demo-start`, de klaarstaande branches, opwarmen);
- `Step`: de tien stappen; per stap het niveau (`level: container` voor statische controle, unittests, contracttest en bouwen: die draaien per container), en voor de demo ingekorte stappen (`shortened`, met hun afwijking); de backlogstappen (grijs op het Dashboard);
- `QualityGate`: code-, bouw-, security- en uitrolgate en de Goedkeuring, met hun drempels; elke gate verwijst naar zijn kader (`quality-gate-<naam>`, de Goedkeuring naar `human-approves`). De goedkeuring is de knop op het Dashboard, twee keer: bij de start en vóór het releasen (besluit sim007, 21 november 2026);
- `Explanation`: goedgekeurde afwijkingen (kader, gate of stap, regel, reden, goedkeurder, einddatum); nooit op een kader met `explainAllowed: false`;
- `Dashboard`: vastgelegde versie van het Dashboard;
- `Environment`: poorten en projectnamen van deze showcase.

Een drempel, stap, kader of afwijking wijzigen gaat in `fcd`: een issue in `fcd`, daarna een pull request daar, door sim007 gemerged. Deze repository neemt de bestanden daarna over (een diff laat zien dat ze gelijk zijn). De Pipeline volgt de nieuwe configuratie bij de volgende run, zonder codewijziging.

- Valt een gate dicht, dan stopt de pipeline: niet uitrollen, niet releasen.
- Een noodpatch gaat door dezelfde stappen en gates. Kader: CI/CD – the only way to production, ook bij spoed (explain niet toegestaan).
- Testdekking (coverage) heeft voor de demo geen drempel.
- De demo herhalen: `./fcd demo reset` of de knop "Demo opnieuw" (zie [demo-draaiboek.md](demo-draaiboek.md)).
- Wat niet als configuratie kan, staat als issue in `fcd`.

## Contract first

Kader: tussen deelproducten eerst het contract, dan de code; het schema is onderdeel van het contract (besluit sim007, 20 november 2026). De contracten staan in git met een eigen versie (`kind: Contract` in de configuratie), en in het API-register van de showcase (Apicurio Registry) met de regel BACKWARD. Stap 3 controleert: klopt het contract, is de versie omhoog als het veranderde, en is het niet gebroken (oasdiff en het register).

**Afwijking (gemeld 20 november 2026):** mvp0 is contract first in de volgorde (het contract van de bestelling kwam vóór de code), maar de code wordt niet tegen het contract zelf gecontroleerd (backend en stubs met handgeschreven regels), het contract van de bestelling veranderde zonder nieuwe versie, en de zenders van de logregel worden niet tegen het schema getest. Herstel: zie de issues in deze repository.

## Goedgekeurde afwijkingen

Besluit: alles is open source (sim007, 20 november 2026). Goedgekeurde afwijkingen op de way of working (sim007, 20 november 2026); afwijkingen op een quality gate staan in de configuratie (`Explanation`):

| Afwijking | Reden | Exitstrategie |
|---|---|---|
| GitHub als plek voor repositories, issues, board, releases en update-pull-requests (Dependabot) | Gratis en de de-facto-standaard | Alles staat in git en de pipeline draait lokaal; elke git-host werkt |
| Apicurio Registry in het geheugen (EXP-003, tot 2026-12-31; kader "Database: PostgreSQL") | Voor de demo; de contracten staan in git en de Pipeline vult het register opnieuw | Opslag in PostgreSQL (Apicurio ondersteunt dat) |
| Docker Desktop voor de demo | Gratis voor sim007 | FCD gebruikt alleen gewone `docker`- en `docker compose`-commando's en werkt met elke open source runtime |
| De pipeline binnen 5 minuten, alleen voor de demo (V8): images opgewarmd (EXP-004), scan uit de cache van de voorbereiding (EXP-005), end-to-end alleen het kernpad (EXP-006), lokaal releasen zonder GitHub Release (EXP-007), alle tot 2026-12-31 | Alle stappen en gates blijven; de demo moet in een gesprek passen | Zonder de demo: de volledige stappen (configuratie, geen code) |
| Versies van FCD nummeren door (besluit sim007, 21 november 2026): Pipeline 0.7.0 en Dashboard 0.5.0 in plaats van 0.1.0 | De tags tot Pipeline v0.5.2 en Dashboard v0.3.1 staan al openbaar op GitHub; terugzetten herschrijft de geschiedenis | – |

## Voorgestelde afwijkingen (nog niet goedgekeurd)

| Afwijking | Reden | Issue |
|---|---|---|
| Geen inloggen op het Dashboard in mvp0: de naam bij een knop is de goedkeurder uit de configuratie | Alles draait lokaal op 127.0.0.1 | fcd-demo#4 |
| De lokale tags v0.7.0 (Pipeline) en v0.5.0 (Dashboard) zijn met de hand gezet, niet door de Pipeline | De Pipeline van FCD zelf (showcase `fcd`) heeft nog geen eigen configuratie in `fcd` (D1) | nieuw |
| Stubs lopen niet door de pipeline van Bestellen; hun image wordt alleen gebouwd als het ontbreekt | V6: stubs zijn geen deelproduct; een eigen lifecycle voor stubs bestaat nog niet | nieuw |
