# Draaiboek demo showcase Demo (mvp0)

De journey uit [docs/mvp0-fcd-demo.md](docs/mvp0-fcd-demo.md), ongeveer 22 minuten. Alles draait lokaal op de Mac. Tijdens de demo gaat er niets naar een remote: de Pipeline haalt op uit een lokale git-server (`~/.fcd/git`), en de release is een lokale tag.

Vanuit de map `fcd-labs`. Pipeline en Dashboard zijn van FCD; deze showcase gebruikt de versies die in [fcd/fcd-demo.fcd.yaml](fcd/fcd-demo.fcd.yaml) zijn vastgelegd.

## 0. Voorbereiding (vooraf, ± 5 minuten)

1. `./fcd-pipeline/fcd check`: alles ✓.
2. `./fcd-pipeline/fcd up`: het Dashboard, het API-register en de Pipeline-agent draaien.
3. `./fcd-pipeline/fcd demo reset` (of **↺ Demo opnieuw** op het Dashboard): de lokale git op `demo-start` (Bestellen 1.0.0 met de fout, de patch klaar als branch `patch/1.0.1`), een lege log, en de pipeline van 1.0.0, live: groen tot en met uitrollen, de end-to-end test **rood** ("Bar kreeg de bestelling niet"), de uitrolgate dicht. Daarna wordt de patch opgewarmd. Duur ± 1,5 minuut; de eerste keer op een nieuwe Mac langer (images bouwen).
4. De eerste keer: één generale repetitie (stap 3 t/m 8), zodat de scans in de cache staan. Daarna `fcd demo reset`.
5. Open:
   - de site: https://fcd-labs.github.io/fcd/verhaal-presentatie/ en https://fcd-labs.github.io/fcd/showcases/demo/
   - ShowKitchen: http://127.0.0.1:8080
   - het Dashboard, live: http://127.0.0.1:8070/?tab=live (groot scherm: toets `P`, presentatiemodus)
   - een terminal in `fcd-labs`

## 1. Het verhaal (± 5 min, site)

/verhaal-presentatie/: waarom FCD, de cirkel, de praatplaat.

## 2. De showcase Demo (± 3 min, site)

/showcases/demo/: de intent Bestellen, het deelproduct, de productplaat (wat zit in wat: product, deelproduct, containers, stubs) en de procesplaat.

## 3. De fout zien (± 2 min)

1. ShowKitchen: kies iets te eten en te drinken, tafelnummer, **Bestelling plaatsen**. Keuken en kassa ✓, **bar ✕ niet gelukt**.
2. Dashboard, Live (alles op één scherm): **ShowKitchen – draait nu: Bestellen 1.0.0** (backend 1.0.0 · frontend 1.0.0), stubs: keuken, bar, kassa 1.0.0. Daaronder het key result **rood: ✖ bar (stub)**. Keuken, bar en kassa zijn stubs: geen deelproduct, ze lopen niet door de pipeline van Bestellen.
3. De pipeline van 1.0.0: groen tot de end-to-end test, die is rood: de bar kreeg de bestelling niet. De uitrolgate is dicht: 1.0.0 draait, maar is niet gereleased.

## 4. De patch (± 2 min, terminal)

1. `./fcd-pipeline/fcd demo diff`: de klaarstaande wijziging als pull request: de typfout (`stub-baar` → `stub-bar`), een nieuwe unittest, backend 1.0.1, Bestellen 1.0.1, een regel in de changelog.
2. Johannes merget (lokaal): de knop **⇄ Patch mergen (sk-demo patch/1.0.1)** op het Dashboard, of `./fcd-pipeline/fcd demo merge` in de terminal. De knop wordt daarna weer **↺ Demo opnieuw**. Er gebeurt nog niets: de Pipeline wacht op de startknop.

## 5. De pipeline (± 3 min, Dashboard)

1. **▶ Pipeline starten (Johannes)**: de mensgate bij de start; de naam komt in de logregel.
2. Live, zonder verversen:
   - per container (frontend, backend) een rij: statische controle, unittests, contracttest, bouwen; daaronder de rij van het deelproduct Bestellen: integratie, security, SBOM, deployen, end-to-end, releasen;
   - de gates gaan open (codegate, bouwgate, securitygate met de afwijkingen EXP-001/EXP-002, uitrolgate);
   - de testtellers lopen mee;
   - **grijs**: stappen in de backlog (ESLint, testdekking, consumer-contracttest, DAST, performancetests): de pipeline is bewust niet compleet, grow through doing;
   - **✂**: stappen die voor de demo zijn ingekort, met hun afwijking (EXP-004 t/m EXP-007): alle stappen en gates blijven.
3. De run stopt bij de mensgate: **⏸ Wacht op Johannes – release bestellen 1.0.1 goedkeuren**. Druk op **✔ Release goedkeuren**.

Generale repetitie: ± 1 minuut tot de mensgate, ± 70 seconden in totaal.

## 6. Het resultaat (± 2 min)

1. Dashboard: **✔ Gelukt – Bestellen 1.0.1 · uitgerold · gereleased (v1.0.1)**; **Draait nu: Bestellen 1.0.1** (frontend 1.0.0, backend 1.0.1).
2. Tab **Changelog**: Bestellen 1.0.1, de regel van de patch.
3. Dashboard, Live: het key result staat **grijs**: "Bestellen 1.0.1 – nog geen bestelling van een gast gemeten". Het key result volgt de versie die draait.
4. ShowKitchen herladen, een nieuwe bestelling: de bar ✓.
5. Dashboard, Live: het key result **groen** (1 van 1 bestellingen met 1.0.1). Tabblad Key result: per versie, 1.0.0 0% en 1.0.1 100%.

## 7. Afsluiting (± 3 min)

- Wat de kijker zag: de cirkel rond, van intent via bouwen en meten naar herstellen en een nieuwe versie.
- De backlog van mvp0 (de grijze stappen, de issues in deze repository): grow through doing.
- De vraag: **wat vind je van het model?**

## 8. Na de demo

**↺ Demo opnieuw** op het Dashboard (met bevestiging; vink aan om eerst de run en het statusrapport te bewaren), of `./fcd-pipeline/fcd demo reset --save`. Het statusrapport (als leesbare pagina `.html` en als Markdown `.md`) en de log komen in `reports/` en `log/` van deze repository (lokaal; niet pushen zonder besluit). Op het Dashboard staat het rapport opgemaakt in het tabblad Statusrapport.

## Als iets misgaat

| Wat | Doe |
|---|---|
| De knop doet niets | `./fcd-pipeline/fcd status`: draait de agent? Anders `./fcd-pipeline/fcd up`. |
| "Niets nieuws op main" na de startknop | De patch is nog niet gemerged: **Patch mergen** (stap 4). |
| Een gate valt dicht | Laat het zien: de reden staat eronder. Daarna `fcd demo reset`. |
| De pipeline is traag | De eerste run na een nieuwe Mac vult de cache; doe vooraf een generale repetitie. |
| Het Dashboard toont een oud experiment | Kies het nieuwste experiment rechtsboven (`demo-…`). |
