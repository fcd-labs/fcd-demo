# Draaiboek demo showcase Demo

Zeven onderdelen, samen ongeveer 28 minuten. Alles draait lokaal op de Mac. Pipeline en Dashboard zijn van FCD; deze showcase gebruikt de versies die in [fcd/fcd-demo.fcd.yaml](fcd/fcd-demo.fcd.yaml) zijn vastgelegd. Start vanuit `fcd-demo`: `FCD_CONFIG_DIR=$PWD/fcd ../fcd-pipeline/fcd up` (de variabele geeft de configuratie aan het Dashboard, voor de live weergave; niet meer nodig na fcd-labs/fcd-pipeline#13). Het Dashboard staat open op http://127.0.0.1:8070.

**Groot scherm:** de live weergave in presentatiemodus, http://127.0.0.1:8070/?presentatie. Daar volgt het publiek elke run stap voor stap; op het eigen scherm blijft het gewone Dashboard open voor de details (`P` wisselt, `Esc` terug). Wat de live weergave alleen laat zien als de Pipeline de logregels van contract 0.4.0 stuurt (fcd-labs/fcd-pipeline#13), staat hieronder met *(#13)*: meelopende testtellers, een regel uit de uitvoer bij een fout, en de wachtende mensgate.

## Vooraf (10 minuten, vóór de demo)

1. `../fcd-pipeline/fcd check`: alles ✓ (ook de poorten uit de configuratie).
2. `../fcd-pipeline/fcd experiment start demo`: een lege log voor de demo (de log van mvp0 blijft bewaard).
3. `../fcd-pipeline/fcd status`: de agent draait; ShowKitchen en het Dashboard draaien.
4. Open drie tabbladen: ShowKitchen http://127.0.0.1:8080, het Dashboard http://127.0.0.1:8070 en het API-register http://127.0.0.1:8072. Op het grote scherm: http://127.0.0.1:8070/?presentatie. De kop moet "Showcase Demo – live" zijn; staat er "Live – showcase demo", dan leest het Dashboard de configuratie niet (start opnieuw met `FCD_CONFIG_DIR`, zie boven).
5. Laat de images één keer bouwen (dan is de demo snel): `../fcd-pipeline/fcd ci .` in `sk-demo` op `main`.
6. Controleer de voorbereide branches in `sk-demo`: `demo/1-tiramisu` en `demo/2-kwetsbare-nginx` (lokaal, niet gepusht).
7. Proef de live weergave met de simulator (zie "Als iets misgaat"); de simulatie komt in experiment `test-sim` en raakt de log van de demo niet.

## 1. Een kleine wijziging: Tiramisu op het menu (± 5 min)

Laat zien: pull request, lokaal getest, jij merget, de Pipeline doorloopt de stappen en gates, rolt uit, nieuwe versie met een regel in de changelog, het Dashboard werkt bij.

1. In `sk-demo`: `git switch demo/1-tiramisu`. Laat de wijziging zien: `menu.yaml` (Tiramisu), `versions.env` (backend en Bestellen 0.5.0, met `fcd bump`), `CHANGELOG.md`.
2. `git push -u origin demo/1-tiramisu`: de pre-push-hook draait dezelfde stappen en gates lokaal (± 2 min). Het grote scherm volgt de run `werkplek` live: stap voor stap, de gates gaan open, de tellers van de unit- en integratietests lopen mee *(#13)*. Deployen en Releasen zijn overgeslagen (alleen lokaal), en de run eindigt met **"⏸ Wacht op Johannes – merge op main"** *(#13)*.
3. Maak de pull request (`gh pr create`) en **merge hem** (de mensgate).
4. Binnen 30 seconden ziet de agent de merge. Het grote scherm toont de run `lokaal` live: stappen 1–10, de gates, de mensgate open ("goedgekeurd door Johannes"), en onderaan "✔ Gelukt in m:ss – Bestellen 0.5.0 · uitgerold · gereleased (v0.5.0)". Op het eigen scherm: "Bekijk de run →" opent Bestellen in het overzicht.
5. ShowKitchen herladen: Tiramisu staat op het menu. Op GitHub: release v0.5.0 met de tekst uit de changelog.

## 2. Een gate die dichtvalt (± 3 min)

Laat zien: een kwetsbare library, er wordt niet uitgerold, en het Dashboard laat zien waarom.

1. `git switch demo/2-kwetsbare-nginx`: de frontend gaat terug naar het oude nginx-image (1.30.6, met kritieke kwetsbaarheden).
2. `../fcd-pipeline/fcd ci .` (± 2 min).
3. Het grote scherm: de lijn wordt rood bij Security en versheid, met een regel uit de uitvoer *(#13)*; de Securitygate **dicht** met de reden ("kritieke of hoge kwetsbaarheid"); Deployen tot Releasen "niet uitgevoerd". Op het eigen scherm: Bestellen **rood**, "Vast: bestellen: Securitygate dicht". Onder KPI's telt de securitygate één keer dicht meer.
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

In scène gezet (keuze Johannes): in 0.5.0 (de Tiramisu-wijziging) ontbreekt de beveiligingsheader Permissions-Policy. De noodpatch staat klaar op `demo/4-noodpatch`:
1. `git switch demo/4-noodpatch`. Laat zien: de header terug in `bestellen/frontend/nginx.conf`, een nieuwe end-to-end test op alle beveiligingsheaders, `versions.env` (frontend 0.2.1, Bestellen 0.5.1), de kop `## [0.5.1] - … - Noodpatch (security)` in `CHANGELOG.md` en één regel in `SECURITY.md`.
2. Push (de pre-push-hook draait dezelfde stappen en gates), pull request, merge.
3. De agent draait dezelfde stappen en gates; de codegate controleert de regel in `SECURITY.md`. Op het grote scherm staat bij de run in rood **noodpatch**: dezelfde lijn, dezelfde gates.
4. Dashboard, tab KPI's: één mislukte wijziging (0.5.0) en de **hersteltijd** van 0.5.0 tot 0.5.1.

## 5. Een wijziging in de configuratie, zonder codewijziging (± 4 min)

Laat zien: wat per showcase verschilt staat in de configuratie; Pipeline en Dashboard volgen het.

1. In `fcd-demo`: `git switch -c drempel-versheid`. In [fcd/fcd-demo.fcd.yaml](fcd/fcd-demo.fcd.yaml), bij `QualityGate security`: `freshness: {maxMajorBehind: 1, …}` (was 0).
2. Pull request en **merge** (de mensgate geldt ook voor de configuratie).
3. De agent ziet de nieuwe configuratie ("configuratie gewijzigd") en haalt Bestellen opnieuw door de pipeline, met dezelfde code. Het grote scherm toont de nieuwe run live.
4. Dashboard: de securitygate van Bestellen meldt alleen nog de backend-library (twee major-versies achter, afwijking EXP-002); de frontend (één major achter) valt binnen de nieuwe drempel en heeft EXP-001 niet meer nodig.
5. Terugdraaien: dezelfde wijziging terug, of laten staan als besluit.

## 6. Een brekende contractwijziging (± 3 min)

Laat zien: contract first. Een wijziging die het contract breekt, laat de codegate dichtvallen; er wordt niet uitgerold.

1. In `sk-demo`: `git switch demo/3-brekend-contract`. De bestelling krijgt een verplicht veld `guestName` (contract 0.2.0).
2. `../fcd-pipeline/fcd ci .` (stap 1–3 zijn genoeg: `--until 3`, ± 1 min).
3. De codegate valt dicht: "brekende wijziging (oasdiff)" en "niet backward compatibel volgens het API-register". Het grote scherm toont de codegate dicht met de reden; Bouwen en verder "niet uitgevoerd". Het API-register (webinterface http://127.0.0.1:8072, tab Search) toont de contracten met hun versies; zoek op Bestellen of op het label `deelproduct=bestellen`.
4. `git switch main`. Niets gepusht, niets uitgerold.

## 7. Het statusrapport (± 2 min)

1. Dashboard, tab **Statusrapport**: datum, showcase, experiment, versies, pipelines en gates, KPI's, testresultaten, key result.
2. "Bewaren als Markdown" of "Afdrukken of bewaren als PDF".
3. Of: `../fcd-pipeline/fcd report` zet het rapport in `reports/` en de log in `log/`, om rapporten en showcases te vergelijken.

## Als iets misgaat

- De agent staat stil: `../fcd-pipeline/fcd status`, en `../fcd-pipeline/fcd up` start hem opnieuw. `../fcd-pipeline/fcd logs` laat zien wat hij doet.
- Het Dashboard toont niets nieuws: logregels zonder Dashboard staan in `~/.fcd/demo/outbox.jsonl` en komen er bij de volgende run in.
- Downloads zijn traag (Maven Central, npm): laat de images vooraf bouwen (zie Vooraf, stap 4).
- De live weergave toont niets of "verbinden…": ververs de pagina; het Dashboard draait (`../fcd-pipeline/fcd status`)?
- **De echte Pipeline hapert of duurt te lang:** laat het onderdeel zien met de simulator. Die stuurt voorbeeld-logregels met echte tussentijden naar experiment `test-sim`, met de stappen en gates uit de configuratie. Grote scherm: http://127.0.0.1:8070/?presentatie&experiment=test-sim.

  ```bash
  docker run --rm --network demo-dashboard_default -v "$PWD/fcd:/config:ro" \
    fcd/dashboard-backend:0.4.0 simulate --scenario <scenario> --speed 2 --approver Johannes
  ```

  | Onderdeel | Scenario |
  |---|---|
  | 1. Tiramisu, op de werkplek | `wacht-op-mens` |
  | 1. Tiramisu, na de merge | `gelukt` |
  | 2. Gate die dichtvalt | `securitygate-dicht` (of `codegate-dicht`) |
  | 4. Noodpatch | `noodpatch --version 0.5.0` (wordt 0.5.1) |
  | Meerdere deelproducten tegelijk | `parallel` |

  Ook een echte run opnieuw afspelen: `replay --file /log/mvp0.jsonl` (de laatste run uit die log; mount `-v "$PWD/log:/log:ro"`).
