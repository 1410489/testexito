import { Page, expect } from '@playwright/test';
import { CustomWorld } from '../../support/CustomWorld';

export class AddRandomProducts {
  async performAs(world: CustomWorld): Promise<void> {
    const page = world.page;

    console.log('Buscando productos en la lista...');
    const productItems = page.locator('ul[data-fs-product-grid="true"] > li');

    const count = await productItems.count();
    console.log(`Se encontraron ${count} productos.`);

    if (count < 5) {
      throw new Error('No hay suficientes productos en la lista.');
    }

    const allIndexes = Array.from({ length: count }, (_, i) => i);
    const shuffledIndexes = allIndexes.sort(() => 0.5 - Math.random());
    const selectedIndexes = shuffledIndexes.slice(0, 5);

    const productosSeleccionados = [];

    for (const index of selectedIndexes) {
      const product = productItems.nth(index);

      await product.scrollIntoViewIfNeeded();

      const name = await product
        .locator('a[data-testid="product-link"] h3.styles_name__qQJiK')
        .innerText();

      const priceText = await product
        .locator('div[class*="productCard_priceOfferButton"]')
        .first()
        .innerText();

      const precio = parseFloat(
        priceText.replace(/[^0-9,.]/g, '').replace(',', '.')
      );

      let cantidad = 1;

      // Obtén el contador actual de ítems en el carrito antes de cada click
      const carritoButton = page.locator('[data-testid="cart-toggle"]');
      const contadorAntes = parseInt(
        await carritoButton.getAttribute('data-items') || '0',
        10
      );

      // Click en el botón para agregar
      const agregarButton = product.locator('button:not([aria-label])');
      await agregarButton.click();

      const quantityInput = page.locator('input[type="number"]');
      const isInputVisible = await quantityInput.isVisible({ timeout: 3000 });

      if (isInputVisible) {
        cantidad = Math.floor(Math.random() * 10) + 1;
        console.log(`Asignando cantidad aleatoria: ${cantidad}`);
        await quantityInput.fill(cantidad.toString());
        await page
          .getByRole('button', { name: /Continuar comprando|Agregar al carrito/ })
          .click();
      } else {
        console.log(`No se mostró modal de cantidad, el producto se agregó directo al carrito.`);
      }

      // Esperar un breve tiempo para que la UI procese el click
      await page.waitForTimeout(500);

      // Releer el contador actual
      let contadorActual = parseInt(
        await carritoButton.getAttribute('data-items') || '0',
        10
      );

      // Si no aumentó, reintentar click una sola vez
      if (contadorActual <= contadorAntes) {
        console.log(`El contador no aumentó tras el primer click. Intentando click nuevamente...`);
        await agregarButton.click();
        await page.waitForTimeout(500);

        contadorActual = parseInt(
          await carritoButton.getAttribute('data-items') || '0',
          10
        );
      }

      // Esperar que el contador sea mayor que antes
      await expect.poll(async () => {
        const valor = await carritoButton.getAttribute('data-items');
        const actual = parseInt(valor || '0', 10);
        console.log(`Contador actual del carrito: ${actual} (esperado > ${contadorAntes})`);
        return actual;
      }, {
        timeout: 10000,
        message: `Esperando que el contador del carrito aumente desde ${contadorAntes}`
      }).toBeGreaterThan(contadorAntes);

      console.log(`Producto seleccionado: ${name} - $${precio} x${cantidad}`);

      productosSeleccionados.push({ nombre: name, precio, cantidad });

      // Pequeño delay entre cada agregado
      await page.waitForTimeout(1000);
    }

    world.productosSeleccionados = productosSeleccionados;

    console.log('✅ Productos seleccionados guardados en el contexto.');
  }

  static addRandom() {
    return new AddRandomProducts();
  }
}
