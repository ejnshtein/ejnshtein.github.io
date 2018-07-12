import '../css/index.scss'
import request from './modules/request'
import MNotification from './modules/notifications'

// Subs count from YT and Twitch

function urlParams(name, url) { // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    if (!url) url = window.location.href
    name = name.replace(/\[\]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}
let yt = {
        key: urlParams('ytk') || urlParams('youtubeApiKey'),
        channel: urlParams('ytc') || urlParams('youtubeChannelId')
    },
    tw = {
        key: urlParams('twk') || urlParams('twitchApiKey'),
        channel: urlParams('twc') || urlParams('twitchChannel'),
        allowSubs: !!urlParams('tws'),
        subs: []
    },
    types = function (type) {
        let t
        switch (type) {
            case 'yt':
                t = 'Youtube'
                break
            case 'tw':
                t = 'Twitch'
                break
            case 'vk':
                t = 'VK'
                break
        }
        return t
    }
if (urlParams('th')){
    document.querySelector('html').setAttribute('data-theme',urlParams('th'))
}
if (urlParams('dir')){
    let direction = {
        vertical: urlParams('dir').replace(/([a-z]+)\/[a-z]+/ig,'$1'),
        horizontal: urlParams('dir').replace(/[a-z]+\/([a-z]+)/ig,'$1')
    }
    document.querySelector('html').setAttribute(`data-${direction.vertical}`,'')
    document.querySelector('html').setAttribute(`data-${direction.horizontal}`,'')
} else {
    document.querySelector('html').setAttribute('data-top','')
    document.querySelector('html').setAttribute('data-left','')
}
//console.log(tw.allowSubs)
switch (true) {
    case !yt.channel:
        console.error('Youtube channel id is undefined!')
        break
    case !yt.key:
        console.error('Youtube apikey is undefined!')
        break
    case !tw.channel:
        console.error('Twitch channel id is undefined')
        break
    case !tw.key:
        console.error('Twitch apikey is undefined!')
        break
}

function setData(type, content) {
    if (document.querySelector(`#${type}`)) {
        document.querySelector(`#${type}`).innerHTML = content;
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

        document.querySelector('#social').appendChild(block)
    }
}
if (yt.channel && yt.key) {
    setData('yt', '00')
}
if (tw.channel && tw.key) {
    setData('tw', '00')
}
if (tw.key == 'example' && tw.channel == 'example') {
    setData('tw', randromText({
        onlyNumbers: true,
        length: 2
    }).toString())
}
if (yt.channel == 'example' && yt.key == 'example'){
    setData('yt', randromText({
        onlyNumbers: true,
        length: 2
    }).toString())
}


function subscriberYoutube() {
    if (!yt.channel || !yt.key) return
    if (tw.key == 'example' && tw.channel == 'example') {
        return setData('yt', randromText({
            length: 4,
            onlyNumbers: true
        }))
    }
    request({
            url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${yt.channel}&key=${yt.key}`
        })
        .then(res => {
            if (res != undefined && res.items != undefined) {
                setData('yt', res.items[0].statistics.subscriberCount)
            }
        })
        .catch(console.error)
}

function subscribersTwitch() {
    if (!tw.channel || !tw.key) return
    if (tw.key == 'example' && tw.channel == 'example') {
        return setData('tw', randromText({
            length: 4,
            onlyNumbers: true
        }))
    }
    request({
            url: `https://api.twitch.tv/helix/users?login=${tw.channel}`,
            header: [{
                name: 'Client-ID',
                value: tw.key
            }]
        })
        .then(res => {
            if (res != undefined) {
                request({
                        url: `https://api.twitch.tv/helix/users/follows?to_id=${res.data[0].id}`,
                        header: [{
                            name: 'Client-ID',
                            value: tw.key
                        }]
                    })
                    .then(subs => {
                        if (subs && subs.total) {
                            setData('tw', subs.total)
                        }
                        if (tw.allowSubs) {
                            if (!tw.subs.length) {
                                tw.subs = subs.data
                            } else {
                                if (tw.subs.length < subs.data.length) {
                                    request({
                                        url: `https://api.twitch.tv/helix/users?id=${subs.data[0].from_id}`,
                                        header: [{
                                            name: 'Client-ID',
                                            value: tw.key
                                        }]
                                    }).then(data => {
                                        let a = new MNotification({
                                            body: `New follower - ${data.data[0].display_name}`,
                                            time: 4000
                                        })
                                        a.display()
                                    })
                                }
                                tw.subs = subs.data
                            }
                        }
                    })
                    .catch(console.error)
            }
        })
        .catch(console.error)
}
subscriberYoutube()
subscribersTwitch()
setInterval(function () {
    subscriberYoutube()
    subscribersTwitch()
}, 10000)


/**
 * @param {Object} opt 
 * @param {Numbers} opt.length Returning value length
 * @param {boolean} opt.numbers Include numbers?
 * @param {boolean} [opt.onlyNumbers] Only Numbers?
 */
function randromText(opt) {
    let text = "",
        possible = opt.numbers ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" :
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (opt.onlyNumbers) {
        possible = '0123456789'
    }
    for (let i = 0; i < opt.length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}