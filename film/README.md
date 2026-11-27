# Filmpje van de demo

Het filmpje van de demo van de showcase Demo, volgens [demo-draaiboek.md](../demo-draaiboek.md), stap 3 t/m 6, als Playwright-script. Tegelijk een use case van FCD: de cirkel rond, van de fout via de patch, de pipeline en de Goedkeuring naar een nieuwe versie die gemeten wordt. Elke stap controleert wat het draaiboek belooft; gaat iets anders, dan faalt het script.

## Draaien

Op de Mac waar de showcase draait (draaiboek, stap 0: `fcd check` en `fcd up`), vanuit deze map:

```bash
npm ci
npx playwright install chromium
npm run film
```

Het script zet eerst de demo terug (`fcd demo reset`, ± 1,5 minuut, niet in beeld) en neemt dan in één venster (1440 × 810) de demo op, in echte tijd (± 1,5 minuut). Het filmpje komt in `demo-showcase-demo.webm`.

| Instelling | Standaard | Wat |
|---|---|---|
| `FILM_HOLD` | `2500` | hoe lang een beeld blijft staan (ms) |
| `FILM_SLOWMO` | `300` | vertraging per klik (ms), zodat je ziet wat er gebeurt |
| `DASHBOARD_URL`, `SHOWKITCHEN_URL` | `http://127.0.0.1:8070`, `http://127.0.0.1:8080` | de poorten uit de configuratie |

## Wat waar staat

| Bestand | Wat |
|---|---|
| [tests/demo.spec.ts](tests/demo.spec.ts) | het scenario: de stappen 3 t/m 6 met bijschriften |
| [lib/fcd.ts](lib/fcd.ts) | de Pipeline (`fcd ...`), de live stand van het Dashboard, de demo terugzetten |
| [lib/dashboard.ts](lib/dashboard.ts) | het Dashboard: Live, het menu Bediening, de Goedkeuring, de tabbladen |
| [lib/showkitchen.ts](lib/showkitchen.ts) | ShowKitchen zoals de gast het ziet: kiezen, tafelnummer, bestellen |
| [lib/caption.ts](lib/caption.ts) | de bijschriften in beeld |

## Afwijkingen van het draaiboek

- Stap 4: alleen **Patch mergen** (menu Bediening); `fcd demo diff` in de terminal staat niet in beeld.
- Dashboard 0.5.0 toont het key result niet meer op Live, maar in het tabblad **Key result**. Stap 3 en 6 laten dat tabblad zien. Stap 6.3 (het key result grijs, "nog geen bestelling gemeten") staat niet in het filmpje: die stand bestaat in 0.5.0 niet.

Playwright: Apache-2.0. Deze map: MIT, zie [LICENSE](../LICENSE).
