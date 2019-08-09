const { Page } = require('./page')

module.exports = async (driver)=>{
    var page = new Page(driver)
    await page.open(`${process.env.DYNAMICS_URL}${process.env.DYNAMICS_SDK_WEB_URI}`)

    page.waitForResults = async function() {
        let tryAgain = true
        while (tryAgain) {
            let message = await this.element('#message')
            let content = await message.getText()
            if (content.length == 0){
                await this.driver.sleep(500)
            }
            else {
                tryAgain = false
            }
        }
    }
    page.setCollection = async function(collection) {
        await page.input('#entityNamePlural', collection)
    }
    page.read = async function(options) {
        await this.setCollection(options.collection)
        await page.click('#activate-read')
        await page.input('#fetch-xml-query', options.xml)
        await page.click('#read-button')
        await page.waitForResults()
        let content = await page.content('#message')
        let data = []
        if (content != 'undefined') {
            data = JSON.parse(content).response.value
        }
        return data
    }
    page.delete = async function(options) {
        await this.setCollection(options.collection)
        await page.click('#activate-delete')
        await page.input('#id-to-be-deleted', options.id)
        await page.click('#delete-button')
        await page.waitForResults()
    }
    page.create = async function(options) {
        await this.setCollection(options.collection)
        await page.click('#activate-create')
        await page.input('#creation-payload', JSON.stringify(options.json, null, 2))
        await page.click('#create-button')
        await page.waitForResults()
    }

    return page
}
