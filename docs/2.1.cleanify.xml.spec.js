const { expect } = require('chai')

describe('cleanify xml', ()=> {

    var cleanifyXml

    before(()=>{
        let file = require('path').join(__dirname, '..', 'Web Resources', 'sdk.html')
        let content = require('fs').readFileSync(file).toString()
        let index = content.indexOf('cleanifyXml')
        let before = content.substring(0, index)
        let start = before.lastIndexOf('<script>')
        let trailing = content.substring(start+'<script>'.length)
        let endIndex = trailing.indexOf('</script>')
        let script = trailing.substring(0, endIndex)

        cleanifyXml = (new Function(`${script}; return cleanifyXml;`))()
    })

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
