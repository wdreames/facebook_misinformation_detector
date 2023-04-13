/*
 * William Reames
 * CNU Cybersecurity Capstone 2023
 * Facebook Misinformation Detector
 */

const misinfoProcessorSeverURL = 'https://william-reames.com/facebook-misinformation-detector/check-for-misinfo.php';
const misinfoProcessorParameterKey = 'text';

const misinformationThreshold = 0.5;
const defaultMisinformationValue = 1.0;

const startOfPostMarker = " · ";
const endOfPostMarker = "All reactions:";
const facebookId = "facebook"

var lastLog = "";
var previouslyFoundText = new Set();

window.addEventListener("scroll", gatherFacebookText);

function gatherFacebookText(){
    // Gather the text on the page
    var container = document.getElementById(facebookId);
    var newLog = container.innerText;

    // Remove text that was found previously
    var start = newLog.indexOf(lastLog);
    var end = start + lastLog.length;
    var currentLog = newLog.substring(0, start - 1) + newLog.substring(end);

    // Limit to only text from posts
    var numLoops = 0;
    while(currentLog.indexOf(endOfPostMarker) !== -1){

        // Get the text from a post
        var endOfPost = currentLog.indexOf(endOfPostMarker);
        var textUpToEndOfPost = currentLog.substring(0, endOfPost);
        var startOfPost = textUpToEndOfPost.lastIndexOf(startOfPostMarker);
        if(startOfPost === -1){
            startOfPost = 0;
        }
        var facebookPostText = textUpToEndOfPost.substring(startOfPost + startOfPostMarker.length);

        if(facebookPostText.length !== 0 && facebookPostText !== '\n'){
            checkForMisinformation(facebookPostText);
        }

        // Remove the post text from the current log
        currentLog = currentLog.replace(facebookPostText + endOfPostMarker, "");
    }

    if(newLog.length !== 0){
        var lastEndOfPost = newLog.lastIndexOf(endOfPostMarker);
        lastLog = newLog.substring(0, lastEndOfPost + endOfPostMarker.length);
    }
};

function checkForMisinformation(facebookPostText){
    var xmlHttp = new XMLHttpRequest();
    var cleanedText = facebookPostText.replace('\n', ' ').trim();
    var requestURL = misinfoProcessorSeverURL + "?" + misinfoProcessorParameterKey + "=" + cleanedText;

    xmlHttp.open("GET", requestURL, async=true);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            processMisinformationRequest(facebookPostText, xmlHttp.responseText);
        }
    }
    console.debug(`sending request for "${requestURL}"`)
    xmlHttp.send();
}

function processMisinformationRequest(facebookPostText, responseText) {

    // Removes HTML tags from the response
    var responsePlainText = responseText.replace(/(<([^>]+)>)/ig,"");

    var misinformationScore = Number(responsePlainText);
    if (isNaN(misinformationScore)) {
        return defaultMisinformationValue;
    }

    console.log(`${misinformationScore}: ${facebookPostText.substring(0, 35).replace('\n', '')}...`)
    if (misinformationScore < misinformationThreshold) {
        markMisinformation(facebookPostText);
    }    
}

function markMisinformation(facebookPostText){
    console.debug(`highlighting ${facebookPostText.substring(0, 35).replace('\n', '')}...`)

    var container = document.getElementById(facebookId);

    // TODO: Find a way to determine if the text contains a link
    textLines = facebookPostText.split('\n');
    for(var i = 0; i<textLines.length; i++){
        var currentText = textLines[i].trim();
        currentText = currentText.replace('… See more', '');
        if (previouslyFoundText.has(currentText) ){
            continue;
        }
        previouslyFoundText.add(currentText);

        if (currentText.length > 0) {
            InstantSearch.highlight(container, currentText);
        }
    }
}

/*
 * The following code was taken from https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
 */
var InstantSearch = {

    "highlight": function (container, highlightText)
    {
        var internalHighlighter = function (options)
        {

            var id = {
                container: "container",
                tokens: "tokens",
                all: "all",
                token: "token",
                className: "className",
                sensitiveSearch: "sensitiveSearch"
            },
            tokens = options[id.tokens],
            allClassName = options[id.all][id.className],
            allSensitiveSearch = options[id.all][id.sensitiveSearch];


            function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll)
            {
                var nodeVal = node.nodeValue, parentNode = node.parentNode,
                    i, j, curToken, myToken, myClassName, mySensitiveSearch,
                    finalClassName, finalSensitiveSearch,
                    foundIndex, begin, matched, end,
                    textNode, span, isFirst;

                for (i = 0, j = tokenArr.length; i < j; i++)
                {
                    curToken = tokenArr[i];
                    myToken = curToken[id.token];
                    myClassName = curToken[id.className];
                    mySensitiveSearch = curToken[id.sensitiveSearch];

                    finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);

                    finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);

                    isFirst = true;
                    while (true)
                    {
                        if (finalSensitiveSearch)
                            foundIndex = nodeVal.indexOf(myToken);
                        else
                            foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());

                        if (foundIndex < 0)
                        {
                            if (isFirst)
                                break;

                            if (nodeVal)
                            {
                                textNode = document.createTextNode(nodeVal);
                                parentNode.insertBefore(textNode, node);
                            } // End if (nodeVal)

                            parentNode.removeChild(node);
                            break;
                        } // End if (foundIndex < 0)

                        isFirst = false;


                        begin = nodeVal.substring(0, foundIndex);
                        matched = nodeVal.substr(foundIndex, myToken.length);

                        if (begin)
                        {
                            textNode = document.createTextNode(begin);
                            parentNode.insertBefore(textNode, node);
                        } // End if (begin)

                        span = document.createElement("span");
                        span.className += finalClassName;
                        span.appendChild(document.createTextNode(matched));
                        parentNode.insertBefore(span, node);

                        nodeVal = nodeVal.substring(foundIndex + myToken.length);
                    } // Whend

                } // Next i 
            }; // End Function checkAndReplace 

            function iterator(p)
            {
                if (p === null) return;

                var children = Array.prototype.slice.call(p.childNodes), i, cur;

                if (children.length)
                {
                    for (i = 0; i < children.length; i++)
                    {
                        cur = children[i];
                        if (cur.nodeType === 3)
                        {
                            checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
                        }
                        else if (cur.nodeType === 1)
                        {
                            iterator(cur);
                        }
                    }
                }
            }; // End Function iterator

            iterator(options[id.container]);
        } // End Function highlighter
        ;

        internalHighlighter(
            {
                container: container
                , all:
                    {
                        className: "highlighter"
                    }
                , tokens: [
                    {
                        token: highlightText
                        , className: "highlight"
                        , sensitiveSearch: false
                    }
                ]
            }
        ); // End Call internalHighlighter 

    } // End Function highlight

};
/*
 * End of code taken from https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
 */