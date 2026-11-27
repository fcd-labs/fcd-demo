import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { Caption } from '../lib/caption';
import { Dashboard } from '../lib/dashboard';
import { liveState, resetDemo } from '../lib/fcd';
import { ShowKitchen } from '../lib/showkitchen';

/**
 * The demo of the showcase Demo, step 3 to 6 of demo-draaiboek.md, as one film in real time.
 * At the same time a use case of FCD: the circle round, from the fault via the patch, the pipeline and
 * the Goedkeuring to a new version that is measured. Every step checks what the draaiboek promises.
 */

// How long a picture stays before the next action (ms): just long enough to see it; stop the film to read.
const hold = Number(process.env.FILM_HOLD ?? 2500);

test.beforeAll(async ({ request }) => {
  test.setTimeout(6 * 60 * 1000);
  // Step 0, before the recording: the demo back to the start (± 1.5 minutes).
  await resetDemo(request);
});

// The film itself: next to this script, as demo-showcase-demo.webm (the video is complete once the page closes).
test.afterEach(async ({ page }) => {
  await page.close();
  await page.video()?.saveAs(resolve(__dirname, '../demo-showcase-demo.webm'));
});

test('demo showcase Demo: de fout, de patch, de pipeline, het resultaat', async ({ page, request }) => {
  const caption = new Caption(page);
  const kitchen = new ShowKitchen(page);
  const dashboard = new Dashboard(page);
  const wait = () => page.waitForTimeout(hold);

  await test.step('3. De fout zien', async () => {
    await kitchen.open();
    await caption.show('3 · De fout zien', 'De gast bestelt in ShowKitchen iets te eten en te drinken');
    await kitchen.placeOrder(7, { Tomatensoep: 1, Cola: 1 });
    await expect(kitchen.delivery('kitchen')).toContainText('verstuurd');
    await expect(kitchen.delivery('cash-register')).toContainText('verstuurd');
    await expect(kitchen.delivery('bar')).not.toContainText('verstuurd');
    await caption.show('3 · De fout zien', 'Keuken en kassa ✓, de bar ✕: de bar kreeg de bestelling niet');
    await wait();

    await caption.show('3 · De fout zien', 'Dashboard, Live: ShowKitchen draait Bestellen 1.0.0; keuken, bar en kassa zijn stubs');
    await dashboard.openLive();
    await expect(dashboard.runningNow()).toContainText('Bestellen 1.0.0');
    await wait();
    await expect(dashboard.item('end-to-end-tests')).toHaveAttribute('data-status', 'failed');
    await caption.show('3 · De fout zien', 'De pipeline van 1.0.0: de end-to-end test is rood, de uitrolgate dicht: 1.0.0 draait, maar is niet gereleased');
    await wait();

    // Dashboard 0.5.0: the key result is in the tab Key result, no longer on Live.
    await caption.show('3 · De fout zien', 'Het key result: de laatste bestelling met 1.0.0 kwam niet aan bij de bar');
    await dashboard.openTab('Key result');
    await expect(page.locator('.kr-stubs')).toHaveClass(/bad/);
    await wait();
  });

  await test.step('4. De patch', async () => {
    await caption.show('4 · De patch', 'De typfout stub-baar → stub-bar is hersteld; sim007 merget de patch: Bediening › Patch mergen');
    await dashboard.openTab('Live');
    await dashboard.mergePatch();
    await caption.show('4 · De patch', 'Gemerged op main. Er gebeurt nog niets: de Pipeline wacht op de startknop');
    await wait();
  });

  await test.step('5. De pipeline', async () => {
    await caption.show('5 · De pipeline', 'sim007 start de pipeline: de goedkeuring bij de start, zijn naam komt in de logregel');
    await dashboard.startPipeline();
    await expect(dashboard.lane()).toHaveAttribute('data-outcome', 'running', { timeout: 60 * 1000 });
    await expect(dashboard.lane()).toContainText('Bestellen 1.0.1');
    await caption.show('5 · De pipeline', 'Live, zonder verversen: per container een rij; de frontend blijft 1.0.0 en slaat zijn stappen over');
    await expect(dashboard.item('integration-tests')).not.toHaveAttribute('data-status', 'waiting', { timeout: 3 * 60 * 1000 });
    await caption.show('5 · De pipeline', 'De gates gaan open; grijs = backlog (grow through doing), ✂ = ingekort voor de demo, met afwijking');
    await expect(dashboard.item('end-to-end-tests')).toHaveAttribute('data-status', /succeeded|explained/, { timeout: 3 * 60 * 1000 });
    await caption.show('5 · De pipeline', 'Uitgerold en de end-to-end test groen; de run stopt bij de Goedkeuring');
    await expect(dashboard.approveButton()).toBeEnabled({ timeout: 3 * 60 * 1000 });
    await caption.show('5 · De pipeline', '⏸ Wacht op sim007 – release Bestellen 1.0.1 goedkeuren');
    await wait();
    await dashboard.approveRelease();
  });

  await test.step('6. Het resultaat', async () => {
    await expect(dashboard.outcome()).toContainText('Gelukt', { timeout: 2 * 60 * 1000 });
    await expect(dashboard.outcome()).toContainText('gereleased (v1.0.1)');
    await expect(dashboard.runningNow()).toContainText('Bestellen 1.0.1');
    await caption.show('6 · Het resultaat', '✔ Gelukt – Bestellen 1.0.1 uitgerold en gereleased; draait nu: frontend 1.0.0, backend 1.0.1');
    await wait();

    await caption.show('6 · Het resultaat', 'Changelog: Bestellen 1.0.1, de regel van de patch');
    await dashboard.openTab('Changelog');
    await expect(page.locator('.changelog article').first()).toContainText('1.0.1');
    await wait();

    // Draaiboek 6.3 (the key result grey on Live) is not in the film: Dashboard 0.5.0 shows the key result
    // only in the tab Key result, and that has no state "nog geen bestelling gemeten".
    await caption.show('6 · Het resultaat', 'ShowKitchen herladen, een nieuwe bestelling');
    await kitchen.open();
    await kitchen.placeOrder(8, { Biefstuk: 1, 'Bier van de tap': 1 });
    await expect(kitchen.delivery('bar')).toContainText('verstuurd');
    await caption.show('6 · Het resultaat', 'Keuken, bar en kassa ✓: de bar krijgt de bestelling');
    await wait();

    await caption.show('6 · Het resultaat', 'Key result per versie: 1.0.0 0%, 1.0.1 100%. De cirkel is rond');
    await dashboard.openLive();
    await dashboard.openTab('Key result');
    await expect(page.locator('.kr-stubs')).not.toHaveClass(/bad/);
    await expect(page.locator('tr[data-version="1.0.1"]')).toContainText('100%');
    await wait();
  });

  const state = await liveState(request);
  expect(state.running.find((r) => r.subProduct === 'bestellen')?.version).toBe('1.0.1');
});
