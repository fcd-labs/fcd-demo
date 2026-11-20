# fcd-demo

De way of working van de showcase Demo van [Full Circle Delivery](https://fcd-labs.github.io/fcd/). Zelf ook een product, met de deelproducten **Pipeline** en **Dashboard**. Het brengt het product [sk-demo](https://github.com/fcd-labs/sk-demo) (ShowKitchen) voort.

Meer over deze showcase: https://fcd-labs.github.io/fcd/showcases/demo/

| Repository | Wat |
|---|---|
| `fcd-demo` | De way of working ([fcd-mvp0.md](fcd-mvp0.md)), het contract van de logregel, het startpunt `./fcd` |
| [fcd-demo-pipeline](https://github.com/fcd-labs/fcd-demo-pipeline) | Deelproduct Pipeline: het bash-script en de agent |
| [fcd-demo-dashboard](https://github.com/fcd-labs/fcd-demo-dashboard) | Deelproduct Dashboard |
| [sk-demo](https://github.com/fcd-labs/sk-demo) | Het product ShowKitchen, deelproduct Bestellen |

De declaratieve bestanden staan in [fcd](https://github.com/fcd-labs/fcd/tree/main/fcd).

## Zelf draaien

Alles draait lokaal. Nodig: git, bash en een container-runtime met `docker` en `docker compose`.
Fork of clone deze repository en de repositories hierboven naast elkaar in één map. Het startcommando volgt.

Licentie: [MIT](LICENSE).
