import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("the first test", async ({ page }) => {
  await page.getByText("Form Layouts").click();
});

test("navigate to the date picker page", async ({ page }) => {
  await page.getByText("Datepicker").click();
});

test("User facing locations", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign nn" });

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("Using the Grid").click();

  // await page.getByTitle("IoT Dashboard").click()

  await page.getByTestId("SignIn").click();
});

test("locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

    await page.locator('nb-card').nth(3).getByRole('button').click()
});

test("locating parent elements", async ( { page }) => {
  await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()
  await page.locator('nb-card', { has: page.locator('#inputEmail1')}).getByRole('textbox', { name: "Email" }).click()

  await page.locator('nb-card').filter({ hasText: "Basic form"}).getByRole('textbox', { name: "Email" }).click()
  await page.locator('nb-card').filter({ has: page.locator('.status-danger')}).getByRole('textbox', { name: "Password" }).click()

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter( {hasText: "Sign In"} )
    .getByRole('textbox', { name: "Email" }).click()

   await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
})

test("Reusing locator", async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form"})
  const emailField = basicForm.getByRole('textbox', { name: "Email" })

  await emailField.fill('test@test.com')
  await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailField).toHaveValue('test@test.com')
})


test('Extracting values', async({page}) => {
  //single test value
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form"})
  const buttonText = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')

  //all text values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain('Option 1')

  //input value
  const emailField = basicForm.getByRole('textbox', { name: "Email" })
  await emailField.fill('test@test.com')
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('test@test.com')

  const placeHolderValue = await emailField.getAttribute('placeholder')
  expect(placeHolderValue).toEqual('Email')
})

test('Assertions', async ({page}) => {
  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form"}).locator('button')

  //Generic assertions
  const text = await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  // Locator assertion
  await expect(basicFormButton).toHaveText('Submit')

  //Soft Assertion
  await expect.soft(basicFormButton).toHaveText('Submit1')
  await basicFormButton.click()
})

