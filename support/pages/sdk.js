const { Page } = require('./page')

module.exports = async (driver)=>{
    var page = new Page(driver)
    await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_SDK_WEB_URI}`)

    page.setCollection = async function(collection) {
        let element = await page.element('#entityNamePlural')
        await element.clear()
        await element.sendKeys(collection)
    }
    page.read = async function(options) {
        await this.setCollection(options.collection)
        let read = await page.element('#activate-read')
        await read.click()
        let query = await page.element('#fetch-xml-query')
        await query.clear()
        await query.sendKeys(options.xml)
        let fetch = await page.element('#read-button')
        fetch.click()
        await page.wait(3 *1000)
        let result = await page.element('#message')
        let content = await result.getText()
        let data = []
        if (content != 'undefined') {
            data = JSON.parse(content).response.value
        }
        return data
    }
    page.delete = async function(options) {
        await this.setCollection(options.collection)
        let deletion = await page.element('#activate-delete')
        deletion.click()
        let id = await page.element('#id-to-be-deleted')
        await id.clear()
        await id.sendKeys(options.id)
        let deleteButton = await page.element('#delete-button')
        await deleteButton.click()
        await page.wait(3 *1000)
        let status = await page.element('#status')
        let message = await status.getText()
    }
    page.create = async function(options) {
        await this.setCollection(options.collection)
        let creation = await page.element('#activate-create')
        creation.click()
        let data = await page.element('#creation-payload')
        await data.clear()
        await data.sendKeys(JSON.stringify(options.json, null, 2))
        let create = await page.element('#create-button')
        create.click()
        await page.wait(3 *1000)
        let status = await page.element('#status')
        let message = await status.getText()
    }

    return page
}
