# fcd-mvp0

Way of working van de showcase Demo, voor Claude Code. De eerste, kleinste way of working van Full Circle Delivery (FCD) die de hele cirkel rond gaat: intentie, proces, product, leren. AI als versneller.
Hoort bij een intent, zoals `sk-1dp-mvp0.md` in [sk-demo](https://github.com/fcd-labs/sk-demo).

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
| ~~GitHub Actions: acties op een vaste versie, minimale rechten.~~ | Security | ? | Vervallen: geen GitHub Actions (besluit Johannes, 20 november 2026) |
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
| ~~GitHub Actions roept hetzelfde bash-script aan.~~ | Continuous Delivery | ? | Vervallen: de Pipeline (fcd-demo-pipeline) draait het bash-script lokaal (besluit Johannes, 20 november 2026) |
| Test-driven development (TDD). | Testen | ? | |
| Unittests. | Testen | ? | |
| Integratietests binnen het deelproduct. | Testen | ? | |
| End-to-end tests met Playwright. | Testen | ? | |
| Deze bestanden zijn in het Nederlands. Code is Engels: termen en variabelen in het Engels. | | ? | |
| Het deelproduct is de eenheid van deployment. Het bestaat uit één of meer containers. De pipeline deployt altijd het hele deelproduct. | | ? | |
| Het deelproduct heeft een eigen versie. | | ? | |
| Stubs (zoals voor andere deelproducten) zijn losse containers, niet onderdeel van het deelproduct. | | ? | |

## CI-stappen en quality gates

Besluit van Johannes (20 november 2026): de pipeline bestaat uit stappen, met quality gates. De stappen zijn niet compleet; wat ontbreekt staat als issue op de backlog van fcd-demo.
Eén bash-script (`fcd` in fcd-demo-pipeline) is de enige weg. Lokaal vóór het mergen draait hetzelfde script (pre-push), de Pipeline draait het na de merge op `main`.

| # | Stap | Uitwerking (tool, licentie) |
|---|---|---|
| 1 | Statische controle | ktlint (MIT), ESLint en Prettier (MIT), ShellCheck (GPL-3.0, alleen als tool) |
| 2 | Unittests | Maven Surefire (Apache-2.0), Vitest (MIT) |
| 3 | Contracttest | Redocly CLI (MIT): lint van de OpenAPI-bestanden. oasdiff (Apache-2.0): geen breaking change tegenover de vorige release |
| 4 | Bouwen | `docker compose build`, versies uit `versions.env` |
| 5 | Integratietests | Deelproduct met stubs in een aparte omgeving; Schemathesis (MIT) tegen het OpenAPI-contract |
| 6 | Security en versheid | Trivy (Apache-2.0): kwetsbaarheden, geheimen, configuratie. Versheid: versions-maven-plugin (Apache-2.0), `npm outdated` |
| 7 | SBOM en licenties | Syft (Apache-2.0): CycloneDX per image. Trivy: licenties tegen de toegestane lijst |
| 8 | Deployen | `docker compose up` van het hele deelproduct |
| 9 | End-to-end tests | Playwright (Apache-2.0) |
| 10 | Releasen | Git-tag `v<versie>`, GitHub Release met de tekst uit `CHANGELOG.md` |

| Gate | Na stap | Door als |
|---|---|---|
| Codegate | 1–3 | 0 lint-fouten; alle unittests groen, geen overgeslagen test zonder reden; OpenAPI zonder lint-fouten; geen breaking change zonder nieuwe major-versie; versies consistent (een hogere containerversie betekent een hogere versie van het deelproduct) |
| Bouwgate | 4–5 | Alle images gebouwd met de juiste tag; alle integratietests groen |
| Securitygate | 6–7 | 0 kritieke en 0 hoge kwetsbaarheden waarvoor een fix bestaat; 0 geheimen; 0 hoge misconfiguraties; geen library een major-versie achter (minor of patch = waarschuwing); een SBOM per image; elke licentie toegestaan (MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0, EPL-1.0, EPL-2.0, LGPL; GPL alleen in OS-pakketten van het basisimage); onbekende licentie = dicht |
| Uitrolgate | 8–9 | Alle containers draaien binnen 60 seconden; alle end-to-end tests groen |
| Mensgate | vóór 10 | Johannes merget naar `main` met een hogere versie van het deelproduct. Kader: een mens keurt goed |

- Valt een gate dicht, dan stopt de pipeline: niet uitrollen, niet releasen.
- Een noodpatch gaat door dezelfde stappen en gates. Kader: CI/CD – the only way to production, ook bij spoed (explain niet toegestaan).
- Een afwijking op een drempel staat in `explains.yaml` van de repository: gate, regel, reden, goedkeurder, einddatum. Na de einddatum vervalt hij.
- Testdekking (coverage) heeft voor de demo geen drempel.

## Goedgekeurde afwijkingen

Besluit: alles is open source (Johannes, 20 november 2026). Goedgekeurde afwijkingen (Johannes, 20 november 2026):

| Afwijking | Reden | Exitstrategie |
|---|---|---|
| GitHub als plek voor repositories, issues, board, releases en update-pull-requests (Dependabot) | Gratis en de de-facto-standaard | Alles staat in git en de pipeline draait lokaal; elke git-host werkt |
| Docker Desktop voor de demo | Gratis voor Johannes | FCD gebruikt alleen gewone `docker`- en `docker compose`-commando's en werkt met elke open source runtime |
