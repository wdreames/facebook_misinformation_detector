// const container = document.getElementById("facebook")
// // // console.log(container.textContent);

// console.log(container.innerText);


// window.addEventListener("load", () => {
//     console.log("Event Listener: load");
// });

// window.addEventListener("loadeddata", () => {
//     console.log("Event Listener: loadeddata");
// });

var lastLog = "";

window.addEventListener("scroll", () => {
    console.log("Event Listener: scroll");

    const newLog = document.getElementById("facebook").innerText;

    var start = newLog.indexOf(lastLog);
    var end = start + lastLog.length;

    var currentLog = newLog.substring(0, start - 1) + newLog.substring(end);

    console.log(currentLog);

    if(newLog.length !== 0){
        lastLog = newLog;
    }

});

// window.addEventListener("visibilitychange", () => {
//     console.log("Event Listener: visibilitychange");
// });