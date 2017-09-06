function startClocks() {
    var todayDate = new Date(); 
    var Hours = todayDate.getHours();
    var Minutes = todayDate.getMinutes();
  //var Seconds = todayDate.getSeconds();
    var Day = todayDate.getDate();
    var Month = todayDate.getMonth();
    var Year = todayDate.getFullYear();
    var Hours = AddZero(Hours);
    var Minutes = AddZero(Minutes);
  //var Seconds = AddZero(Seconds);
    var Day = AddZero(Day);
    var Month = AddZero(Month);
    var Year = AddZero(Year);  
    document.getElementById('Time').innerHTML = Hours + ":" + Minutes /* + ':' + Seconds */ ;
    document.getElementById('Date').innerHTML = Year + "." + Month + "." + Day;
    var UpdateTime = setTimeout(startClocks, 1000);
}
function AddZero(Num) {
    if (Num < 10) {Num = "0" + Num} return Num;
}