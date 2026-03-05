import { test, expect } from '@playwright/test'

test.describe('메뉴 탐색', () => {
  test('카테고리 탭 이동', async ({ page }) => {
    await page.goto('/order/test-token-001')
    await expect(page.getByTestId('category-tab-bar')).toBeVisible()
    await expect(page.getByTestId('menu-section-list')).toBeVisible()
  })

  test('메뉴 상세 보기', async ({ page }) => {
    await page.goto('/order/test-token-001')
    await page.getByTestId('menu-card-menu-01').getByRole('button', { name: /상세 보기/ }).click()
    await expect(page.getByTestId('bottom-sheet')).toBeVisible()
  })
})
