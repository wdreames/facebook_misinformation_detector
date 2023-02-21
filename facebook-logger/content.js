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
    /* 
     * Find the index of an "All reactions:". This is the end of a post
     * Find the last intance of " · " before the location marked as the end of the post. This is the beginning of the post
     * Take a substring of (start + 3, end). This is the text of the post
     * Store the post text
     * Remove the text from the current log
     * Continue this process until no "All reactions:" can be found in the current log
     */

    var numLoops = 0;
    while(currentLog.indexOf(endOfPostMarker) !== -1){
        var endOfPost = currentLog.indexOf(endOfPostMarker);
        var textUpToEndOfPost = currentLog.substring(0, endOfPost);
        var startOfPost = textUpToEndOfPost.lastIndexOf(startOfPostMarker);
        if(startOfPost === -1){
            startOfPost = 0;
        }

        var facebookPostText = textUpToEndOfPost.substring(startOfPost + startOfPostMarker.length);
        if(facebookPostText.length !== 0){
            console.log(facebookPostText);
        }

        currentLog = currentLog.replace(facebookPostText + endOfPostMarker, "");

        //This is for debugging purposes.
        numLoops += 1;
        if(numLoops >= 100){
            console.log(currentLog);
        }
    }

    if(newLog.length !== 0){
        var lastEndOfPost = newLog.lastIndexOf(endOfPostMarker);
        lastLog = newLog.substring(0, lastEndOfPost + endOfPostMarker.length);
    }
});
