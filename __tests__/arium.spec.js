const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test.describe('Log In', () => {
  test('should allow customer to log in', async({page}) => {
    await page.locator('.login-signup').click();
    await page.locator('.login-input[type="text"]').fill('asdf')
    await page.locator('.login-input[type="password"]').fill('asdfasdf')
    await page.locator('.session-submit').click();

    await expect(page)
  })
})