// import { Mark } from './mark.js/dist/mark.es6';

var lastLog = "";
const startOfPostMarker = " · ";
const endOfPostMarker = "All reactions:";
const facebookId = "facebook"
const misinformationScores = new Map();
const previouslyFoundText = new Set();

const misinfoProcessorSeverURL = 'http://127.0.0.1/Fake_News_Detection/check_for_misinfo.php'

const defaultMisinformationValue = 1.0;


function getMisinformationScore(text){
    var xmlHttp = new XMLHttpRequest();
    var asynchronous = false;
    var formattedText = text.replace('\n', ' ').trim();
    var requestURL = misinfoProcessorSeverURL + "?text=" + formattedText;

    xmlHttp.open( "GET", requestURL, asynchronous );
    xmlHttp.send(null);

    var responsePlainText = xmlHttp.responseText.replace(/(<([^>]+)>)/ig,"");
    var misinformationScore = Number(responsePlainText);

    if (isNaN(misinformationScore)) {
        return defaultMisinformationValue;
    }
    return misinformationScore;
}

function markMisinformation(text, score){
    console.log(`${score}: ${text}`);
    var container = document.getElementById(facebookId);
    // var documentHTML = document.getElementById(facebookId).innerHTML;
    // var textIndex = documentHTML.indexOf(text);
    // if (textIndex >= 0) {
    //     documentHTML = (
    //         documentHTML.substring(0, textIndex) + 
    //         "<span class='highlight'>" + 
    //         documentHTML.substring(textIndex, textIndex + text.length) +
    //         " hello world :) " +
    //         "</span>" +
    //         documentHTML.substring(textIndex + text.length)
    //     );
    // }

    // This kinda works, but not really:
    textLines = text.split('\n');
    for(var i = 0; i<textLines.length; i++){
        var currentText = textLines[i].trim();
        currrentText = currentText.replace('… See more', '');
        if (previouslyFoundText.has(currentText) ){
            continue;
        }
        previouslyFoundText.add(currentText);

        if (currentText.length > 0) {
            console.log(`Highlighting "${textLines[i]}"`);
            InstantSearch.highlight(container, textLines[i]);
        }
    }
    
    // Highlighting misinformation with mark.js
    // var instance = new Mark(container);
    // instance.mark(facebookPostText);
}

window.addEventListener("scroll", () => {
    // Gather the text on the page
    var container = document.getElementById(facebookId);
    var newLog = container.innerText;

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
        if(facebookPostText.length !== 0 && facebookPostText !== '\n'){
            
            // Find the misinformation likelihood score
            var score = getMisinformationScore(facebookPostText);
            misinformationScores.set(facebookPostText, score);
            markMisinformation(facebookPostText, score);
        }

        currentLog = currentLog.replace(facebookPostText + endOfPostMarker, "");
    }

    if(newLog.length !== 0){
        var lastEndOfPost = newLog.lastIndexOf(endOfPostMarker);
        lastLog = newLog.substring(0, lastEndOfPost + endOfPostMarker.length);
    }
});

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