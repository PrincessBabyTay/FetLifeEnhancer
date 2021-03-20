chrome.storage.onChanged.addListener(function(a,b){
    var changedItems = Object.keys(a);
    for(var item of changedItems){
        if(item === "FLESettings" && a[item].newValue !== a[item].oldValue){
            chrome.runtime.openOptionsPage();
            //chrome.tabs.create({url: chrome.runtime.getURL("/settings.html")});
        };
    };
});

chrome.commands.onCommand.addListener(function(command){
    if(command == "FLE-Reload"){
        chrome.tabs.query({currentWindow: true, active: true, url: "*://*.fetlife.com/*"}, function(tab){
            for(a of tab){
                if(a){
                    chrome.runtime.reload();
                    chrome.tabs.reload();
                };
            };
        });
    };
});


function onError(error){
	console.log(`Error: ${error}`);
};