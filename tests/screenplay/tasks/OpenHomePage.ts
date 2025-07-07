import { config } from '../../../config';
import { Task } from './TaskInterface';
import { Page } from '@playwright/test';

export class OpenHomePage implements Task {
  async performAs(page: Page): Promise<void> {
    await page.goto(config.baseURL!, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    const acceptCookiesButtonSelector = 'button[data-fs-cookies-modal-button="true"]';

    console.log('Esperando que aparezca el botón de cookies...');

    try {
      await page.waitForSelector(acceptCookiesButtonSelector, { state: 'visible', timeout: 10000 });

      await page.click(acceptCookiesButtonSelector, { force: true });

      await page.waitForSelector(acceptCookiesButtonSelector, { state: 'detached', timeout: 5000 });

    } catch (error) {
    }

    const closeButton = page.locator('//div[@data-testid="store-overlay"]//button[@data-testid="store-button"]');

    console.log('Buscando modal...');

    const isModalVisible = await closeButton.isVisible({ timeout: 5000 });
    if (isModalVisible) {
      await closeButton.click();
      console.log('Modal cerrado exitosamente.');
    } else {
      console.log('Modal no encontrado. Continuando...');
    }
  }

  static open() {
    return new OpenHomePage();
  }
}
