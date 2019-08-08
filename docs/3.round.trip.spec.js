const { expect } = require('chai')
const { Builder, By } = require('selenium-webdriver')
const { Page } = require('../support/pages/page')
const connection = require('../support/activities/connection')
const deleteAccounts = require('../support/activities/delete.accounts')
const createAccount = require('../support/activities/create.account')
const selectAccounts = require('../support/activities/select.accounts')

describe('Round trip', ()=> {

    var driver

    before(async ()=> {
        driver = await new Builder().forBrowser('firefox').build()
        await connection(driver)
    })
    after(async ()=> {
        await driver.quit()
    })

    it('works', async ()=> {
        await deleteAccounts({ name:'round trip testing' }, driver)
        let rows = await selectAccounts({ name:'round trip testing' }, driver)
        expect(rows).to.deep.equal([])

        await createAccount({ json:{ name:'round trip testing' }}, driver)
        rows = await selectAccounts({ name:'round trip testing' }, driver)
        expect(rows.length).to.equal(1)

        let accountid = rows[0].accountid
        let record = await readWithSimpleGet(accountid)
        expect(record.name).to.equal('round trip testing')
    })

    let readWithSimpleGet = async (id)=> {
        let page = new Page(driver)
        await page.open(`${process.env.DYNAMICS_URL}/api/data/v9.0/accounts(${id})`)
        let json = await page.element('#json')
        let source = await json.getText()

        return JSON.parse(source)
    }
})
