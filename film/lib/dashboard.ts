import { expect, type Locator, type Page } from '@playwright/test';
import { urls } from './fcd';

export type Tab = 'Home' | 'Live' | 'Pipelines en gates' | "KPI's" | 'Key result' | 'Changelog' | 'Testresultaten' | 'Logregels' | 'Statusrapport';
export type MenuCommand = 'start-run' | 'demo-merge' | 'demo-reset';

/** The Dashboard of the showcase: the live view, the menu Bediening of the product owner and the tabs. */
export class Dashboard {
  constructor(private readonly page: Page) {}

  async openLive(): Promise<void> {
    await this.page.goto(`${urls.dashboard}/?tab=live`);
    await expect(this.page.locator('.conn').first()).toContainText('live');
  }

  async openTab(tab: Tab): Promise<void> {
    await this.page.getByRole('tab', { name: tab, exact: true }).click();
  }

  /** "ShowKitchen – draait nu: Bestellen x.y.z (backend … · frontend …)". */
  runningNow(subProduct = 'bestellen'): Locator {
    return this.page.locator(`.status-line[data-subproduct="${subProduct}"]`);
  }

  /** The lane of the last run of a sub-product. */
  lane(subProduct = 'bestellen'): Locator {
    return this.page.locator(`.lane[data-subproduct="${subProduct}"]`);
  }

  /** A step or gate in the lane of the sub-product (data-name, for example "e2e-tests" or "deploy"). */
  item(name: string, subProduct = 'bestellen'): Locator {
    return this.lane(subProduct).locator(`[data-name="${name}"]`).first();
  }

  messages(): Locator {
    return this.page.locator('section.messages');
  }

  /** A button in the quiet menu Bediening (only on the tab Live). */
  async menu(command: MenuCommand): Promise<void> {
    await this.page.locator('[data-command="menu"]').click();
    const item = this.page.locator(`[data-command="${command}"]`);
    await expect(item).toBeEnabled();
    await item.click();
  }

  /** Step 4: sim007 merges the patch (locally). Nothing happens yet: the Pipeline waits for the start button. */
  async mergePatch(): Promise<void> {
    await this.menu('demo-merge');
    await expect(this.messages()).toContainText('gemerged op main', { timeout: 60 * 1000 });
  }

  /** Step 5: the approval at the start; the name of sim007 goes into the log line. */
  async startPipeline(): Promise<void> {
    await this.menu('start-run');
  }

  /** Step 5: the run stops at the approval, "⏸ … wacht op sim007 – release … goedkeuren". */
  approveButton(): Locator {
    return this.page.locator('[data-command="approve-release"]');
  }

  async approveRelease(timeout = 5 * 60 * 1000): Promise<void> {
    await expect(this.approveButton()).toBeEnabled({ timeout });
    await this.approveButton().click();
  }

  /** "✔ Gelukt in m:ss – Bestellen x.y.z · uitgerold · gereleased (vx.y.z)". */
  outcome(): Locator {
    return this.messages().locator('.msg.outcome').first();
  }
}
