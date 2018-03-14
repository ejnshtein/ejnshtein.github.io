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
console.log(getParameterByName('token'),getParameterByName('groupid'))
let channelId = getParameterByName('channelId'), // For Youtube
    apiKey = getParameterByName('apiKey'), // Also for YouTube
    channelIdtw = getParameterByName('channelIdtw'), // For Twitch
    apiKeytw = getParameterByName('apiKeytw'), // Also for Twitch
    token = getParameterByName('token'), // for VK
    groupId = getParameterByName('groupid') // Also for VK
function setData(type, content) {
    document.getElementById(type).innerHTML = content;
}
function subs() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        var myObj = {};
        if (this.responseText) {
            myObj = JSON.parse(this.responseText);
        }
        if (Object.keys(myObj).indexOf("items") !== -1) {
            setData('yt', myObj.items[0].statistics.subscriberCount)
        }
    }
    var json = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channelId + '&key=' + apiKey
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}

function subsT() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        var myObj = {};
        if (this.responseText) {
            myObj = JSON.parse(this.responseText);
        }
        if (Object.keys(myObj).indexOf("_total") !== -1) {
            setData('twitch', myObj._total)
        }
    }
    var json = 'https://api.twitch.tv/kraken/channels/' + channelIdtw + '/follows?client_id=' + apiKeytw
    xmlhttp.open("GET", json, true);
    xmlhttp.send();
}
function subsVk(){
    let xmlhttp = new XMLHttpRequest(),
        json = `https://api.vk.com/method/groups.getMembers?group_id=${groupId}&access_token=${token}&v=5.71&count=10`
    xmlhttp.onreadystatechange = () => {
        let myObj
        if (this.responseText){
            myObj = JSON.parse(this.responseText)
        }
        console.log(myObj)
        if (Object.keys(myObj).indexOf('response') !== -1){
            setData('vk', myObj.response.count)
        }
        console.log(this.responseText)
    }
    xmlhttp.open("GET", json, true);
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin','*')
    xmlhttp.send();
}
subsVk()
subs()
subsT()
setInterval(() => {
    subs()
    subsT()
}, 10000)