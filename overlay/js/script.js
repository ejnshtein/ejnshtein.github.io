// Subs count from YT and Twitch

function urlParams(name, url) { // From stackoverflow https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}
let networks = {
        yt: {
            key: urlParams('youtubeApiKey'), // YouTube api key
            channel: urlParams('youtubeChannelId') // Youtube channel id
        },
        tw: {
            key: urlParams('twitchApiKey'), // Twitch api key
            channel: urlParams('twitchChannel') // Twitch channel id
        }
    },
    types = function (type) {
        switch (type) {
            case 'yt':
                return 'Youtube'
                break
            case 'tw':
                return 'Twitch'
                break
            case 'vk':
                return 'VK'
                break
        }
    }
switch (true) { // Seems beautify then a lot of if(){}
    case !networks.yt.channel:
        console.error('Youtube channel id is undefined!')
        break
    case !networks.yt.key:
        console.error('Youtube apikey is undefined!')
        break
    case !networks.tw.channel:
        console.error('Twitch channel id is undefined')
        break
    case !networks.tw.key:
        console.error('Twitch apikey is undefined!')
        break
}

function setData(type, content) {
    if (document.getElementById(type)) {
        document.getElementById(type).innerHTML = content;
    } else {
        let block = document.createElement('div'),
            blockName = document.createElement('a'),
            blockData = document.createElement('a')
        block.classList = 'main'
        blockName.classList = type
        blockName.style = 'text-transform:capitalize;'
        blockName.innerHTML = `${types(type)} `
        blockData.id = type
        blockData.innerHTML = content
        block.appendChild(blockName)
        block.appendChild(blockData)
        document.getElementById('social').appendChild(block)
    }
}

function subscriberYoutube() { // Full by me ( ͡° ͜ʖ ͡°)
    let json = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${networks.yt.channel}&key=${networks.yt.key}`
    if (!networks.yt.channel || !networks.yt.key) return
    request({
            url: json
        }).then(res => {
            if (res != undefined && res.items != undefined) {
                setData('yt', res.items[0].statistics.subscriberCount)
            }
        })
        .catch(err => console.error(err))
}

function subscribersTwitch() { // ᕦ( ͡° ͜ʖ ͡°)ᕤ
    if (!networks.tw.channel || !networks.tw.key) return
    request({
            url: `https://api.twitch.tv/helix/users?login=${networks.tw.channel}`,
            header: {
                name: 'Client-ID',
                value: networks.tw.key
            }
        })
        .then(res => {
            if (res != undefined) {
                request({
                    url: `https://api.twitch.tv/helix/users/follows?to_id=${res.data[0].id}`,
                    header: {
                        name: 'Client-ID',
                        value: networks.tw.key
                    }
                }).then(subs => {
                    if (subs && subs.total){
                        setData('tw', subs.total)
                    }
                })
                .catch(err => console.error(err))
            }
        })
        .catch(err => console.error(err))
}
subscriberYoutube()
subscribersTwitch()
setInterval(function () {
    subscriberYoutube()
    subscribersTwitch()
}, 10000)

function request(data) {
    return new Promise(function (res, rej) {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            let myObj
            if (this.responseText) {
                try {
                    myObj = JSON.parse(this.responseText)
                } catch (e) {
                    return rej('Error while parsing response')
                }
                res(myObj)
            }
        }
        xmlhttp.open('GET', data.url, true)
        if (data.header) {
            xmlhttp.setRequestHeader(data.header.name, data.header.value)
        }
        xmlhttp.send()
    })
}