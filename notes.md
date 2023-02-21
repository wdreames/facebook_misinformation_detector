# Facebook Chrome Extension Notes
William Reames

## 02/20/2023

Execute the following command in the terminal to include chrome typing in VS Code:
`npm i chrome-types`

The following javascript code can successfully pull text from Facebook as a user is scrolling through the page:


```javascript
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
```

Furthermore, I was able to isolate the text from posts by finding "All reactions:" to mark the end of the post, and " · " to mark the beginning of a post. This was the updated code:

```javascript
var lastLog = "";
const startOfPostMarker = " · ";
const endOfPostMarker = "All reactions:";

window.addEventListener("scroll", () => {
    // Gather the text on the page
    const newLog = document.getElementById("facebook").innerText;

    // Remove text found previously
    var start = newLog.indexOf(lastLog);
    var end = start + lastLog.length;
    var currentLog = newLog.substring(0, start - 1) + newLog.substring(end);

    // Limit to only text from posts
    while(currentLog.indexOf(endOfPostMarker) !== -1){
        var endOfPost = currentLog.indexOf(endOfPostMarker);
        var textUpToEndOfPost = currentLog.substring(0, endOfPost);
        var startOfPost = textUpToEndOfPost.lastIndexOf(startOfPostMarker);

        var facebookPostText = textUpToEndOfPost.substring(startOfPost + startOfPostMarker.length);
        if(facebookPostText.length !== 0){
            console.log(facebookPostText);
        }

        currentLog = currentLog.replace(startOfPostMarker + facebookPostText + endOfPostMarker, "");
    }

    if(newLog.length !== 0){
        var lastEndOfPost = newLog.lastIndexOf(endOfPostMarker);
        lastLog = newLog.substring(0, lastEndOfPost + endOfPostMarker.length);
    }
});
```

From here, I will need to store the text, along with a relationship to its misinformation likelihood score. At the current moment in time, all misinformation scores will be randomized as either 0 or 1. This will also allow me to work on updating the webpage to highlight posts containing misinformation.

