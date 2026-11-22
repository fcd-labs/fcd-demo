# fcd-demo

De showcase Demo: way of working, configuratie en data. **Geen code.** Wat voor alle repositories geldt staat in `../CLAUDE.md`.

- `fcd-demo.md`: de way of working (kaders, goedgekeurde afwijkingen op de way of working).
- `fcd/*.fcd.yaml`: de declaratieve bestanden (stappen, gates en drempels, kaders, afwijkingen, uitrollen, releasen, omgeving en de vastgelegde versies van Pipeline en Dashboard). **Een kopie uit `fcd` (`fcd/fcd/*.fcd.yaml`); hier niet wijzigen.** Een gewenste wijziging wordt een issue in `fcd`; na de merge daar worden de bestanden overgenomen en met een diff gecontroleerd.
- `log/` en `reports/`: de log en de statusrapporten van de showcase (`fcd report`).
- De backlog van de showcase staat als issues in deze repository; wat het FCD-model nog niet kan, als issue in `fcd`.
- Pipeline en Dashboard zijn van FCD (`fcd-pipeline`, `fcd-dashboard`); hier staat alleen welke versie de showcase gebruikt.
