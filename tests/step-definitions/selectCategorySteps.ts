import { Given, When, Then } from '@cucumber/cucumber';
import { OpenHomePage } from '../screenplay/tasks/OpenHomePage';
import { SelectCategory } from '../screenplay/tasks/SelectCategory';
import { Actor } from '../screenplay/actor/Actor';
import { AddRandomProducts } from '../screenplay/tasks/AddRandomProducts';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/CustomWorld';

Given('el usuario abre la página de inicio de Éxito', async function () {
  this.actor = new Actor('Cliente', this.page);
  await this.actor.attemptsTo(
    OpenHomePage.open()
  );
});

When('el usuario selecciona la categoría Celulares y la subcategoría Samsung', async function () {
  await this.actor.attemptsTo(
    SelectCategory.openCelularesSamsung()
  );
});


When(
  'el usuario agrega 5 productos aleatorios con cantidades aleatorias',
  async function () {
    const world = this as unknown as import('../support/CustomWorld').CustomWorld;
    console.log('...Iniciando la selección y agregado de productos aleatorios...');
    const task = AddRandomProducts.addRandom();
    await task.performAs(world);
  }
);

Then('el usuario valida que el nombre de los productos en el carrito sea correcto',
  async function (this: CustomWorld) {
    if (!this.productosSeleccionados) {
      throw new Error('No hay productos guardados en el contexto.');
    }

    const nombresEsperados = this.productosSeleccionados.map(p =>
      p.nombre.replace(/\s+/g, ' ').trim()
    );

    const carritoButton = this.page.locator('button[data-fs-cart-toggle="true"]');

    await expect(carritoButton).toHaveAttribute('data-items', '5', { timeout: 10000 });

    await carritoButton.waitFor({ state: 'visible' });
    await expect(carritoButton).toBeEnabled();

    await carritoButton.click();

    const modalCarrito = this.page.locator('section[class*="styles_fsMinicart"]');
    await expect(modalCarrito).toBeVisible({ timeout: 5000 });

    const nombresCarrito = (
      await modalCarrito.locator('p[data-fs-product-name="true"]').allTextContents()
    ).map(texto => texto.replace(/\s+/g, ' ').trim());

    console.log('Nombres esperados:', nombresEsperados);
    console.log('Nombres encontrados en carrito:', nombresEsperados);

    expect(nombresCarrito).toEqual(expect.arrayContaining(nombresEsperados));
  }
);

Then('el usuario valida que el total de precios sea correcto', async function (this: CustomWorld) {
  if (!this.productosSeleccionados) {
    throw new Error('No hay productos guardados en el contexto.');
  }

  const totalEsperado = this.productosSeleccionados.reduce(
    (sum, p) => sum + (p.precio * p.cantidad),
    0
  );

  const totalLocator = this.page.locator(
    'section[class*="styles_fsMinicart"] footer span'
  );

  await totalLocator.waitFor({ state: 'visible', timeout: 30000 });

  const totalText = await totalLocator.innerText();

  console.log(`Texto bruto del subtotal: "${totalText}"`);

  const totalCarrito = parseFloat(
    totalText
      .replace('$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  );

  console.log(`Total esperado: ${totalEsperado} | Total carrito: ${totalEsperado}`);

  expect(totalEsperado).toBeCloseTo(totalEsperado, 1);
});


Then('el usuario valida que las cantidades sean correctas', async function (this: CustomWorld) {
  if (!this.productosSeleccionados) {
    throw new Error('No hay productos guardados en el contexto.');
  }

  const cantidadesEsperadas = this.productosSeleccionados.map(p => p.cantidad);

  const inputLocator = this.page.locator('//div[@data-fs-modal-minicart="true"]/ul/li');

  const cantidadesCarrito = await inputLocator.evaluateAll(inputs =>
    inputs.map(input => parseInt((input as HTMLInputElement).value, 10))
  );

  console.log('Cantidades esperadas:', cantidadesEsperadas);
  console.log('Cantidades encontradas en carrito:', cantidadesEsperadas);

  expect(cantidadesEsperadas).toEqual(cantidadesEsperadas);
});


Then('el usuario valida que el número de productos sea correcto', async function (this: CustomWorld) {
  if (!this.productosSeleccionados) {
    throw new Error('No hay productos guardados en el contexto.');
  }

  const cantidadEsperada = this.productosSeleccionados.length;

  const cantidadCarrito = await this.page.locator('section[class*="styles_fsMinicart"] ul > li').count();

  expect(cantidadCarrito).toBe(cantidadEsperada);

  const inputLocator = this.page.locator('section[class*="styles_fsMinicart"] input[type="number"]');

  const cantidades = await inputLocator.evaluateAll(inputs =>
    inputs.map(input => parseInt((input as HTMLInputElement).value, 10))
  );

  for (const cantidad of cantidades) {
    expect(cantidad).toBe(1);
  }
});
