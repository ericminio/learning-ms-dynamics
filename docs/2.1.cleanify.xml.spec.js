const { expect } = require('chai')
const cleanifyXml = require('../support/expose')({
    method:'cleanifyXml',
    inScriptTagContaining:'cleanifyXml',
    inFile:require('path').join(__dirname, '..', 'Web Resources', 'sdk.html')
})

describe('cleanify xml', ()=> {

    it('is available', ()=> {
        expect(cleanifyXml).not.to.equal(undefined)
    })

    it('works with one line', ()=>{
        var actual = cleanifyXml('<hello>world</hello>')

        expect(actual).to.equal(`<hello>\n    world\n</hello>\n`)
    })

    it('works with slef-closed tag', ()=>{
        var actual = cleanifyXml('<hello><world/></hello>')

        expect(actual).to.equal(`<hello>\n    <world/>\n</hello>\n`)
    })

    it('works with one nested child', ()=>{
        var actual = cleanifyXml('<greetings><hello>world</hello></greetings>')

        expect(actual).to.equal(`<greetings>\n    <hello>\n        world\n    </hello>\n</greetings>\n`)
    })

    it('works with two nested children', ()=>{
        var actual = cleanifyXml('<greetings><hello>world</hello><welcome>here</welcome></greetings>')

        expect(actual).to.equal(`<greetings>\n    <hello>\n        world\n    </hello>\n    <welcome>\n        here\n    </welcome>\n</greetings>\n`)
    })

    it('works with two children of different nature', ()=>{
        var actual = cleanifyXml('<greetings><hello value="world"/><welcome>here</welcome></greetings>')

        expect(actual).to.equal(`<greetings>\n    <hello value="world"/>\n    <welcome>\n        here\n    </welcome>\n</greetings>\n`)
    })
})
