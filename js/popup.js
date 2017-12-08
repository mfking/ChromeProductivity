//to be implemented with history
//the idea being that you can see the detailed breakdown of your productivity if you
//go to the new tab (so the entire entension) but there is a summary no matter
//where you are if you just click on the icon in the tab bar!

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

  var sortedTimes = {'timing': []};
  var i;
  for(i = 0; i < timings.timing.length; ++i){
    var x = findMaxTime(timingCopy);
    sortedTimes.timing.push({
      'title': timingCopy.timing[x].title,
      'time': timingCopy.timing[x].time
    });
    timingCopy.timing.splice(x, 1);
  }

  var numDisplayed = 0;
  $.each(sortedTimes.timing, function(i, v) {
  	numDisplayed++;

  	if(numDisplayed <= 10){
	    var tr = document.createElement("tr");
	    var t1 = document.createElement("td");
	    var t2 = document.createElement("td");
	    var x = document.createTextNode(v.title)
	    var mins = v.time / 60;
	    var y = document.createTextNode(parseFloat(mins).toFixed(2));

	    t1.appendChild(x);
	    t2.appendChild(y);
	    tr.appendChild(t1);
	    tr.appendChild(t2);

	    //li.appendChild(t);
	    tr.className = "prodRow";
	    var table = document.getElementById("popupProd");
	    if(table){
	      table.appendChild(tr);
	      console.log('**');
	    }
    }


 
    });
}