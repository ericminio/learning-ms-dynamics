const { SdkPage } = require('../pages')

let deleteAccounts = async (options, driver)=> {
    let page = await SdkPage(driver)
    let data = await page.read({ collection:'accounts', xml:`
        <fetch mapping='logical' >
            <entity name='account'>
                <attribute name='name' />
                <attribute name='accountid' />
                <filter>
                    <condition attribute='name' operator='eq' value='${options.name}' />
                </filter>
            </entity>
        </fetch>`})

    for (var i=0; i<data.length; i++) {
        var accountid = data[i].accountid
        await page.delete({ collection:'accounts', id:accountid })
    }
}

module.exports = deleteAccounts
