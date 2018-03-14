// Subs count from YT and Twitch

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
let channelId = getParameterByName('channelId'), // For Youtube
    apiKey = getParameterByName('apiKey'), // Also for YouTube
    channelIdtw = getParameterByName('channelIdtw'), // For Twitch
    apiKeytw = getParameterByName('apiKeytw') // Also for Twitch
function setData(type, content) {
    document.getElementById(type).innerHTML = content;
}
function subs() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        var myObj = {};
        if (this.responseText) {
            myObj = JSON.parse(this.responseText)
        }
        if (myObj.items !== undefined) {
            setData('yt', myObj.items[0].statistics.subscriberCount)
        }
    }
    var json = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}

function subsT() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        var myObj = {};
        if (this.responseText) {
            try {
                myObj = JSON.parse(this.responseText)
            } catch (e){
                return
            }
        }
        if (myObj._total !== undefined) {
            setData('twitch', myObj._total)
        }
    }
    var json = `https://api.twitch.tv/kraken/channels/${channelIdtw}/follows?client_id=${apiKeytw}`
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}
subs()
subsT()
setInterval(() => {
    subs()
    subsT()
}, 10000)