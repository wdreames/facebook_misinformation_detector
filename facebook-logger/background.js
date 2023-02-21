
const facebook = 'https://www.facebook.com/'

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(facebook)) {

        console.log('Adding CSS');
        chrome.scripting.insertCSS({
            files: ['highlight.css'],
            target: { tabId: tab.id },
        });
    }
});