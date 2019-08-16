const fs = require('fs')

const expose = (options)=> {
    let file = options.inFile
    let content = require('fs').readFileSync(file).toString()
    let index = content.indexOf(options.inScriptTagContaining)
    let before = content.substring(0, index)
    let start = before.lastIndexOf('<script>')
    let trailing = content.substring(start+'<script>'.length)
    let endIndex = trailing.indexOf('</script>')
    let script = trailing.substring(0, endIndex)

    return (new Function(`${script}; return ${options.method};`))()
}

module.exports = expose
