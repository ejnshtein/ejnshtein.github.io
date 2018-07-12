/**
 * @description Simple XMLHttpRequest
 * @param {object} data 
 * @param {string} data.url Path to request
 * @param {string} [data.type] Requset type ('GET','POST')
 * @param {Object[]} [data.header] Set headers to requset
 * @param {string} [data.header[].name] Header name
 * @param {string} [data.header[].value] Header value
 * @param {Object[]} [data.params] Params to add in the end of request(like: '?v=1')
 * @param {string} [data.params[].name] Param name
 * @param {string} [data.params[].value] param value
 * @param {Object} [data.body] POST body
 */
function request(data) {
    return new Promise((res, rej) => {
        let xmlhttp = new XMLHttpRequest(),
            once
        xmlhttp.onreadystatechange = function () {
            if (this.responseText) {
                let data = JSON.parse(this.responseText)
                if (data && !once){
                    once = true
                    return res(data)
                }

            }
        }
        xmlhttp.onerror = function () {
            return rej('loaderror')
        }
        xmlhttp.open(data.type || 'GET', data.url, true)
        if (!!data.header && data.header.length > 0) {
            data.header.forEach(function (header) {
                xmlhttp.setRequestHeader(header.name, header.value)
            })
        }
        if (!!data.params && data.params.length > 0) {
            let paramUrl = '?'
            data.params.forEach(function (param) {
                paramUrl += `${param.name}=${param.value}&`
            })
            data.url += paramUrl
        }
        if (data.body) {
            let body = new FormData()
            for (const key of data.body) {
                body.append(key, data.body[key])
            }
            xmlhttp.send(body)
        } else {
            xmlhttp.send()
        }
    })
}
export default request