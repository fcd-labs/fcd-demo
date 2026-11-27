import { defineConfig } from '@playwright/test';

// The film of the demo: one browser window, recorded as a video, in real time.
// Runs on the Mac where the showcase runs (fcd up), see demo-draaiboek.md.
// 1440 x 810: the widest window in which the whole pipeline row of the Dashboard fits (up to Releasen);
// the Dashboard scales the row with the width of the window, its page is at most 1200 px wide.
const size = { width: 1440, height: 810 };

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // A demo round takes a few minutes; the reset beforehand about 1.5 minutes.
  timeout: 15 * 60 * 1000,
  expect: { timeout: 15 * 1000 },
  reporter: [['list']],
  use: {
    viewport: size,
    video: { mode: 'on', size },
    headless: true,
    // Clicks a little slower, so the viewer sees what happens.
    launchOptions: { slowMo: Number(process.env.FILM_SLOWMO ?? 300) },
    trace: 'off',
    actionTimeout: 30 * 1000,
  },
});
