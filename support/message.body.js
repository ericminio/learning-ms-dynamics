const bodyOf = (message)=>{
    let p = new Promise((resolve, reject)=>{
        var body = ''
        message.on('data', (chunk)=>{
            body += chunk
        })
        message.on('end', ()=>{
            resolve(body)
        })
    })
    return p
}

module.exports = {
    bodyOf: bodyOf
}
