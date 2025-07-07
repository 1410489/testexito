import { Task } from './TaskInterface';
import { Page } from '@playwright/test';

export class SelectCategory implements Task {
  async performAs(page: Page): Promise<void> {
    console.log('Click en el botón Menú...');
    await page.locator('button[data-fs-menu-container="true"]').click();

    console.log('Click en la categoría Celulares...');
    const celularesLocator = page.locator('li div[data-link-container="true"] p', { hasText: 'Celulares' });
    await celularesLocator.waitFor({ state: 'visible', timeout: 10000 });
    await celularesLocator.click();

    console.log('Esperando el enlace Samsung dentro de column-2...');
    const samsungLocator = page.locator('#column-2').getByRole('link', { name: 'Samsung', exact: true });
    await samsungLocator.waitFor({ state: 'visible', timeout: 10000 });

    console.log('Click en Samsung...');
    await samsungLocator.click();

    console.log('Subcategoría Samsung seleccionada.');
  }

  static openCelularesSamsung() {
    return new SelectCategory();
  }
}
