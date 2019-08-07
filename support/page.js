const { By } = require('selenium-webdriver')

var Page = function(driver, options) {
    this.driver = driver
}
Page.prototype.open = async function(url) {
    await this.driver.get(url)
}
Page.prototype.input = async function(selector, value) {
    let field = await this.driver.findElement(By.css(selector))
    await field.sendKeys(value)
}
Page.prototype.click = async function(selector) {
    let element = await this.driver.findElement(By.css(selector))
    await element.click()
}
Page.prototype.list = async function(selector) {
    let elements = await this.driver.findElements(By.css(selector))
    return elements
}
Page.prototype.source = async function() {
    return await this.driver.getPageSource()
}
Page.prototype.wait = async function(ms) {
    await this.driver.sleep(ms)
}
Page.prototype.elements = async function(options) {
    var found
    var tryAgain = true
    var totalWait = 0
    while (tryAgain) {
        found = await this.driver.findElements(By.css(options.selector));
        if (found.length == 0 && totalWait < options.timeout) {
            tryAgain = true
            await this.driver.sleep(1000)
        }
        else {
            tryAgain = false
        }
    }
    return found
}
Page.prototype.element = async function(selector) {
    let options = { selector:selector, timeout:60*1000 }
    let elements = await this.elements(options)
    return elements[0]
}

module.exports = { Page:Page }
