const { Page } = require('./page')

module.exports = async (driver)=>{
    var page = new Page(driver)
    await page.open(`${process.env.DYNAMICS_URL}/main.aspx?appid=${process.env.DYNAMICS_APP_ID}`)

    page.connect = async function() {
        await this.input('#userNameInput', process.env.DYNAMICS_USERNAME)
        await this.input('#passwordInput', process.env.DYNAMICS_PASSWORD)
        await this.click('#submitButton')
    }

    return page
}
