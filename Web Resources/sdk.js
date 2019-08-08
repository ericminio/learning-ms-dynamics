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
        return new Promise((resolve, reject)=> {
            var returnValue = { iserror: false, rows: [] };
            var target = `${window.location.origin}/api/data/v9.0/${options.entityNamePlural}?fetchXml=${encodeURIComponent(options.query)}`
            console.log('uri', target);
            console.log('fetching', options.entityNamePlural);
            var req = new XMLHttpRequest();
            req.open('GET', target, true)
            req.setRequestHeader("Prefer", 'odata.include-annotations="*"')
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    req.onreadystatechange = null
                    if (this.status === 200) {
                        var results = JSON.parse(this.response)
                        if (results.value !== undefined && results.value.length > 0) {
                            returnValue.rows = results.value;
                        }
                    } else {
                        returnValue.iserror = true
                        returnValue.error = this.statusText + ':' + JSON.parse(this.response).error.message;
                    }
                    console.log('returning', returnValue);
                    resolve(returnValue)
                }
            };
            req.send()
        })
    }

}).call(Sdk)
