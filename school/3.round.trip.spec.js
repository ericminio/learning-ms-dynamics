const { expect } = require('chai')
const { Builder, By } = require('selenium-webdriver')
const { Page } = require('../support/page')

describe('Round trip', ()=> {

    var driver

    before(async ()=> {
        driver = await new Builder().forBrowser('firefox').build()
    })
    after(async ()=> {
        await driver.quit()
    })

    it('works', async ()=> {
        page = new Page(driver)
        await connect(page)
        await deletePreviousTestingData(page)
        await createNewAccount(page)

        let data = await readWithFetchXml(page)
        expect(data[0].name).to.equal('round trip testing')

        let id = data[0].accountid
        let account = await readWithSimpleGet(page, id)
        expect(account.name).to.equal('round trip testing')
    })

    let connect = async (page)=> {
        await page.open(`${process.env.DYNAMICS_URL}/main.aspx?appid=${process.env.DYNAMICS_APP_ID}`)
        await page.input('#userNameInput', process.env.DYNAMICS_USERNAME)
        await page.input('#passwordInput', process.env.DYNAMICS_PASSWORD)
        await page.click('#submitButton')
    }
    let readWithSimpleGet = async (page, id)=> {
        await page.open(`${process.env.DYNAMICS_URL}/api/data/v9.0/accounts(${id})`)
        let json = await page.element('#json')
        let source = await json.getText()
        return JSON.parse(source)
    }
    let readWithFetchXml = async (page)=> {
        let xml = `
            <fetch mapping='logical' >
                <entity name='account'>
                    <all-attributes />
                    <filter>
                        <condition attribute='name' operator='eq' value='round trip testing' />
                    </filter>
                </entity>
            </fetch>`;
        await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_FETCH_XML_TESTER_URI}`)
        let query = await page.element('#query')
        await query.clear()
        await query.sendKeys(xml)
        let fetch = await page.element('#fetch')
        fetch.click()
        await page.wait(3 *1000)
        let result = await page.element('#data')
        let data = JSON.parse(await result.getText())

        return data
    }
    let createNewAccount = async (page)=> {
        await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_SDK_WEB_URI}`)
        let data = await page.element('#data')
        await data.clear()
        await data.sendKeys(JSON.stringify({ name:'round trip testing' }, null, 2))
        let execute = await page.element('#execute')
        execute.click()
        await page.wait(3 *1000)
        let status = await page.element('#status')
        let message = await status.getText()
        expect(message).to.equal('success')
    }
    let deletePreviousTestingData = async (page)=> {
        let toBeDeleted = `
            <fetch mapping='logical' >
                <entity name='account'>
                    <attribute name='name' />
                    <filter>
                        <condition attribute='name' operator='eq' value='round trip testing' />
                    </filter>
                </entity>
            </fetch>`;
        await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_FETCH_XML_TESTER_URI}`)
        let query = await page.element('#query')
        await query.clear()
        await query.sendKeys(toBeDeleted)
        let fetch = await page.element('#fetch')
        fetch.click()
        await page.wait(3 *1000)
        let result = await page.element('#data')
        let text = await result.getText()
        let data = []
        if (text != 'undefined') {
            data = JSON.parse(text)
        }

        for (var i=0; i<data.length; i++) {
            var accountid = data[i].accountid
            await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_SDK_WEB_URI}`)
            let id = await page.element('#id')
            await id.clear()
            await id.sendKeys(accountid)
            let deleteButton = await page.element('#delete')
            await deleteButton.click()
            await page.wait(1 *1000)
            let status = await page.element('#status')
            let message = await status.getText()
            expect(message).to.equal('success')
        }
    }
})
