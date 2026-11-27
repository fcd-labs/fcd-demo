import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, type APIRequestContext } from '@playwright/test';

/** The folder fcd-labs, with the repositories side by side (demo-draaiboek.md: "Vanuit de map fcd-labs"). */
export const labs = resolve(__dirname, '../../..');

/** The ports of the showcase Demo (Environment in fcd/fcd-demo.fcd.yaml). */
export const urls = {
  dashboard: process.env.DASHBOARD_URL ?? 'http://127.0.0.1:8070',
  showKitchen: process.env.SHOWKITCHEN_URL ?? 'http://127.0.0.1:8080',
};

/** Runs the Pipeline of FCD (`./fcd-pipeline/fcd ...`) from the folder fcd-labs and returns its output. */
export function fcd(...args: string[]): string {
  return execFileSync(resolve(labs, 'fcd-pipeline/fcd'), args, { cwd: labs, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

export interface Command {
  kind: string;
  status: string;
  message?: string;
}

export interface LiveState {
  experiment: string;
  demo?: { phase: string; unmerged: string[] };
  commands: Command[];
  runs: { subProduct: string; version: string; outcome: string }[];
  running: { subProduct: string; version: string; containers: Record<string, string> }[];
}

/** The live state of the Dashboard: the same data the page Live shows. */
export async function liveState(request: APIRequestContext): Promise<LiveState> {
  const response = await request.get(`${urls.dashboard}/api/v1/live/state`);
  expect(response.ok(), 'het Dashboard antwoordt niet: draait de showcase (fcd up)?').toBeTruthy();
  return response.json();
}

const finished = new Set(['done', 'refused', 'failed']);

/**
 * Step 0 of the draaiboek: the demo back to the start. Bestellen 1.0.0 with the fault runs, the patch
 * waits as a branch, and the Pipeline has finished warming up the patch (no command is still busy).
 */
export async function resetDemo(request: APIRequestContext): Promise<void> {
  expect(fcd('check'), 'fcd check').not.toContain('✗');
  fcd('demo', 'reset');
  await expect
    .poll(
      async () => {
        const s = await liveState(request);
        const busy = s.commands.some((c) => !finished.has(c.status));
        return s.demo?.phase === 'start' && !busy ? 'start' : `${s.demo?.phase ?? '?'}${busy ? ' (bezig)' : ''}`;
      },
      { message: 'de demo staat niet op de start', timeout: 5 * 60 * 1000, intervals: [2000] },
    )
    .toBe('start');
}
