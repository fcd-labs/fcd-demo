import { expect, type Page } from '@playwright/test';
import { urls } from './fcd';

export type Receiver = 'kitchen' | 'bar' | 'cash-register';

/** ShowKitchen as the guest sees it: the menu, the table number and the order (intent Bestellen). */
export class ShowKitchen {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(urls.showKitchen);
    await expect(this.page.getByRole('button', { name: 'Bestelling plaatsen' })).toBeVisible();
  }

  /** The guest picks dishes and drinks, enters a table number and places the order. Counts for the key result. */
  async placeOrder(tableNumber: number, picks: Record<string, number>): Promise<void> {
    for (const [name, quantity] of Object.entries(picks)) {
      for (let i = 0; i < quantity; i++) {
        await this.page.getByRole('button', { name: `${name} meer`, exact: true }).click();
      }
    }
    await this.page.getByLabel('Tafelnummer').fill(String(tableNumber));
    await this.page.getByRole('button', { name: 'Bestelling plaatsen' }).click();
    await expect(this.page.getByTestId('result')).toContainText(`Bestelling geplaatst voor tafel ${tableNumber}`);
  }

  /** Whether kitchen, bar or cash register got the order (✓ verstuurd, or ✕ niet gelukt). */
  delivery(receiver: Receiver) {
    return this.page.getByTestId(`delivery-${receiver}`);
  }
}
