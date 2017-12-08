
function findMaxTime(times){
  if($.isEmptyObject(times)){
    return -1;
  }
  var maxIndex = 0;
  $.each(times.timing, function(i, v){
    if(v.time > times.timing[maxIndex].time){
      maxIndex = i;
    }
  });
  return maxIndex;
}

//add items from local storage
var timings = JSON.parse(localStorage.getItem("timing"));
var link_by_time;
if(!timings){
  timings = [];
}
else{

  //sort the timings
  var timingCopy = {'timing': []};
  $.each(timings.timing, function(i, v){
    timingCopy.timing.push({
      'title': v.title,
      'time': v.time
    });
  });

  //don't add time zero items
  var sortedTimes = {'timing': []};
  var i;
  for(i = 0; i < timings.timing.length; ++i){
    var x = findMaxTime(timingCopy);
    if(timingCopy.timing[x].time > 0){
  		sortedTimes.timing.push({
      		'title': timingCopy.timing[x].title,
      		'time': timingCopy.timing[x].time
    	});
    }
    timingCopy.timing.splice(x, 1);
  }
}

var totalTime = 0;
$.each(sortedTimes.timing, function(i, v){
	totalTime += v.time;
});

var dataVals = [];
$.each(sortedTimes.timing, function(i, v){
	var percent = (v.time / totalTime) * 100;
	dataVals.push({
		'y': percent,
		'label': deleteWs(v.title)
	});
});

window.onload = function() {

	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		title: {
			text: "Website Productivity",
		},
		data: [{
			type: "pie",
			startAngle: 240,
			yValueFormatString: "##0.00'%'",
			indexLabelFontSize: 11,
			indexLabel: "{label}",
			dataPoints: dataVals
		}]
	});
	chart.render();
};

function deleteWs(url) {
	url = "" + url;
	if(url.indexOf("www.") != -1){
		url = url.substring(4);
	}
	console.log("testing.... " + url);
	console.log(url.indexOf("www."));
	var index = url.indexOf(".");
	if(index != -1){
		url = url.substring(0, index);
	}
	return url;
}

