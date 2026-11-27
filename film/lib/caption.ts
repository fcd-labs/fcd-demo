import type { Page } from '@playwright/test';

/** Height of the band at the bottom; the page gets the rest of the window, so the caption covers nothing. */
const band = 64;

/**
 * A caption in the picture: a band at the bottom with the step of the draaiboek and one sentence,
 * so the film can be followed without a voice-over. It stays when the page navigates.
 */
export class Caption {
  private current: { step: string; text: string } | null = null;

  constructor(private readonly page: Page) {
    page.on('load', () => void this.draw().catch(() => undefined));
  }

  async show(step: string, text: string): Promise<void> {
    this.current = { step, text };
    await this.draw();
  }

  private async draw(): Promise<void> {
    if (!this.current) return;
    await this.page.evaluate(
      ({ step, text, height }) => {
        if (!document.getElementById('fcd-film-style')) {
          const style = document.createElement('style');
          style.id = 'fcd-film-style';
          // The page (also the Angular root of the Dashboard, 100vh high) ends above the band.
          style.textContent = `body { padding-bottom: ${height}px !important; }
            [ng-version] { height: calc(100vh - ${height}px) !important; }`;
          document.head.appendChild(style);
        }
        let bar = document.getElementById('fcd-film-caption');
        if (!bar) {
          bar = document.createElement('div');
          bar.id = 'fcd-film-caption';
          bar.setAttribute('aria-hidden', 'true');
          Object.assign(bar.style, {
            position: 'fixed',
            left: '0',
            right: '0',
            bottom: '0',
            height: `${height}px`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            padding: '0 32px',
            zIndex: '2147483647',
            background: '#141821',
            color: '#fff',
            font: '500 18px/1.3 system-ui, -apple-system, sans-serif',
            pointerEvents: 'none',
          });
          document.body.appendChild(bar);
        }
        bar.innerHTML = '';
        const strong = document.createElement('strong');
        strong.textContent = step;
        strong.style.color = '#8fd3ff';
        strong.style.whiteSpace = 'nowrap';
        const span = document.createElement('span');
        span.textContent = text;
        bar.append(strong, span);
      },
      { ...this.current, height: band },
    );
  }
}
