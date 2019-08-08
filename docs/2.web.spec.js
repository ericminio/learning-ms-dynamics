const { expect } = require('chai')
const { Builder, By } = require('selenium-webdriver')
const { Page } = require('../support/pages/page')

describe('Web interaction', ()=> {

    var driver

    before(async ()=> {
        driver = await new Builder().forBrowser('firefox').build()
    })
    after(async ()=> {
        await driver.quit()
    })

    it('is welcome', async ()=> {
        page = new Page(driver)
        await page.open(`${process.env.DYNAMICS_URL}/main.aspx?appid=${process.env.DYNAMICS_APP_ID}`)
        await page.input('#userNameInput', process.env.DYNAMICS_USERNAME)
        await page.input('#passwordInput', process.env.DYNAMICS_PASSWORD)
        await page.click('#submitButton')

        await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_SDK_WEB_URI}`)
        let read = await page.element('#activate-read')
        read.click()
        let fetch = await page.element('#read-button')
        fetch.click()
        let result = await page.element('#message')
        let content = await result.getText()
        let data = JSON.parse(content)

        expect(data.response.value[0].accountCount).to.be.gt(1)
    })
})
