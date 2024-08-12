import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_create_event_test@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('playwright');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(url => url.href.includes('/myActivities'));
});

test('create_event', async ({ page, context }) => {
  test.setTimeout(120000);
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

  await page.getByRole('button', { name: 'icon' }).click();
  // Page 1:
  await page.waitForURL(url => url.href.includes('/newActivity'));
  await page.waitForTimeout(2000);
  await expect(page.getByText('Share the general information')).toBeVisible();
  await expect(page.getByText('What is the type of your new')).toBeVisible();
  await expect(page.getByText('When do you organize your')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Card background Party' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Card background Sport' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Card background Experience' })).toBeVisible();
  await expect(page.getByPlaceholder('Choose your date')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^from$/ }).nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^to$/ }).nth(1)).toBeVisible();

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  await expect(page.getByText('Minimum number of selected')).toBeVisible();
  await expect(page.getByText('Field required').first()).toBeVisible();
  await expect(page.getByText('Field required').nth(1)).toBeVisible();
  await expect(page.getByText('Field required').nth(2)).toBeVisible();

  await page.getByRole('button', { name: 'Card background Party' }).click();
  await page.getByPlaceholder('Choose your date').click();
  await page.getByRole('button', { name: '2024' }).click();
  await page.getByRole('button', { name: '2035' }).click();
  await page.getByRole('button', { name: '1', exact: true }).first().click();
  await page.getByRole('button', { name: '1', exact: true }).first().click();
  await page.getByRole('textbox').nth(1).fill('03:10');
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('05:10');

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  // Page 2:
  await expect(page.getByText('Give your activity a title')).toBeVisible();
  await expect(page.getByText('Title:')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your title')).toBeVisible();
  await expect(page.getByText('Description:')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your description')).toBeVisible();
  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  await expect(page.locator('div').filter({ hasText: /^Field required$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Field required$/ }).nth(2)).toBeVisible();

  await page.getByPlaceholder('Enter your title').click();
  await page.getByPlaceholder('Enter your title').fill('Test creation event');
  await page.getByPlaceholder('Enter your description').click();
  await page.getByPlaceholder('Enter your description').fill('Test description');

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
  // Page 3:
  await expect(page.getByText('Where\'s your activity located?')).toBeVisible();
  await expect(page.getByText('Your address is only shared')).toBeVisible();

  await expect(page.getByPlaceholder('Enter Country')).toBeVisible();
  await expect(page.getByPlaceholder('Enter City')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Postal Code')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Street Name')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Street Number')).toBeVisible();
  await expect(page.getByPlaceholder('Research')).toBeVisible();
  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  await expect(page.getByText('Country is required')).toBeVisible();
  await expect(page.getByText('City is required')).toBeVisible();
  await expect(page.getByText('Postal code is required')).toBeVisible();
  await expect(page.getByText('Street name is required')).toBeVisible();
  await expect(page.getByText('Street number is required')).toBeVisible();

  await page.getByPlaceholder('Enter Country').click();
  await page.getByPlaceholder('Enter Country').fill('belgique');
  await page.getByPlaceholder('Enter City').click();
  await page.getByPlaceholder('Enter City').fill('durbuy');
  await page.getByPlaceholder('Enter Postal Code').click();
  await page.getByPlaceholder('Enter Postal Code').fill('6940');
  await page.getByPlaceholder('Enter Street Name').click();
  await page.getByPlaceholder('Enter Street Name').fill('vieux mont');
  await page.getByPlaceholder('Enter Street Number').click();
  await page.getByPlaceholder('Enter Street Number').fill('4');

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  // Page 4:
  await expect(page.getByText('Add photos to your activity!')).toBeVisible();
  await expect(page.getByText('Photo help guests imagine')).toBeVisible();

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
  await expect(page.getByText('Cover image is required')).toBeVisible();

  const filePath = path.resolve(__dirname, '../public/images/Test/weshre_default_event.jpeg');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.getByRole('button', { name: 'Save cover' }).click();
  await expect(page.getByText('Cover photo', { exact: true })).toBeVisible();
  await expect(page.getByText('This will be the photo that')).toBeVisible();

  await expect(page.getByText('Additionnals photos')).toBeHidden();
  await expect(page.getByText('Theses photos could help')).toBeHidden();

  const filePath2 = path.resolve(__dirname, '../public/images/Test/test_image_size.jpg');
  const fileInput2 = page.locator('input[type="file"]');
  await fileInput2.setInputFiles(filePath2);

  await expect(page.getByText('Additionnals photos')).toBeVisible();
  await expect(page.getByText('Theses photos could help')).toBeVisible();

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  // Page 5:

  await expect(page.getByText('Add info on the guests')).toBeVisible();
  await expect(page.getByText('Put the number of guest, the')).toBeVisible();
  await expect(page.getByText('Number of Guests')).toBeVisible();
  await expect(page.getByText('Minimum Age', { exact: true })).toBeVisible();
  await expect(page.getByText('Languages', { exact: true })).toBeVisible();
  await expect(page.getByText('Which languages will be')).toBeVisible();
  await expect(page.getByRole('button', { name: 'icon Add Language' })).toBeVisible();
  await expect(page.getByText('FRFrench')).toBeHidden();

  await page.getByRole('button', { name: 'icon' }).nth(1).click();
  await page.getByRole('button', { name: 'icon Add Language' }).click();

  await expect(page.getByLabel('Add Language').getByText('Add Language')).toBeVisible();
  await expect(page.getByPlaceholder('Research...')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await page.getByPlaceholder('Research...').click();
  await page.getByPlaceholder('Research...').fill('fr');
  await expect(page.getByRole('button', { name: 'AF Afrikaans' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'FR French' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'FY Western Frisian' })).toBeVisible();
  await page.getByRole('button', { name: 'FR French' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.locator('form').getByText('French')).toBeVisible();

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

  // page 6:
  await expect(page.getByText('Add groups or teams')).toBeVisible();
  await expect(page.getByText('Create groups or teams for')).toBeVisible();
  await expect(page.getByText('Activate the team feature')).toBeVisible();
  await page.locator('label span').first().click();

  await expect(page.getByText('Team Name')).toBeHidden();
  await expect(page.getByText('Description', { exact: true })).toBeHidden();
  await expect(page.getByText('Size')).toBeHidden();

  await page.getByRole('button', { name: 'icon Add Team' }).click();
  await expect(page.getByText('Team Name')).toBeVisible();
  await expect(page.getByText('Description', { exact: true })).toBeVisible();
  await expect(page.getByText('Size')).toBeVisible();
  await expect(page.locator('.w-full > div:nth-child(3) > div > div').first()).toBeVisible();
  await page.getByRole('button', { name: 'icon Add Team' }).click();
  await expect(page.locator('div:nth-child(4) > div > div')).toBeVisible();

  await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

   // page 7:

   await expect(page.getByText('Tell your guests what')).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Parking' })).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Pool', exact: true })).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Jacuzzi' })).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Rooftop' })).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Pool table' })).toBeVisible();
   await page.getByRole('button', { name: 'Card background Parking' }).click();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   // page 8:
   await expect(page.getByText('Tell your guests what will be')).toBeVisible();
   await expect(page.getByText('Drinks')).toBeVisible();
   await expect(page.getByText('Food')).toBeVisible();
   await expect(page.getByText('Equipment')).toBeVisible();
   await expect(page.getByText('Others')).toBeVisible();
   await page.locator('.px-1').first().click();
   await page.getByRole('button', { name: 'icon Add drinks' }).click();
   await expect(page.getByText('Name')).toBeVisible();
   await expect(page.getByText('Description', { exact: true })).toBeVisible();
   await expect(page.getByText('Quantity')).toBeVisible();
   await expect(page.locator('.w-full > div:nth-child(3) > div > div').first()).toBeVisible();
   await page.getByPlaceholder('...').first().click();
   await page.getByPlaceholder('...').first().fill('Water');
   await page.getByPlaceholder('...').nth(1).click();
   await page.getByPlaceholder('...').nth(1).fill('SPA Water');
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();

   // page 9:
   await expect(page.getByText('Tell your guests about the')).toBeVisible();
   await expect(page.getByText('Rules to respect:')).toBeVisible();
   await expect(page.getByPlaceholder('Tell your guests the rules')).toBeVisible();
   await page.getByPlaceholder('Tell your guests the rules').click();
   await page.getByPlaceholder('Tell your guests the rules').fill('qzdqzdqz');
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   
   // page 10:

   await expect(page.getByText('Decide about the visibility')).toBeVisible();
   await expect(page.getByText('You can decide the visibility')).toBeVisible();
   await expect(page.locator('div').filter({ hasText: /^Private activity$/ }).first()).toBeVisible();
   await expect(page.locator('div').filter({ hasText: /^Restricted to group$/ }).first()).toBeVisible();
   await page.locator('form span').nth(2).click();
   await expect(page.locator('div').filter({ hasText: /^Private activity$/ }).first()).toBeHidden();
   await expect(page.locator('div').filter({ hasText: /^Restricted to group$/ }).first()).toBeVisible();
   await expect(page.getByText('Group Selection')).toBeVisible();
   await expect(page.getByText('Which group would you like to')).toBeVisible();
   await expect(page.getByText('You don\'t seem to belong to')).toBeVisible();
   await page.locator('label span').first().click();
   await expect(page.locator('div').filter({ hasText: /^Private activity$/ }).first()).toBeVisible();
   await expect(page.locator('div').filter({ hasText: /^Restricted to group$/ }).first()).toBeVisible();
   await page.locator('form span').nth(1).click();
   await expect(page.locator('div').filter({ hasText: /^Private activity$/ }).first()).toBeVisible();
   await expect(page.locator('div').filter({ hasText: /^Restricted to group$/ }).first()).toBeHidden();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   // page 11:

   await expect(page.getByText('Set the price of your activity')).toBeVisible();
   await expect(page.getByText('Auto-accept requests')).toBeVisible();
   await expect(page.getByText('The app will accept')).toBeVisible();

   await page.getByRole('button', { name: 'icon' }).nth(2).click();
   await expect(page.getByText('Price is required')).toBeVisible();

   await page.locator('.px-1 > .z-10').first().click();
   await page.getByPlaceholder('...').first().click();
   await page.getByPlaceholder('...').first().fill('4');
   await page.getByPlaceholder('...').first().press('Enter');
   await expect(page.getByText('0.20')).toBeVisible();
   await expect(page.locator('div:nth-child(3) > div:nth-child(2) > .group > .px-1')).toBeVisible();
   await expect(page.getByText('Price for member with ESN Card')).toBeHidden();
   await page.locator('div:nth-child(3) > div:nth-child(2) > .group > .px-1').click();
   await expect(page.getByText('Price for member with ESN Card')).toBeVisible();
   await page.getByPlaceholder('...').nth(2).click();
   await page.getByPlaceholder('...').nth(2).fill('3');
   await page.getByPlaceholder('...').nth(2).press('Enter');
   await expect(page.getByText('0.15')).toBeVisible();
   await expect(page.locator('form div').filter({ hasText: 'Price for member with ESN CardPriceFees 0.15 Total' }).getByRole('button')).toBeVisible();
   await page.locator('form div').filter({ hasText: 'Price for member with ESN CardPriceFees 0.15 Total' }).getByRole('button').click();
   await expect(page.getByText('What are theses service fees?')).toBeVisible();
   await expect(page.getByText('For the service provides')).toBeVisible();
   await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Close' })).toBeVisible();
   await page.getByRole('contentinfo').getByRole('button', { name: 'Close' }).click();

   await expect(page.getByText('Cancellation policy', { exact: true })).toBeVisible();
   await expect(page.getByText('Activity can be cancelled and')).toBeVisible();
   await expect(page.locator('div').filter({ hasText: /^Change cancellation policy$/ }).first()).toBeVisible();
   await expect(page.locator('form div').filter({ hasText: 'Cancellation policyUntil how' }).nth(1)).toBeHidden();
   await page.locator('div:nth-child(6) > div:nth-child(2) > .group > .px-1 > .z-10').click();
   await expect(page.locator('form div').filter({ hasText: 'Cancellation policyUntil how' }).nth(1)).toBeVisible();
   await page.getByLabel('day,').click();
   await page.getByLabel('4 day', { exact: true }).getByText('day').click();

   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   // page 12:

   await expect(page.getByText('Let\'s publish your activity!')).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Test creation' })).toBeVisible();
   await expect(page.getByText('What\'s next?')).toBeVisible();
   await expect(page.getByRole('img', { name: 'icon', exact: true }).first()).toBeVisible();
   await expect(page.getByText('Prepare everything to welcome')).toBeVisible();
   await expect(page.getByRole('img', { name: 'icon', exact: true }).nth(1)).toBeVisible();
   await expect(page.getByText('Go to the feed to access the')).toBeVisible();
   await expect(page.getByRole('img', { name: 'icon', exact: true }).nth(2)).toBeVisible();
   await expect(page.getByText('Enjoy your activity and have')).toBeVisible();
   await page.getByRole('button', { name: 'Save & Exit' }).click();
   await expect(page.getByText('Loading...')).toBeVisible();
   await expect(page.getByRole('button', { name: 'Card background Test creation' })).toBeHidden();
   await page.getByRole('button', { name: 'Draft' }).click();
   await expect(page.getByRole('button', { name: 'Card background Test creation' })).toBeVisible();

   // Publish it:
   
   await page.getByRole('button', { name: 'Card background Test creation' }).click();
   await expect(page.getByText('Share the general information')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
  await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Give your activity a title')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Where\'s your activity located?')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Add photos to your activity!')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Add info on the guests')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Add groups or teams')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Tell your guests what')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Tell your guests what will be')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Tell your guests about the')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Decide about the visibility')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Set the price of your activity')).toBeVisible();
   await expect(page.getByLabel('next-page-button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('next-page-button').getByRole('button', { name: 'icon' }).click();
   await expect(page.getByText('Let\'s publish your activity!')).toBeVisible();

   await page.getByRole('button', { name: 'Publish' }).click();
   await expect(page.getByText('Loading...')).toBeVisible();

   await expect(page.getByText('You have no draft activities')).toBeVisible();
   await page.getByRole('button', { name: 'Coming' }).click();
   await expect(page.getByRole('button', { name: 'Card background Test creation' })).toBeVisible(); 

   // Delete the event:
   const eventCard = page.getByRole('button', { name: 'Card background Test creation' });
   const eventCardBox = await eventCard.boundingBox();
   await page.mouse.move(eventCardBox!.x + (eventCardBox!.width/2), eventCardBox!.y + (eventCardBox!.height/2));
   await expect(page.getByLabel('delete_button').getByRole('button', { name: 'icon' })).toBeVisible();
   await page.getByLabel('delete_button').getByRole('button', { name: 'icon' }).click();

   await expect(page.getByText('Are you sure you want to')).toBeVisible();
   await expect(page.getByText('This action cannot be undone')).toBeVisible();
   await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
   await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
   await page.getByRole('button', { name: 'Confirm' }).click();
   await expect(page.getByText('No activities coming soon')).toBeVisible();
});