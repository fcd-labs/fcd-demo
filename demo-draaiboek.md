# Draaiboek demo showcase Demo

Vijf onderdelen, samen ongeveer 20 minuten. Alles draait lokaal op de Mac. De Pipeline-agent draait (`./fcd up`) en het Dashboard staat open op http://127.0.0.1:8070.

## Vooraf (10 minuten, vóór de demo)

1. `./fcd check`: alles ✓.
2. `./fcd status`: de agent draait; ShowKitchen en het Dashboard draaien.
3. Open twee tabbladen: ShowKitchen http://127.0.0.1:8080 en het Dashboard http://127.0.0.1:8070.
4. Laat de images één keer bouwen (dan is de demo snel): `../fcd-demo-pipeline/fcd ci .` in `sk-demo` op `main`.
5. Controleer de voorbereide branches in `sk-demo`: `demo/1-tiramisu` en `demo/2-kwetsbare-nginx` (lokaal, niet gepusht).

## 1. Een kleine wijziging: Tiramisu op het menu (± 5 min)

Laat zien: pull request, lokaal getest, jij merget, de Pipeline doorloopt de stappen en gates, rolt uit, nieuwe versie met een regel in de changelog, het Dashboard werkt bij.

1. In `sk-demo`: `git switch demo/1-tiramisu`. Laat de wijziging zien: `menu.yaml` (Tiramisu), `versions.env` (backend en Bestellen 0.4.0, met `fcd bump`), `CHANGELOG.md`.
2. `git push -u origin demo/1-tiramisu`: de pre-push-hook draait dezelfde stappen en gates lokaal (± 2 min). Het Dashboard toont de run als `werkplek`.
3. Maak de pull request (`gh pr create`) en **merge hem** (de mensgate).
4. Binnen 30 seconden ziet de agent de merge. Het Dashboard toont de run `lokaal`: stappen 1–10, de gates, en daarna Bestellen 0.4.0 uitgerold.
5. ShowKitchen herladen: Tiramisu staat op het menu. Op GitHub: release v0.4.0 met de tekst uit de changelog.

## 2. Een gate die dichtvalt (± 3 min)

Laat zien: een kwetsbare library, er wordt niet uitgerold, en het Dashboard laat zien waarom.

1. `git switch demo/2-kwetsbare-nginx`: de frontend gaat terug naar het oude nginx-image (1.30.6, met kritieke kwetsbaarheden).
2. `../fcd-demo-pipeline/fcd ci .` (± 2 min).
3. Het Dashboard: Bestellen **rood**, "Vast: bestellen: Securitygate dicht", met de reden ("kritieke of hoge kwetsbaarheid"). Stap 8 (Deployen) is niet gedaan. Onder KPI's telt de securitygate één keer dicht meer.
4. Niets gepusht, niets uitgerold. `git switch main`.

Sneller alternatief: laat een unittest falen; dan valt de codegate dicht na ± 1 minuut.

## 3. Een bestelling als gast: het key result (± 3 min)

1. ShowKitchen: kies Tiramisu en een biertje, tafel 4, bestel. De gast ziet dat de bestelling naar keuken, bar en kassa is gestuurd.
2. Dashboard, tab **Key result**: één bestelling meer, volledig aangekomen.
3. Zet de bar stil: `docker stop sk-demo-stub-bar-1`. Bestel nog een keer.
4. Dashboard: de bestelling staat bij "Niet volledig aangekomen: bar"; het key result zakt onder 100%.
5. `docker start sk-demo-stub-bar-1`.

Bestellingen van de end-to-end tests tellen niet mee (`trigger.kind: test`).

## 4. Een noodpatch (± 5 min)

Laat zien: dezelfde pipeline en dezelfde gates, een regel in `SECURITY.md`, en een hersteltijd op het Dashboard.

Voorstel (nog voor te bereiden, na demo 1): in 0.4.0 blijkt een beveiligingsheader te ontbreken. De noodpatch 0.4.1:
1. `git switch -c noodpatch/header main`; zet de header terug in `bestellen/frontend/nginx.conf` en voeg een end-to-end test toe die de beveiligingsheaders controleert.
2. `../fcd-demo-pipeline/fcd bump . bestellen-frontend patch` (frontend 0.1.1, Bestellen 0.4.1).
3. `CHANGELOG.md`: de kop wordt `## [0.4.1] - <datum> - Noodpatch (security)`. `SECURITY.md`: één regel, met "Bestellen 0.4.1".
4. Push (de pre-push-hook draait), pull request, merge. De agent draait dezelfde stappen en gates (de codegate controleert de regel in `SECURITY.md`).
5. Dashboard, tab KPI's: één mislukte wijziging (0.4.0) en de **hersteltijd** van 0.4.0 tot 0.4.1. De run heet "noodpatch".

Hiervoor moet 0.4.0 de header missen. Kies: (a) de header gaat in de Tiramisu-wijziging mee weg (in scène gezet), of (b) een andere fout uit 0.4.0. Johannes kiest.

## 5. Het statusrapport (± 2 min)

1. Dashboard, tab **Statusrapport**: datum, showcase, experiment, versies, pipelines en gates, KPI's, testresultaten, key result.
2. "Bewaren als Markdown" of "Afdrukken of bewaren als PDF".
3. Of: `./fcd report` zet het in `fcd-demo/reports/`, om rapporten te vergelijken.

## Als iets misgaat

- De agent staat stil: `./fcd status`, en `./fcd up` start hem opnieuw. `./fcd logs` laat zien wat hij doet.
- Het Dashboard toont niets nieuws: logregels zonder Dashboard staan in `~/.fcd/outbox.jsonl` en komen er bij de volgende run in.
- Downloads zijn traag (Maven Central, npm): laat de images vooraf bouwen (zie Vooraf, stap 4).
