const LoginPage = require('../pages/login')

let connection = async function(driver) {
    let page = await LoginPage(driver)
    await page.connect()
}

module.exports = connection
