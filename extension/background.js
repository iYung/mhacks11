chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
    if (request && request.action === 'createTab') {	
      chrome.tabs.create({url: 'page/page.html'}, function (win) {	
        sendResponse(win);	
      });	
    }	
});