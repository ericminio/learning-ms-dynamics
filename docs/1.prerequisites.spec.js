const { expect } = require('chai')
const { Builder, By } = require('selenium-webdriver')
const { Page } = require('../support/page')

describe('prerequisites', ()=> {

    it('needs target urls', ()=> {
        expect(process.env.DYNAMICS_URL).not.to.equal(undefined)
        expect(process.env.DYNAMICS_APP_ID).not.to.equal(undefined)
        expect(process.env.DYNAMICS_SDK_WEB_URI).not.to.equal(undefined)
    })
    it('needs credentials', ()=> {
        expect(process.env.DYNAMICS_USERNAME).not.to.equal(undefined)
        expect(process.env.DYNAMICS_PASSWORD).not.to.equal(undefined)
    })
})
