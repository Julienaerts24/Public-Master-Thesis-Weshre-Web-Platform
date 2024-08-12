import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
});

test('home_page', async ({ page }) => {
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('playwright');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByPlaceholder('Research...').fill('Homepage');
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByPlaceholder('Research...').fill('st Eve');
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByPlaceholder('Research...').fill('Test2');
  await expect(page.getByText('No activities match your')).toBeVisible();
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByPlaceholder('Research...').fill('Homepage Test Event Coming');
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByPlaceholder('Research...').fill('Homepage Test Event Coming ');
  await expect(page.getByText('No activities match your')).toBeVisible();
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();
  
  await page.getByPlaceholder('Research...').fill('');
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByLabel('fMZmhJhpxzKPaDkzyIeq').click();
  await page.waitForURL(url => url.href.includes('myActivities/fMZmhJhpxzKPaDkzyIeq'));
  await expect(page.getByText('Homepage Test Event Coming')).toBeVisible();
  await expect(page.getByText('TICKET SOLD')).toBeVisible();
  await expect(page.getByText('AMOUNT RECEIVED')).toBeVisible();
   await expect(page.getByText('PARTICIPANTS', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'icon' }).click();
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeVisible();

  await page.getByRole('button', { name: 'Past' }).click();
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeVisible();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();
  
  await page.getByLabel('vplFxv1r2pQmD1ZbGYZA').click();
  await page.waitForURL(url => url.href.includes('myActivities/vplFxv1r2pQmD1ZbGYZA'));
  await expect(page.getByText('Homepage Test Event Past')).toBeVisible();
  await expect(page.getByText('TICKET SOLD')).toBeVisible();
  await expect(page.getByText('AMOUNT RECEIVED')).toBeVisible();
   await expect(page.getByText('PARTICIPANTS', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'icon' }).click();
  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeVisible();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeHidden();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeHidden();

  await page.getByRole('button', { name: 'Draft' }).click();

  await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
  await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
  await expect(page.getByLabel('b2fg0rauMKxXq0xNSKIT')).toBeVisible();
  await expect(page.getByLabel('ORk7wg9lOkvWbU0GkWrH')).toBeVisible();

  const getEventBoundingBoxes = async () => {
    const event1 = page.getByLabel('b2fg0rauMKxXq0xNSKIT');
    const event2 = page.getByLabel('ORk7wg9lOkvWbU0GkWrH');
    await expect(event1).toBeVisible();
    await expect(event2).toBeVisible();
    await expect(page.getByLabel('fMZmhJhpxzKPaDkzyIeq')).toBeHidden();
    await expect(page.getByLabel('vplFxv1r2pQmD1ZbGYZA')).toBeHidden();
    const event1Box = await event1.boundingBox();
    const event2Box = await event2.boundingBox();
    return { event1Box, event2Box };
  };

  // Initial positions of the events
  let { event1Box, event2Box } = await getEventBoundingBoxes();

  let isLeftOrAbove = event1Box!.x < event2Box!.x || event1Box!.y < event2Box!.y;
  expect(isLeftOrAbove).toBe(true);

  // Sort by Date Descending and re-check positions
  await page.getByLabel('sort_button').getByRole('img').click();
  await page.getByLabel('Date Descending').click();
  ({ event1Box, event2Box } = await getEventBoundingBoxes());
  isLeftOrAbove = event1Box!.x < event2Box!.x || event1Box!.y < event2Box!.y;
  expect(isLeftOrAbove).toBe(false);

  // Change sort order to Title Ascending
  await page.getByLabel('Title Ascending').click();
  ({ event1Box, event2Box } = await getEventBoundingBoxes());
  isLeftOrAbove = event1Box!.x < event2Box!.x || event1Box!.y < event2Box!.y;
  expect(isLeftOrAbove).toBe(true);

  // Change sort order to Title Descending
  await page.getByLabel('Title Descending').click();
  ({ event1Box, event2Box } = await getEventBoundingBoxes());
  isLeftOrAbove = event1Box!.x < event2Box!.x || event1Box!.y < event2Box!.y;
  expect(isLeftOrAbove).toBe(false);

  // Change sort order to Date Ascending
  await page.getByLabel('Date Ascending').click();
  ({ event1Box, event2Box } = await getEventBoundingBoxes());
  isLeftOrAbove = event1Box!.x < event2Box!.x || event1Box!.y < event2Box!.y;
  expect(isLeftOrAbove).toBe(true);
});
