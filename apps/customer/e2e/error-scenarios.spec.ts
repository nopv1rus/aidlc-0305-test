import { test, expect } from '@playwright/test'

test.describe('에러 시나리오', () => {
  test('에러 페이지 표시', async ({ page }) => {
    await page.goto('/order/bad-token/error')
    await expect(page.getByText('접속할 수 없습니다')).toBeVisible()
  })
})
