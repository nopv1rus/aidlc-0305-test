import { test, expect } from '@playwright/test'

test.describe('세션 관리', () => {
  test('유효한 토큰으로 접속', async ({ page }) => {
    await page.goto('/order/test-token-001')
    await expect(page.getByTestId('category-tab-bar')).toBeVisible()
  })

  test('유효하지 않은 토큰', async ({ page }) => {
    await page.goto('/order/invalid<>token/error')
    await expect(page.getByText('접속할 수 없습니다')).toBeVisible()
  })
})
