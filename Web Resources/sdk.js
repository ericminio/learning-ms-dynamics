typeof Sdk === 'undefined' && (Sdk = { __namespace: !0 });

(function(){

    this.request = async (options)=> {
        return new Promise((resolve, reject)=> {
            var xhr = new window.XMLHttpRequest()
            xhr.open(options.method, encodeURI(options.uri), true)
            xhr.setRequestHeader("OData-MaxVersion", "4.0");
            xhr.setRequestHeader("OData-Version", "4.0");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.setRequestHeader("Prefer", "odata.maxpagesize=10");
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    xhr.onreadystatechange = null;
                    switch (this.status) {
                        case 200:
                        case 204:
                            resolve(this);
                            break;
                        default:
                            var error;
                            try {
                                error = JSON.parse(xhr.response).error;
                            } catch (e) {
                                error = 'Unexpected Error';
                            }
                            reject(error);
                            break;
                    }
                }
            };
            if (options.data) { xhr.send(JSON.stringify(options.data)) }
            else { xhr.send() }
        })
    }

    this.fetch = async (options)=> {
        return this.request({
            method: 'GET',
            uri: `${window.location.origin}/api/data/v9.0/${options.entityNamePlural}?fetchXml=${encodeURIComponent(options.query)}`
        })
    }

}).call(Sdk)
