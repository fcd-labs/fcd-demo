# fcd-demo

De showcase Demo van [Full Circle Delivery](https://fcd-labs.github.io/fcd/): de way of working die het product [sk-bestellen](https://github.com/fcd-labs/sk-bestellen) (het deelproduct Bestellen van ShowKitchen) voortbrengt. Deze repository bevat geen code: alleen de way of working, de configuratie en de data van de showcase.

Meer over deze showcase: https://fcd-labs.github.io/fcd/showcases/demo/

| Wat | Waar |
|---|---|
| Way of working | [fcd-demo.md](fcd-demo.md) |
| Configuratie (FCD-model): stappen, gates en drempels, uitrollen, releasen, afwijkingen, omgeving, vastgelegde versies | [fcd/fcd-demo.fcd.yaml](fcd/fcd-demo.fcd.yaml), [fcd/sk-bestellen.fcd.yaml](fcd/sk-bestellen.fcd.yaml): een kopie uit [fcd](https://github.com/fcd-labs/fcd/tree/main/fcd); wijzigen gaat daar |
| Log en statusrapporten | [log/](log), [reports/](reports) |
| Draaiboek voor de demo | [demo-draaiboek.md](demo-draaiboek.md) |

De code komt van FCD: [fcd-pipeline](https://github.com/fcd-labs/fcd-pipeline) en [fcd-dashboard](https://github.com/fcd-labs/fcd-dashboard), in de versies die hier zijn vastgelegd. Het product: [sk-bestellen](https://github.com/fcd-labs/sk-bestellen) (het deelproduct Bestellen van ShowKitchen).

## Zelf draaien

Alles draait lokaal. Nodig: git, bash en een container-runtime met `docker` en `docker compose`.
Clone de repositories naast elkaar in één map (`fcd`, `fcd-demo`, `fcd-pipeline`, `fcd-dashboard`, `sk-bestellen`). Dan, vanuit `fcd-demo`:

```bash
../fcd-pipeline/fcd check
../fcd-pipeline/fcd up
```

`fcd up` start het Dashboard en de Pipeline-agent van deze showcase, in de vastgelegde versies. De agent haalt `main` op, doorloopt de stappen en gates uit de configuratie, en rolt ShowKitchen uit. Poorten: zie `Environment` in de configuratie (Dashboard http://127.0.0.1:8070, API-register http://127.0.0.1:8072, ShowKitchen http://127.0.0.1:8080).

Licentie: [MIT](LICENSE).
