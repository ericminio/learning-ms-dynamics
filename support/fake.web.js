const { JSDOM } = require('jsdom')
const dom = new JSDOM(``)
global.window = dom.window
