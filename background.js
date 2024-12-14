// background.js

console.log('Background script loaded.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);

    if (request.action === 'runTests') {
        // Forward the request to the active tab's content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.log('No active tab found.');
                sendResponse({ success: false, message: 'No active tab found.' });
                return;
            }

            const activeTab = tabs[0];
            console.log('Sending message to tab:', activeTab.id);
            chrome.tabs.sendMessage(activeTab.id, { action: 'executeTests', tests: request.tests }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                    sendResponse({ success: false, message: chrome.runtime.lastError.message });
                } else {
                    console.log('Received response from content script:', response);
                    sendResponse(response);
                }
            });
        });
        // Keep the messaging channel open for sendResponse
        return true;
    }
});
