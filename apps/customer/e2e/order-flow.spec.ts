import { test, expect } from '@playwright/test'

test.describe('주문 플로우', () => {
  test('메뉴 → 장바구니 → 주문 확정', async ({ page }) => {
    await page.goto('/order/test-token-001')
    await expect(page.getByTestId('category-tab-bar')).toBeVisible()
    await page.getByTestId('add-to-cart-menu-01').click()
    await expect(page.getByTestId('cart-floating-bar')).toBeVisible()
    await page.getByTestId('cart-floating-bar').click()
    await expect(page.getByTestId('bottom-sheet')).toBeVisible()
    await page.getByTestId('cart-order-button').click()
    await expect(page.getByTestId('order-confirm-page')).toBeVisible()
    await page.getByTestId('order-submit-button').click()
    await expect(page.getByTestId('order-success-page')).toBeVisible()
  })
})
