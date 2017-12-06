chrome.alarms.onAlarm.addListener(function( alarm ) {
	console.log("Alarm Received");
	showNotification();
});


function showNotification(storedData) {
	var items = JSON.parse(localStorage.getItem('items'));
	if(items){
		if(items.length > 0){
			var id = new Date();
			id = "" + id;
			chrome.notifications.create(id, {
    	    	type: 'basic',
    	    	iconUrl: 'images/icon.png',
    	    	title: 'Don\'t forget!',
    	    	message: 'You have things to do. Wake up, dude!'
    		}, function(notificationId) {});
		}
	}
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