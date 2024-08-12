import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
});

test('email-password-login', async ({ page }) => {
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('julien_impossible');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Please enter a valid email')).toBeVisible();
  
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('julien_impossible@gmail.com');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Please enter your password')).toBeVisible();
  
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText("This email address doesn't correspond to any account")).toBeVisible();
  
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText("Incorrect password")).toBeVisible();
  
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('playwright');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(url => url.href.includes('/myActivities'));
  await expect(page.getByText('My Activities').nth(1)).toBeVisible();
});

test.skip('phone-number-login', async ({ page }) => {
  await page.getByRole('button').first().click();
  await page.getByPlaceholder('Enter phone number').click();
  await page.getByPlaceholder('Enter phone number').fill(' 1 722-233');
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByText("Please enter a correct phone number")).toBeVisible();

  await page.getByPlaceholder('Enter phone number').click();
  await page.getByPlaceholder('Enter phone number').fill(' 1 722-233-3444');
  await page.getByRole('button', { name: 'Send code' }).click();
  await expect(page.getByText('Enter the code send to 17222333444You didn\'t receive the verification code ?')).toBeVisible();
  
  // Try empty code
  await page.keyboard.press('Enter');
  await expect(page.getByText("The code must be compose of 6 digits")).toBeVisible();

  // Try incorrect code
  await page.keyboard.type('123455');
  await page.keyboard.press('Enter');
  await expect(page.getByText("Incorrect verification code")).toBeVisible();

  // Try correct code
  await page.keyboard.press('Backspace');
  await page.keyboard.type('56');
  await page.getByRole('button', { name: 'Confirm' }).click();

  await page.waitForURL(url => url.href.includes('/myActivities'));
  await expect(page.getByText('My Activities').nth(1)).toBeVisible();
});

test('google-login', async ({ page }) => {
  await page.waitForURL(url => url.href.includes('/login'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button').nth(1).click();
  const page1 = await page1Promise;
  await page1.waitForURL(url => url.href.includes('accounts.google.com'));
  // Check element on the page to be sure it load and the user can interact with it
  await expect(page1.getByRole('button', { name: 'weshre-private.firebaseapp.com' })).toBeVisible();
});

/*
test('apple-login', async ({ page }) => {
  await page.waitForURL(url => url.href.includes('/login'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button').nth(2).click();
  const page1 = await page1Promise;
  await page1.waitForURL(url => url.href.includes('apple.com'));
  // Check element on the page to be sure it load and the user can interact with it
  await expect(page1.getByRole('button', { name: 'weshre-private.firebaseapp.com' })).toBeVisible();
});
*/

test('forget-password', async ({ page }) => {
  await page.waitForURL(url => url.href.includes('/login'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  await page.getByRole('link', { name: 'Forgot password' }).click();
  await page.waitForURL(url => url.href.includes('/forgot_password'));
  await expect(page.getByRole('button', { name: 'Send reset email' })).toBeVisible();

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_invalid');
  await page.getByRole('button', { name: 'Send reset email' }).click();
  await expect(page.getByText('Please enter a valid email')).toBeVisible();

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_unknow@gmail.com');
  await page.getByRole('button', { name: 'Send reset email' }).click();
  await expect(page.getByText("This email address doesn't correspond to any account")).toBeVisible();

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test@gmail.com');
  await page.getByRole('button', { name: 'Send reset email' }).click();
  await expect(page.getByText('An email has been send to you')).toBeVisible();
});

test('creation_account', async ({ page }) => {
  await page.waitForURL(url => url.href.includes('/login'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  await page.getByRole('link', { name: 'Sign up here' }).click();
  await page.waitForURL(url => url.href.includes('/sign_up'));

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('julien_impossible');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Please enter a valid email')).toBeVisible();
  
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test@gmail.com');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Please enter your password')).toBeVisible();
  
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText("Password should be at least 6 characters")).toBeVisible();
  
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('testtest');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText("This email address is already use. Login here")).toBeVisible();

  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_account_creation@test.com');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL(url => url.href.includes('/myActivities'));
  await expect(page.getByText('My Activities').nth(1)).toBeVisible();
  await page.waitForURL(url => url.href.includes('/login'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
});