import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('playwright');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('img', { name: 'DashboardIcon' }).click();
  await page.waitForURL(url => url.href.includes('/myDashboard'));
  await expect(page.getByText('My Dashboard').nth(1)).toBeVisible();

  await page.getByRole('button', { name: 'icon' }).click();
  await page.locator('div > button').first().click();
  await expect(page.getByText('Are you sure you want to go')).toBeVisible();
  await expect(page.getByText('This action cannot be undone')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText('TOTAL EVENTS')).toBeVisible();
  await expect(page.getByText('TOTAL PARTICIPANTS')).toBeVisible();
  await expect(page.getByText('TOTAL TICKETS')).toBeVisible();
  await expect(page.getByText('TOP NATIONALITIES')).toBeVisible();
  await expect(page.getByText('TOP PARTICIPANTS')).toBeVisible();
  await expect(page.getByText('SALES')).toBeVisible();
  await expect(page.getByText('MONTHLY REVENUE')).toBeVisible();
});

test('resize_widget', async ({ page }) => {
  await page.getByRole('button', { name: 'icon' }).click();
  
  const resizableElement = page.getByText('TOP NATIONALITIESNo');
  const startBox = await resizableElement.boundingBox();

  const startPosition = { x: 1252, y: 298 }; // Replace with actual start coordinates
  const endPosition = { x: 1016, y: 262 }; // Replace with actual end coordinates

  // Perform drag and drop
  await page.mouse.move(startPosition.x, startPosition.y);
  await page.mouse.down();
  await page.mouse.move(endPosition.x, endPosition.y);
  await page.mouse.up();

  const endBox = await resizableElement.boundingBox();
  const isSmaller = (startBox!.width - endBox!.width) > 0
  expect(isSmaller).toBe(true);
});

test('movable_widget', async ({ page }) => {
  await page.getByRole('button', { name: 'icon' }).click();

  const totalEvent = page.getByText('TOTAL EVENTS');
  const totalPArticipants = page.getByText('TOTAL PARTICIPANTS');
  const monthlyRevenue = page.getByText('MONTHLY REVENUE');
  const sales = page.getByText('SALES');

  const startTotalEventBox = await totalEvent.boundingBox();
  const startTotalParticipantsBox = await totalPArticipants.boundingBox();
  const startMonthlyRevenueBox = await monthlyRevenue.boundingBox();
  const startSalesBox = await sales.boundingBox();

  await page.mouse.move(startSalesBox!.x + (startSalesBox!.width / 2), startSalesBox!.y + (startSalesBox!.height / 2));
  await page.mouse.down();
  await page.mouse.move(startTotalEventBox!.x + (startTotalEventBox!.width / 2), startTotalEventBox!.y + (startTotalEventBox!.height / 2));
  await page.mouse.up();

  await page.waitForTimeout(1000);

  const endTotalEventBox = await totalEvent.boundingBox();
  const endTotalParticipantsBox = await totalPArticipants.boundingBox();
  const endMonthlyRevenueBox = await monthlyRevenue.boundingBox();
  const endSalesBox = await sales.boundingBox();

  const totalEventHasMoved = endTotalEventBox!.x !== startTotalEventBox!.x || endTotalEventBox!.y !== startTotalEventBox!.y;
  const totalPArticipantsHasMoved = endTotalParticipantsBox!.x !== startTotalParticipantsBox!.x || endTotalParticipantsBox!.y !== startTotalParticipantsBox!.y;
  const monthlyRevenueHasMoved = endMonthlyRevenueBox!.x !== startMonthlyRevenueBox!.x || endMonthlyRevenueBox!.y !== startMonthlyRevenueBox!.y;
  const salesHasMoved = endSalesBox!.x !== startSalesBox!.x || endSalesBox!.y !== startSalesBox!.y;

  expect(totalEventHasMoved).toBe(true);
  expect(totalPArticipantsHasMoved).toBe(true);
  expect(monthlyRevenueHasMoved).toBe(true);
  expect(salesHasMoved).toBe(true);
});

test('deletion_addition_widget', async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByRole('button', { name: 'icon' }).click();
  await page.waitForTimeout(500);

  await expect(page.locator('div > button').first()).toBeVisible();
  await expect(page.locator('button:nth-child(2)')).toBeVisible();
  await expect(page.locator('button:nth-child(3)')).toBeVisible();

  await page.locator('button:nth-child(2)').click();
  await expect(page.getByText('You already have all the')).toBeVisible();
  await page.getByRole('button', { name: 'Back Dashboard' }).click();

  await page.getByLabel('delete_total_ticket').click();
  await expect(page.getByText('TOTAL TICKETS')).toBeHidden();
  await page.getByLabel('delete_total_participant').click();
  await expect(page.getByText('TOTAL PARTICIPANTS')).toBeHidden();

  await page.locator('button:nth-child(2)').click();
  await page.getByRole('button', { name: 'icon' }).nth(1).click();
  await page.getByRole('button', { name: 'icon' }).first().click();
  await page.getByRole('button', { name: 'Add to my dashboard' }).click();
  await expect(page.locator('div:nth-child(6) > div > div:nth-child(2) > div').first()).toBeVisible();

  await page.locator('button:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'Add to my dashboard' }).click();
  await expect(page.locator('div:nth-child(7) > div > div:nth-child(2) > div').first()).toBeVisible();

  await page.locator('button:nth-child(2)').first().click();
  await expect(page.getByText('You already have all the')).toBeVisible();
  await page.getByRole('button', { name: 'Back Dashboard' }).click();

  await page.locator('button:nth-child(3)').click();
  await expect(page.getByText('TOTAL PARTICIPANTS')).toBeVisible()
  await expect(page.getByText('TOTAL TICKETS')).toBeVisible();
});

test('save_dashboard', async ({ page }) => {
  await page.getByRole('button', { name: 'icon' }).click();
  await page.locator('button:nth-child(2)').click();
  await expect(page.getByText('You already have all the')).toBeVisible();
  await page.getByRole('button', { name: 'Back Dashboard' }).click();

  await page.getByLabel('delete_total_ticket').click();
  await expect(page.getByText('TOTAL TICKETS')).toBeHidden();
  await page.locator('button:nth-child(3)').click();

  await page.waitForTimeout(3000);

  await page.goto('http://localhost:3000/en/myDashboard');

  await page.waitForTimeout(3000);
  if (page.url().includes('/login')) {
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('playwright');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('img', { name: 'DashboardIcon' }).click();
    await page.waitForURL(url => url.href.includes('/myDashboard'));
    await expect(page.getByText('My Dashboard').nth(1)).toBeVisible();
  }

  await expect(page.getByText('TOTAL EVENTS')).toBeVisible();
  await expect(page.getByText('TOTAL TICKETS')).toBeHidden();

  await page.getByRole('button', { name: 'icon' }).click();
  await page.locator('button:nth-child(2)').click();
  await page.getByRole('button', { name: 'Add to my dashboard' }).click();
  await page.locator('button:nth-child(3)').click();
  
  await expect(page.getByText('TOTAL TICKETS')).toBeVisible();

  await page.waitForTimeout(3000);

  await page.goto('http://localhost:3000/en/myDashboard');

  await page.waitForTimeout(3000);
  if (page.url().includes('/login')) {
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('playwright');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('img', { name: 'DashboardIcon' }).click();
    await page.waitForURL(url => url.href.includes('/myDashboard'));
    await expect(page.getByText('My Dashboard').nth(1)).toBeVisible();
  }
  
  await expect(page.getByText('TOTAL TICKETS')).toBeVisible();
});
