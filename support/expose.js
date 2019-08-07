const fs = require('fs')

const expose = (name, path)=> {
    const sut = fs.readFileSync(path).toString()
    return (new Function(`${sut}; return ${name};`))()
}

module.exports = expose
