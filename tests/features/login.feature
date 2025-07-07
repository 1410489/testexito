Feature: Seleccionar categoría y subcategoría en Éxito

Feature: Compra de productos aleatorios

  Scenario: El usuario selecciona Celulares y Marcas
    Given el usuario abre la página de inicio de Éxito
    When el usuario selecciona la categoría Celulares y la subcategoría Samsung
    Then el usuario agrega 5 productos aleatorios con cantidades aleatorias
    And el usuario valida que el nombre de los productos en el carrito sea correcto
    And el usuario valida que el total de precios sea correcto
    And el usuario valida que las cantidades sean correctas
    And el usuario valida que el número de productos sea correcto

