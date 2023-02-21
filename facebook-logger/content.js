var lastLog = "";

window.addEventListener("scroll", () => {
    const newLog = document.getElementById("facebook").innerText;

    var start = newLog.indexOf(lastLog);
    var end = start + lastLog.length;
    var currentLog = newLog.substring(0, start - 1) + newLog.substring(end);

    if(currentLog.length !== 0){
        console.log(currentLog);
    }
    if(newLog.length !== 0){
        lastLog = newLog;
    }
});
