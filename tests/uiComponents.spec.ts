import { test, expect } from '@playwright/test'
import { first } from 'rxjs-compat/operator/first'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200')
})

test.describe('Form layout page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid'}).getByRole('textbox', { name: 'Email'})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 10 })

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')

    })

    test('radio buttons', async({page}) => {
        const usingTheGridEmailForm = page.locator('nb-card', { hasText: 'Using the Grid'})

        //await usingTheGridEmailForm.getByLabel('option 1').check({force: true})
        await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1'}).check({force: true})
        const radioStatus = await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridEmailForm.getByRole('radio', { name: 'Option 1'})).toBeChecked()

        await usingTheGridEmailForm.getByRole('radio', { name: 'Option 2'}).check({force: true})
        expect(await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', { name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})

test('Checkboxes', async ({page}) => {
        await page.getByText("Modal & Overlays").click();
        await page.getByText("Toastr").click();

        // await page.getByRole('checkbox', { name : 'Hide on click'}).uncheck({force: true})
        // await page.getByRole('checkbox', { name : 'Prevent arising of duplicate toast'}).check({force: true})
        
        await page.waitForTimeout(500)
        const allBoxes = page.getByRole('checkbox')

        for(const box of await allBoxes.all()){
            await box.check({ force: true })
            expect(await box.isChecked()).toBeTruthy()
        }

        for(const box of await allBoxes.all()){
            await box.uncheck({ force: true })
            expect(await box.isChecked()).toBeFalsy()
        }
})

test('lists and dropdowns', async ({ page }) => {
    const dropDownMeanu = page.locator('ngx-header nb-select')
    await dropDownMeanu.click()

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({ hasText: 'Cosmic'}).click()
    const header = page.locator('nb-layout-header')

    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)'
    }

    await dropDownMeanu.click()
    for(const color in colors){
        await optionList.filter({ hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != 'Corporate')
          await dropDownMeanu.click()
    }
})

test('Tooltip scenario', async ({ page })=> {
        await page.getByText("Modal & Overlays").click();
        await page.getByText("Tooltip").click();

        const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements'})
        await toolTipCard.getByRole('button', { name: 'Top'}).hover()
        const toolTip = await page.locator('nb-tooltip').textContent()
        expect(toolTip).toEqual('This is a tooltip')
})

test('Dialog box scenario', async ({ page })=> {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    //await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    const firstRow = page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com'}).locator('.nb-trash')
    await firstRow.click()
    await expect(firstRow).not.toBeVisible()
})

test('Web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()

    const inputTable = page.locator('input-editor')
    await inputTable.getByPlaceholder('Age').clear()
    await inputTable.getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await inputTable.getByPlaceholder('E-mail').clear()
    await inputTable.getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')    
})