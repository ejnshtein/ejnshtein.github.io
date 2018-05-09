// Subs count from YT and Twitch

function getParameterByName(name, url) { // From stackoverflow https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}
let channelId = getParameterByName('channelId'), // Youtube channel id
    apiKey = getParameterByName('apiKey'), // YouTube api key
    channelIdtw = getParameterByName('channelIdtw'), // Twitch channel id
    apiKeytw = getParameterByName('apiKeytw') // Twitch api key
switch (true){ // Seems beautify then a lot of if(){}
    case !channelId:
        console.error('Youtube channel id is undefined!')
        break
    case !apiKey:
        console.error('Youtube apikey is undefined!')
        break
    case !channelIdtw:
        console.error('Twitch channel id is undefined')
        break
    case !apiKeytw:
        console.error('Twitch apikey is undefined!')
        break
}

function setData(type, content) {
    document.getElementById(type).innerHTML = content;
}
function subs() { // Full by me ( ͡° ͜ʖ ͡°)
    let xmlhttp = new XMLHttpRequest(),
        json = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    if (!channelId || !apiKey) return
    xmlhttp.onreadystatechange = function () {
        let myObj
        if (this.responseText) {
            try {
                myObj = JSON.parse(this.responseText)
            } catch (e){
                return console.error('Wrong response from YouTube!\nSometimes it\'s happend, don\'t panic ( ͡° ͜ʖ ͡°)')
            }
        }
        if (myObj != undefined && myObj.items != undefined) {
            setData('yt', myObj.items[0].statistics.subscriberCount)
        }
    }
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}

function subsTwitch() { // ᕦ( ͡° ͜ʖ ͡°)ᕤ
    let xmlhttp = new XMLHttpRequest(),
        json = `https://api.twitch.tv/kraken/channels/${channelIdtw}/follows?client_id=${apiKeytw}`
    if (!channelIdtw || !apiKeytw) return   
    xmlhttp.onreadystatechange = function () {
        let myObj
        if (this.responseText) {
            try {
                myObj = JSON.parse(this.responseText)
            } catch (e){
                return console.error('Wrong response from Twitch!\nSometimes it\'s happend, don\'t panic ( ͡° ͜ʖ ͡°)')
            }
        }
        if (myObj != undefined && myObj._total != undefined) {
            setData('twitch', myObj._total)
        }
    }
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}
subs()
subsTwitch()
setInterval(() => {
    subs()
    subsTwitch()
}, 10000)