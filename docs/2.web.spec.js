const { expect } = require('chai')
const { Builder, By } = require('selenium-webdriver')
const { Page } = require('../support/page')

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

        await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_FETCH_XML_TESTER_URI}`)
        let fetch = await page.element('#fetch')
        fetch.click()
        await page.wait(3 *1000)
        let result = await page.element('#data')
        let data = JSON.parse(await result.getText())

        expect(data[0].accountCount).to.be.gt(1)
    })
})
