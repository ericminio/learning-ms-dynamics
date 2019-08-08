const SdkPage = require('../pages/sdk')

let createAccount = async (options, driver)=> {
    let page = await SdkPage(driver)
    await page.create({ collection:'accounts', json:options.json})
}

module.exports = createAccount
