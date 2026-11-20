# Contract: de logregel (versie 0.1.0)

De afspraak tussen de squads: de pipelines van `sk-demo` en `fcd-demo` (en de meting van het key result in `sk-demo`) sturen logregels; het Dashboard ontvangt ze. Contract first: eerst dit contract wijzigen, met een nieuwe versie, dan de code.

- **Formaat:** een CDEvent (CD Foundation, spec 0.4), JSON. De velden van FCD staan in `customData`.
- **Interface:** `POST http://127.0.0.1:8070/api/v1/events`, zie [logline.openapi.yaml](logline.openapi.yaml) en het schema [logline.schema.json](logline.schema.json).
- **Idempotent:** dezelfde `context.id` nog eens sturen telt één keer.
- **Geen Dashboard bereikbaar:** de Pipeline zet de logregel in een outbox (`~/.fcd/outbox.jsonl`) en stuurt hem later.

## Velden

| Veld | Waar | Betekenis |
|---|---|---|
| tijd | `context.timestamp` | Wanneer de activiteit begon (ISO 8601, UTC) |
| duur | `customData.durationSeconds` | Hoe lang de activiteit duurde, in seconden |
| wie triggert | `customData.trigger` | `kind`: `human`, `ai-agent`, `automated-update` (of `guest` bij het key result); `name` |
| deelproduct | `customData.product`, `customData.subProduct` | Product, deelproduct met versie, en de versies van de containers |
| actie | `context.type` + `subject.content` | Welke stap of gate, en de uitkomst |
| run | `customData.run` | De run van de pipeline |
| commit | `customData.commit` | `sha` en `time`: voor de doorlooptijd (DORA) |
| showcase, experiment | `customData.showcase`, `customData.experiment` | Bijvoorbeeld `demo`, `mvp0`. Elk experiment begint met een lege log. |
| omgeving | `customData.environment` | `werkplek` (vóór een push) of `lokaal` (de uitgerolde omgeving; telt voor DORA) |
| soort release | `customData.releaseType` | `planned` of `emergency` (noodpatch) |

## Soorten logregels

| `context.type` | Wanneer | `subject.content` |
|---|---|---|
| `dev.cdevents.pipelinerun.started.0.2.0` / `.finished` | Begin en eind van een run | `pipelineName`, `outcome` (`running`, `success`, `failure`), `errors`, `warnings` |
| `dev.cdevents.taskrun.started.0.2.0` / `.finished` | Elke CI-stap | `taskName`, `step` (1–10), `title`, `outcome` (`running`, `succeeded`, `failed`, `skipped`), `reason` |
| `dev.cdevents.testsuiterun.finished.0.2.0` | Na unit-, integratie- en end-to-end tests | `testType`, `outcome` (`pass`, `fail`), `tests`, `passed`, `failed`, `skipped`, `seconds`, `failures` (namen) |
| `dev.cdeventsx.fcd-qualitygate.evaluated.0.1.0` | Elke quality gate | `gate` (`code`, `build`, `security`, `deploy`, `human`), `afterSteps`, `outcome` (`open`, `closed`), `reason`, `explain` (id's van gebruikte afwijkingen) |
| `dev.cdevents.service.deployed.0.2.0` | Na een uitrol | `environment.id`, `artifactId` |
| `dev.cdevents.artifact.published.0.2.0` | Na een release | `tag`, `releaseType` |
| `dev.cdeventsx.fcd-keyresult.measured.0.1.0` | Per bestelling (sk-demo) | `keyResult`, `orderId`, `tableNumber`, `receivers` (per stub: `arrived`, `receivedAt`), `complete` |

## Voorbeeld: een gate die dichtvalt

```json
{
  "context": {
    "version": "0.4.1",
    "id": "8d1f0c2a-5b3e-4f61-9a7c-2e4b6d8f0a13",
    "source": "fcd-demo-pipeline/0.1.0",
    "type": "dev.cdeventsx.fcd-qualitygate.evaluated.0.1.0",
    "timestamp": "2026-11-26T09:14:03Z"
  },
  "subject": {
    "id": "security-gate",
    "source": "sk-demo",
    "content": {
      "gate": "security",
      "afterSteps": "6-7",
      "outcome": "closed",
      "reason": "image showkitchen/bestellen-frontend:0.2.1: kritieke of hoge kwetsbaarheid",
      "explain": ""
    }
  },
  "customData": {
    "durationSeconds": 0,
    "run": "sk-demo-20261126-091203-a1b2c3d",
    "commit": { "sha": "a1b2c3d", "time": "2026-11-26T09:10:44Z" },
    "trigger": { "kind": "human", "name": "Johannes Sim" },
    "product": "showkitchen",
    "subProduct": { "name": "bestellen", "version": "0.2.1",
                    "containers": { "bestellen-frontend": "0.2.1", "bestellen-backend": "0.2.0" } },
    "showcase": "demo",
    "experiment": "mvp0",
    "environment": "werkplek",
    "releaseType": "planned"
  }
}
```

## Voorbeeld: de meting van het key result

```json
{
  "context": { "version": "0.4.1", "id": "…", "source": "bestellen-backend/0.2.0",
               "type": "dev.cdeventsx.fcd-keyresult.measured.0.1.0", "timestamp": "2026-11-26T09:20:11Z" },
  "subject": { "id": "3f2b8c1e-6a4d-4e7b-9c0a-1d2e3f4a5b6c", "source": "sk-demo",
    "content": { "keyResult": "Elke bestelling van de gast komt aan bij keuken, bar en kassa",
                 "orderId": "3f2b8c1e-6a4d-4e7b-9c0a-1d2e3f4a5b6c", "tableNumber": 12, "complete": false,
                 "receivers": { "kitchen": { "arrived": true, "receivedAt": "2026-11-26T09:20:11Z" },
                                "bar": { "arrived": false },
                                "cash-register": { "arrived": true, "receivedAt": "2026-11-26T09:20:11Z" } } } },
  "customData": { "durationSeconds": 0.2, "run": "", "trigger": { "kind": "guest", "name": "gast" },
                  "product": "showkitchen", "subProduct": { "name": "bestellen", "version": "0.2.0" },
                  "showcase": "demo", "experiment": "mvp0", "environment": "lokaal" }
}
```
