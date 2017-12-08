chrome.alarms.onAlarm.addListener(function( alarm ) {
	console.log("Alarm Received");
	showNotification();
});


function showNotification(storedData) {
	// var items = JSON.parse(localStorage.getItem('items'));
	// if(items){
	// 	if(items.length > 0){
	// 		var id = new Date();
	// 		id = "" + id;
	// 		chrome.notifications.create(id, {
 //    	    	type: 'basic',
 //    	    	iconUrl: 'images/icon.png',
 //    	    	title: 'Don\'t forget!',
 //    	    	message: 'You have things to do. Wake up, dude!'
 //    		}, function(notificationId) {});
	// 	}
	// }
	var count;
	var classes = JSON.parse(localStorage.getItem("classes"));
	if(classes){
		var i;
		for(i = 0; i < classes.length; i++){
			var items = JSON.parse(localStorage.getItem(classes[i]));
			if(items){
				var j;
				for(j = 0; j < items.length; j++){
					//TO DO -> determine which items are due within a week (or less) and send notification
					var arr = items[j][1].split("-");
					date = new Date(arr[1] + "/" + arr[2] + "/" + arr[0]);

					var today = new Date();
					var timeDiff = Math.abs(today.getTime() - date.getTime());
         			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

         			if(diffDays <= 7 && items[j][2] == false){

         				var message = items[j][0] + ' in ' + diffDays + ' days!';

         				if(diffDays === 7){
         					message = items[j][0] + ' in one week!';
         				}

         				chrome.notifications.create(id, {
    	    				type: 'basic',
    	    				iconUrl: 'images/icon.png',
    	    				title: classes[i],
    	    				message: message
    					}, function(notificationId) {});	
         			}
				}
			}
		}
	}
}

//if notification is clicked, open the extension
chrome.notifications.onClicked.addListener(function() {
  chrome.tabs.create({'url': chrome.extension.getURL('productivity.html')});
});



//for timing
var blacklist = ['newtab', 'devtools', 'extensions'];
var time_units = "minutes"

var interval = null;
var updateTime = 5000;
var currentTabInfo = {};
var userActive = true;



var getURL = function(url) {
	var timingInfo = JSON.parse(localStorage.getItem("timing"));

	var index, found;
	var hostname = new URL(url).hostname;
	if ($.isEmptyObject(timingInfo)) {
       	currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
    	currentTabInfo.title = hostname;
       	currentTabInfo.time = 0;
  		var obj = {
          	'timing': [{
        	'id': currentTabInfo.id,
           	'title': currentTabInfo.title,
           	'time': currentTabInfo.time
        	}]
      	};
      	localStorage.setItem("timing", JSON.stringify(obj));
      	return;
   	}

   	$.each(timingInfo.timing, function(i, v) {
     	if (v.title === hostname) {
          	index = i;
           	found = true;
          	return false;
       	}
   	});

   	if (found) {
      	var retrieved = timingInfo.timing[index];
       	currentTabInfo.id = retrieved.id;
      	currentTabInfo.title = retrieved.title;
       	currentTabInfo.time = retrieved.time;
   	 } else {
       	currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
       	currentTabInfo.title = hostname;
       	currentTabInfo.time = 0;

       	timingInfo.timing.push({
          	'id': currentTabInfo.id,
           	'title': currentTabInfo.title,
           	'time': currentTabInfo.time
       	});
   	}

   	localStorage.setItem("timing", JSON.stringify(timingInfo));

};

var updateURL = function() {
    if (userActive) {
        console.log('User is active on ' + currentTabInfo.title);

        var timingInfo = JSON.parse(localStorage.getItem("timing"));
        var index;
        $.each(timingInfo.timing, function(i, v) {
        	if(v.title === currentTabInfo.title){
        		index = i;
        		return false;
        	}
        });
        timingInfo.timing[index].time = timingInfo.timing[index].time + 1;
        localStorage.setItem("timing", JSON.stringify(timingInfo));
    } else {
        console.log('User is not active on ' + currentTabInfo.title);
    }
};


var getCurrentTab = function() {
	var date = new Date();
	console.log("h" + date.getHours());
	if(date.getHours() == 0){
		localStorage.removeItem("timing");
		console.log('reset productivity data')
	}
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        var hostname = new URL(tabs[0].url).hostname;
        var found = false;
        for (var i = 0; i < blacklist.length; i++) {
            if (blacklist[i] === hostname) {
                found = true;
            }
        }
        if (!found) {
            console.log('URL not found on blacklist');
            currentTabInfo.blacklist = false;
            getURL(tabs[0].url);
            clearInterval(interval);
            interval = null;
            interval = setInterval(function() {
                updateURL();
            }, updateTime);
        } else {
            console.log('URL found on blacklist');
            currentTabInfo.blacklist = true;
            clearInterval(interval);
            interval = null;
        }
    });
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (sender.tab) {
        console.log('userActive\'s value is ' + message.userActive);
        userActive = message.userActive;
    } 
});

getCurrentTab();
chrome.tabs.onUpdated.addListener(getCurrentTab);
chrome.tabs.onActivated.addListener(getCurrentTab);