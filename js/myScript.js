/******************************* Main Page Script *******************************/

//set the background image
var num = Math.floor(Math.random() * 6);
var url = "url('images/" + num + ".jpg')";
document.body.style.backgroundImage = url;

var header = document.getElementById("header");
var date = new Date();
if(date.getHours() < 12){
  header.innerText = "Good Morning";
} else if(date.getHours() < 17){
  header.innerText = "Good Afternoon";
} else {
  header.innerText = "Good Evening";
}

setTime();

//add clock to the page
function setTime(){
  var date = new Date();
  var hours = date.getHours();
  var mins = date.getMinutes();
  var period = "AM";
  mins = checkTime(mins);
  if(hours >= 12){
    period = "PM";
    if(hours != 12){
      hours -= 12;
    }
  }
  if(hours == 0){
    hours = 12;
  }
  document.getElementById("time").innerText = hours + ":" + mins;
  document.getElementById("am").innerText = period;
  var t = setTimeout(setTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

//for later usage (determining if the page has already been visited today)
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear()
var dateString = "" + day + month + year;


/******************************* To Do List Script *******************************/
var element = document.querySelector('.addBtn');
if(element){
    element.addEventListener("click", function(e) {
      newElement();
      }, false);
} 

var element = document.querySelector('.toDo');
if(element){
    element.addEventListener("click", function(e) {
      showToDoList();
      }, false);
}   
                               

//add items from local storage
var items = JSON.parse(localStorage.getItem("items"));
if(!items){
  items = [];
}

var checks = JSON.parse(localStorage.getItem("checks"));
if(!checks){
  checks = [];
}

var i;
for(i = 0; i < items.length; i++){
  var li = document.createElement("li");
  var itemValue = items[i];
  var t = document.createTextNode(itemValue);
  li.appendChild(t);
  li.className = "toDoItem"
  var ul = document.getElementById("myUL");
  if(ul){
    ul.appendChild(li);
  }

  if(checks.indexOf(itemValue) > -1){
      li.classList.toggle('checked');
  }
}

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByClassName("toDoItem");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {

    //remove the element from the display
    var div = this.parentElement;
    div.style.display = "none";
  
    //remove the element from the items list (storage)
    var string = this.parentElement.innerText;
    var index = items.indexOf(string.substring(0, string.length-1));
    if(index > -1){
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));

    index = checks.indexOf(string.substring(0, string.length-1));
    if(index > -1){
      checks.splice(index, 1);
    }
    localStorage.setItem("checks", JSON.stringify(checks));
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
if(list){
  list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');

      var str = ev.target.innerText;
      if(ev.target.className == 'toDoItem checked'){
        checks.push(str.substring(0, str.length - 1));
      } else {
        var index = checks.indexOf(str.substring(0, str.length-1));
        if(index > -1){
          checks.splice(index, 1);
        }
      }
      localStorage.setItem("checks", JSON.stringify(checks));
    }
  }, false);
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  li.className = "toDoItem";
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
   
  items.push(inputValue);
  localStorage.setItem("items", JSON.stringify(items));

  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
    //remove the element from the display
    var div = this.parentElement;
    div.style.display = "none";
  
    //remove the element from the items list (storage)
    var string = this.parentElement.innerText;
    var index = items.indexOf(string.substring(0, string.length-1));
    if(index > -1){
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));

    index = checks.indexOf(string.substring(0, string.length-1));
    if(index > -1){
      checks.splice(index, 1);
    }
    localStorage.setItem("checks", JSON.stringify(checks));
    }
  }
}

function showToDoList() {
    var list = document.getElementById("toDoList");
    var button = document.getElementById("toDo");
    $(list).slideToggle();
    if(button.innerText === "To Do List"){
      button.innerText = "Close";
    } else {
      button.innerText = "To Do List";
    }
}

/******************************* Weather Script *******************************/

var autocomplete;
var countryRestrict = {'country': 'us'};
var lat;
var long;
var weatherLocation = JSON.parse(localStorage.getItem("weatherLocation"));
if(!weatherLocation){
  weatherLocation = [];
} else {
  document.getElementById('locationTag').innerText = weatherLocation[0];
  lat = weatherLocation[1];
  long = weatherLocation[2];
}


// Create the autocomplete object and associate it with the UI input control.
// Restrict the search to the default country, and to place type "cities".
autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')), {
    types: ['(cities)'],
    componentRestrictions: countryRestrict
  });

autocomplete.addListener('place_changed', onPlaceChanged);

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    var index = place.formatted_address.indexOf(",");
    document.getElementById('locationTag').innerText = place.formatted_address.substring(0, index+4);
    $('#locationTag').toggle(100, "linear");
    $('#autocomplete').toggle(100, "linear");

    lat = place.geometry.location.lat();
    long = place.geometry.location.lng();

    weatherLocation = [document.getElementById('locationTag').innerText, lat, long];
    localStorage.setItem("weatherLocation", JSON.stringify(weatherLocation));

    if(document.getElementById("forcastDivs").style.display === "none"){
      document.getElementById("forcastDivs").style.display = "block";
    }
    //call weather function
    getWeather();
  } 
  document.getElementById('autocomplete').value = '';
}


//weather button click event
var element = document.querySelector('.weatherButton');
if(element){
    element.addEventListener("click", function(e) {
      showWeather();
      }, false);
}  


//search button
var element = document.querySelector('.searchBtn');
if(element){
  element.addEventListener("click", function(e) {
    locationSearch();
    }, false);
  }

function locationSearch(){
  var input = document.getElementById("autocomplete")
  $(input).toggle(100, "linear");
  $('.locationTag').toggle(100, "linear");
}

//determine the days to display (if not done so already)
var tomorrow = document.getElementById("day2Label");
var twoDays = document.getElementById("day3Label");

switch(date.getDay()){
  case 0:
    tomorrow.innerText = "Monday";
    twoDays.innerText = "Tuesday";
    break;
  case 1:
    tomorrow.innerText = "Tuesday";
    twoDays.innerText = "Wednesday";
    break;  
  case 2:
    tomorrow.innerText = "Wednesday"; 
    twoDays.innerText = "Thursday";
    break;
  case 3:
    tomorrow.innerText = "Thursday";
    twoDays.innerText = "Friday";
    break;
  case 4:
    tomorrow.innerText = "Friday";
    twoDays.innerText = "Saturday";
    break;
  case 5:
    tomorrow.innerText = "Saturday";
    twoDays.innerText = "Sunday";
    break;
  case 6:
    tomorrow.innerText = "Sunday";
    twoDays.innerText = "Monday";
    break;
}

var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var dateString = "" + day + month + year;
localStorage.setItem("date", dateString);


function showWeather(){
  var weather = document.getElementById("weather");
  var button = document.getElementById("weatherButton");
  $(weather).slideToggle();
  if(button.innerText == "Weather"){
      button.innerText = "Close";
  } else {
      weatherButton.innerText = "Weather";
  }
  if(weatherLocation.length == 0){
    document.getElementById("forcastDivs").style.display = "none";
    locationSearch();
  }
} 

$(function(){
    if(weatherLocation.length > 0){
      getWeather();
    }
});

//function to call yahoo API to get and display weather information (should probably only call this a few times a day not
//every time a tab opens --> will look into this)
function getWeather(){
  // Specify the ZIP/location code and units (f or c)
  var loc = '05401';
  var u = 'f';

  var query = "SELECT item.forecast FROM weather.forecast WHERE woeid in (select woeid from geo.places(1) where text='(" + lat + ", " + long + ")') AND u='" + u + "'";
  var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
  var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster;

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: url,
    cache: true,
    success: function(result){
      //gets the forcast --> channel[1] is tomorrow channel[2] is two days (up to 9)
      var today = result.query.results.channel[0].item.forecast;
      var tomorrow = result.query.results.channel[1].item.forecast;
      var twoDays = result.query.results.channel[2].item.forecast;

      //set high temp
      document.getElementById("day1high").innerText = today.high + "\xB0";
      document.getElementById("day2high").innerText = tomorrow.high + "\xB0";
      document.getElementById("day3high").innerText = twoDays.high + "\xB0";

      //set low temp
      document.getElementById("day1low").innerText = today.low + "\xB0";
      document.getElementById("day2low").innerText = tomorrow.low + "\xB0";
      document.getElementById("day3low").innerText = twoDays.low + "\xB0";

      //set image
      document.getElementById('day1icon').src = "images/" + getWeatherImage(today.code);
      document.getElementById('day2icon').src = "images/" + getWeatherImage(tomorrow.code);
      document.getElementById('day3icon').src = "images/" + getWeatherImage(twoDays.code);
      //TO DO: IMPLEMENT GETTING/ DISPLAYING ALL DESIRED WEATHER INFO

    }
  });
}

function getWeatherImage(code){
  console.log(code);
  var img = "";
  switch(parseInt(code)){
    case 0: case 1: case 2:
      img = "rainStorm.png";
      break;
    case 3: case 4: case 37: case 38: case 39: case 45: case 47:
      img = "thunderstorm.png";
      break;
    case 5: case 6: case 7: case 35:
      img = "winteryMix.png";
      break;
    case 8: case 9: case 10: case 11: case 12: case 40:
      img = "rain.png";
      break;
    case 13: case 14: case 15: case 16: case 17: case 18: case 41: case 42: case 43: case 46:
      img = "snow.png";
      break;
    case 19: case 20: case 21: case 22:
      img = "fog.png";
      break;
    case 23: case 24:
      img = "windy.png";
      break;
    case 25: case 26:
      img = "cloudy.png";
      break;
    case 27: case 29:
      img = "partltCloudy.png";
      break;
    case 28: case 30: case 44: case 3200:
      img = "partlySunny.png";
      break;
    case 31: case 33:
      img = "clear.png";
      break;
    case 32: case 34: case 36:
      img = "sunny.png";
      break;
  }
  console.log(img);
  return img;
}

/******************************* Classes Script *******************************/
$('.simple_color').simpleColor();

//TO DO
/* Create a menu "schedule" that displays a daily schedule and lists of all classes. Can Add meeting times 
and then this adds it to classes list */

var numMeeting = 0;

//get list of classes (just the names, each course has a corresponding array of to-do list items)
var classList = JSON.parse(localStorage.getItem("classes"));
if(!classList){
  classList = [];
}

//add classes
var i;
for(i = 0; i < classList.length; i++){
//create the class
var div = document.createElement("div");

  //create the header
  var inputValue = classList[i];
  var className = document.createElement("p");
  className.innerText = inputValue;
  className.className = "courseTitle";
  div.appendChild(className);
  div.className = "course";
  div.id = inputValue;

  //add class color
  className.style.background = localStorage.getItem(inputValue + "Color");

  //add delete button for course
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "deleteCourse";
  span.appendChild(txt);
  div.appendChild(span);

  //create the list
  var list = document.createElement("ul");
  list.className = "courseToDoList";
  list.id = inputValue + "ToDoList";
  div.appendChild(list);

  //append the items
  var currItems = JSON.parse(localStorage.getItem(classList[i]));
  if(currItems){
    var j;
    for(j = 0; j < currItems.length; j++){
      //create the list element and determinet the course
      var li = document.createElement("li");
      var course = classList[i];

      //create date 
      var dateIn = currItems[j][1];
      var dateSpan = document.createElement("div");

      var dateTxt = document.createTextNode(createDateTxt(dateIn));
      dateSpan.className = "dateSpan";
      dateSpan.appendChild(dateTxt);
      li.appendChild(dateSpan);

      //create item title
      var inputValue = currItems[j][0];
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      li.className = "courseToDo";
      if (inputValue != '') {
        var id = course + "ToDoList";
        list.appendChild(li);
      }

      if(currItems[j][2] === true){
        li.classList.toggle('checked');
      }

      li.onclick = function(){
        this.classList.toggle('checked');
        var currItems = JSON.parse(localStorage.getItem(this.parentElement.id.substring(0, this.parentElement.id.length-8)));
        var index = 0;
        var i;
        for(i = 0; i < currItems.length; i++){
          var txt = createDateTxt(currItems[i][1]) + currItems[i][0];
          if(txt === this.innerText.substring(0, div.innerText.length-1)){
            index = i;
            break;
          }
        }
        if(this.className === 'courseToDo checked'){
          currItems[index][2] = true;
        } else {
          currItems[index][2] = false;
        }
        localStorage.setItem(course, JSON.stringify(currItems));
      }
    }

    sortList(list);
 
  }

  //create the input for new class
  var createNew = document.createElement("div");
  var input = document.createElement("input");
  input.type = "text";
  input.className = "courseInput";
  input.id = classList[i] + "Input";
  input.placeholder = "homework, exam, quiz..."
  var date = document.createElement("input");
  date.type = "date";
  date.className = "inputDate";
  date.id = classList[i] + "Date";
  var btn = document.createElement("a");
  btn.innerText = "add";
  btn.className = "courseBtn";
  btn.id = classList[i] + "Btn";
  createNew.appendChild(input);
  createNew.appendChild(date);
  createNew.appendChild(btn);
  createNew.style.height = "34px";
  div.appendChild(createNew);

  //add the class
  document.getElementById("classes").appendChild(div);

}

//class List click event
var element = document.querySelector('.classButton');
if(element){
    element.addEventListener("click", function(e) {
      showClasses();
      }, false);
}

//show add class click event
var element = document.querySelector('.addButton');
if(element){
    element.addEventListener("click", function(e) {
      showAddClass();
      }, false);
}

//add class click event
var element = document.querySelector('.addClassBtn');
if(element){
  element.addEventListener("click", function(e) {
    addClass();   
  }, false);
}

//add meeting time click event
var element = document.querySelector('.addTime');
if(element){
  element.addEventListener("click", function(e) {
    addMeetingTime();
  }, false);
}

//make sure input is not letters
$('#startTimeHour').focusout(function() {
    if(!isNaN(this.value)){
      var time = parseInt(this.value);
      if(time > 12){
        this.value = "12";
      } else if(time < 1){
        this.value = "1";
      }
    } else {
      this.value = '';
    }
});

$('#endTimeHour').focusout(function() {
    if(!isNaN(this.value)){
      var time = parseInt(this.value);
      if(time > 12){
        this.value = "12";
      } else if(time < 1){
        this.value = "1";
      }
    } else {
      this.value = '';
    }
});

$('#startTimeMin').focusout(function() {
    if(!isNaN(this.value)){
      var time = parseInt(this.value);
      if(time > 59){
        this.value = "59";
      } else if(time < 0){
        this.value = "00";
      } else if(time < 10){
        this.value = "0" + time;
      }
    } else {
      this.value = '';
    }
});

$('#endTimeMin').focusout(function() {
    if(!isNaN(this.value)){
      var time = parseInt(this.value);
      if(time > 59){
        this.value = "59";
      } else if(time < 0){
        this.value = "00";
      } else if(time < 10){
        this.value = "0" + time;
      }
    } else {
      this.value = '';
    }
});

//delete class event
var deleteCourse = document.getElementsByClassName("deleteCourse");
var i;
for(i = 0; i < deleteCourse.length; i++){
  deleteCourse[i].onclick = function() {
    //remove course from display
    var div = this.parentElement;
    div.style.display = "none";

    //get course name
    var course = div.id;

    //remove course and items from local storage
    var index = classList.indexOf(course);
    if(index > -1){
      classList.splice(index, 1);
    }
    localStorage.setItem("classes", JSON.stringify(classList));
    localStorage.removeItem(course);
  }
}

//delete item event
// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByClassName("courseToDo");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "closeCourseToDo";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var courseClose = document.getElementsByClassName("closeCourseToDo");
var i;
for (i = 0; i < courseClose.length; i++) {
  courseClose[i].onclick = function() {

    //remove the element from the display
    var div = this.parentElement;
    div.style.display = "none";

    //remove the element from the items list (storage)
    //get the course name
    var course = div.parentElement.id;
    course = course.substring(0, course.length-8);
   
    var courseItems = JSON.parse(localStorage.getItem(course));
    var j;
    for(j = 0; j < courseItems.length; j++){
      var txt = createDateTxt(courseItems[j][1]) + courseItems[j][0];
      if(txt === div.innerText.substring(0, div.innerText.length-1)){
        courseItems.splice(j, 1);
        localStorage.setItem(course, JSON.stringify(courseItems));
        break;
      }
    }
  }
}


//add item event
var courseAdds = document.getElementsByClassName("courseBtn");
var i;
for (i = 0; i < courseAdds.length; i++) {
  courseAdds[i].onclick = function() {
    addClassItem(this);
  }
}



//function to show classes
function showClasses(){
  var classes = document.getElementById("classWrapper");
  var button = document.getElementById("classButton");
  $(classes).slideToggle();
  if(button.innerText === "Classes"){
      button.innerText = "Close";
  } else {
      button.innerText = "Classes";
  }
  if(classList.length == 0){
    document.getElementById("newClassWrapper").style.display = "block";
    document.getElementById("addButton").innerText = "\u00D7";
  }

} 

//function to show add class
function showAddClass(){
  var input = document.getElementById("newClassWrapper");
  //var info = document.getElementById("newInfo");
  var button = document.getElementById("addButton");
  $(input).toggle(200, "linear");
  //$(info).slideToggle(100, "linear");
  if(button.innerText === "+"){
    button.innerText = "\u00D7";
  } else {
    button.innerText = "+";
    clearClassInput();
    if(numMeeting > 0){
      removeMeetingTimes();
    }
  }
}

function removeMeetingTimes(){
  var i;
  for(i = 1; i <= numMeeting; i++){
    var node = '#newInfo' + i;
    $(node).remove();
  }
  numMeeting = 0;

  var hr = document.getElementsByTagName('hr');
  for(i = 0; i < hr.length; ){
    hr[i].parentNode.removeChild(hr[i]);
  }
}

function clearClassInput(){
  document.getElementById('classInput').value = '';
  var boxes = document.getElementById("newInfo").getElementsByClassName('checkbox');
  var times = document.getElementById("newInfo").getElementsByClassName('classTimeIn');
  var ampm = document.getElementById("newInfo").getElementsByClassName('AMPM');
  var i;
  for(i = 0; i < boxes.length; i++){
    boxes[i].checked = false;
  }
  for(i = 0; i < times.length; i++){
    times[i].value = '';
  }
  for(i = 0; i < ampm.length; i++){
    ampm[i].value = "AM";
  }
}

function addClass() {

  //make sure there is input
  var boxes = document.getElementById("newInfo").getElementsByClassName("checkbox");
  var boxGood = false;
  var i;
  for(i = 0; i < boxes.length; i++){
    if(boxes[i].checked){
      boxGood = true;
      break;
    }
  }
  var times = document.getElementById("newInfo").getElementsByClassName("classTimeIn");
  var timeGood = true;
  for(i = 0; i < times.length; i++){
    if(times[i].value == ''){
      timeGood = false;
      break;
    }
  }
  //get the class name input
  var inputValue = document.getElementById("classInput").value;

  if(inputValue != '' && boxGood && timeGood){
    //create the class object
    var div = document.createElement("div");

    //create the header
    var className = document.createElement("p");
    className.innerText = inputValue;
    className.className = "courseTitle";
    div.appendChild(className);
    div.className = "course";
    div.id = inputValue;


    className.style.background = document.getElementsByClassName('simpleColorDisplay')[0].style.backgroundColor;
    var color = className.style.background;
    color = color.replace(')', ', 0.8)').replace('rgb', 'rgba');
    className.style.background = color;

    localStorage.setItem(inputValue + "Color", color);
    
    //create the delete button
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "deleteCourse";
    span.appendChild(txt);
    div.appendChild(span);

    //add delete functionality
    span.onclick = function() {
      //remove course from display
      var div = this.parentElement;
      div.style.display = "none";
    
      //get course name
      var course = div.id;
    
      //remove course and items from local storage
      var index = classList.indexOf(course);
      if(index > -1){
        classList.splice(index, 1);
      }
      localStorage.setItem("classes", JSON.stringify(classList));
      localStorage.removeItem(course);
    }


    //create the list
    var list = document.createElement("ul");
    list.className = "courseToDoList";
    list.id = inputValue + "ToDoList";
    div.appendChild(list);

    //create the input for new class
    var createNew = document.createElement("div");
    var input = document.createElement("input");
    input.type = "text";
    input.className = "courseInput";
    input.id = inputValue + "Input";
    input.placeholder = "homework, exam, quiz..."
    var date = document.createElement("input");
    date.type = "date";
    date.className = "inputDate";
    date.id = inputValue + "Date";
    var btn = document.createElement("a");
    btn.innerText = "add";
    btn.className = "courseBtn";
    btn.id = inputValue + "Btn";
    createNew.appendChild(input);
    createNew.appendChild(date);
    createNew.appendChild(btn);
    createNew.style.height = "34px";
    div.appendChild(createNew);

    //add the class
    document.getElementById("classes").appendChild(div);

    //add the class to local storage
    classList.push(inputValue);
    localStorage.setItem("classes", JSON.stringify(classList));

    for (i = 0; i < courseAdds.length; i++) {
      courseAdds[i].onclick = function() {
        addClassItem(this);
      }
    }

    //add the meeting times
    var meetingTimes = [];
    for(i = 0; i <= numMeeting; i++){
      var id = 'newInfo';
      if(i > 0){
        id = id + i;
      }
      var boxes = document.getElementById(id).getElementsByClassName("checkbox");
      var times = document.getElementById(id).getElementsByClassName("classTimeIn");
      var start = times[0].value + ":" + times[1].value + document.getElementById(id).getElementsByClassName("AMPM")[0].value;
      var end = times[2].value + ":" + times[3].value + document.getElementById(id).getElementsByClassName("AMPM")[1].value;
      var i = 0;
      for(i = 0; i < boxes.length; i++){
        if(boxes[i].checked){
          meetingTimes.push([boxes[i].value, start, end]);
        }
      }
    }

    //add meeting times to local storage
    localStorage.setItem(inputValue + "Time", JSON.stringify(meetingTimes));

    //reset the button and input
    clearClassInput();
    removeMeetingTimes();
    $("#newClassWrapper").toggle(100, "linear");
    document.getElementById("addButton").innerText = "+";
    document.getElementById("addButton").style.padding = "4px 8px";

  }
}

//Adds new meeting time 
function addMeetingTime(){
  //add horizontal line to separate meeting times
  var br = document.createElement('hr');
  document.getElementById('newClassWrapper').insertBefore(br, $('.colorLabel')[0]);

  //create the new meeting time node
  numMeeting++;
  var newId = 'newInfo' + numMeeting;
  var newNode = $('#newInfo').clone().attr('id', newId)[0];
  newNode.childNodes[1].style.marginTop = "0px";
  var boxes = newNode.getElementsByClassName("checkbox");
  var times = newNode.getElementsByClassName("classTimeIn");
  var i;
  for(i = 0; i < boxes.length; i++){
    boxes[i].checked = false;
  }
  for(i = 0; i < times.length; i++){
    times[i].value = '';
  }

  document.getElementById('newClassWrapper').insertBefore(newNode, $('.colorLabel')[0]);
}


function addClassItem(e) {
  
  //create the list element and determinet the course
  var li = document.createElement("li");
  var course = e.id.substring(0, e.id.length-3);
  //create date 
  var dateIn = document.getElementById(course + "Date").value;
  var dateSpan = document.createElement("div");
  var dateTxt = document.createTextNode(createDateTxt(dateIn));
  dateSpan.className = "dateSpan";
  dateSpan.appendChild(dateTxt);
  li.appendChild(dateSpan);
  document.getElementById(course + "Date").value = document.getElementById(course + "Date").defaultValue;
  //create item title
  var inputID = course + "Input";
  var inputValue = document.getElementById(inputID).value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  li.className = "courseToDo";
  if (inputValue != '' && dateIn != '') {
    var id = course + "ToDoList";
    document.getElementById(id).appendChild(li);
  }

  document.getElementById(inputID).value = "";
  //add the info to local storage
  var classItems = JSON.parse(localStorage.getItem(course));
  if(!classItems){
    classItems = [];
  }
  classItems.push([inputValue, dateIn, false]);

  localStorage.setItem(course, JSON.stringify(classItems));

  //sort the list
  sortList(document.getElementById(course+"ToDoList"));

  //add checked capability
  li.onclick = function(){
    this.classList.toggle('checked');
    var currItems = JSON.parse(localStorage.getItem(this.parentElement.id.substring(0, this.parentElement.id.length-8)));
    var index = -1;
    var i;
    for(i = 0; i < currItems.length; i++){
      var txt = createDateTxt(currItems[i][1]) + currItems[i][0];
      if(txt === this.innerText.substring(0, div.innerText.length-1)){
        index = i;
        break;
      }
    }
    if(index != -1){
      if(this.className === 'courseToDo checked'){
        currItems[index][2] = true;
      } else {
        currItems[index][2] = false;
      }
      localStorage.setItem(course, JSON.stringify(currItems));
    }
  }

  //create close button
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "closeCourseToDo";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < courseClose.length; i++) {
    courseClose[i].onclick = function() {
      //remove the element from the display
      var div = this.parentElement;
      div.style.display = "none";
  
      //remove the element from the items list (storage)
      //get the course name
      var course = div.parentElement.id;
      course = course.substring(0, course.length-8);
    
  
      var courseItems = JSON.parse(localStorage.getItem(course));
      var j;
      for(j = 0; j < courseItems.length; j++){
        var txt = createDateTxt(courseItems[j][1]) + courseItems[j][0];
        if(txt === div.innerText.substring(0, div.innerText.length-1)){
          courseItems.splice(j, 1);
          localStorage.setItem(course, JSON.stringify(courseItems));
          break;
        }
      }   
    }
  }
}

function createDateTxt(dateIn) {
  var mon = dateIn.substring(5, 7);
  var day = dateIn.substring(8, dateIn.length);
  if(day.substring(0,1) === '0'){
    day = day.substring(1, day.length);
  } else if(mon.substring(0,1) === '0'){
    mon = mon.substring(1, mon.length);
  }

  return mon + "/" + day;
}

function sortList(list) {
  var i, switching, b, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;

      var date1 = b[i].getElementsByClassName("dateSpan")[0].innerText;
      var index = date1.indexOf("/");
      date1 = [date1.substring(0, index), date1.substring(index + 1)];

      var date2 = b[i+1].getElementsByClassName("dateSpan")[0].innerText;
      index = date2.indexOf("/");
      date2 = [date2.substring(0, index), date2.substring(index + 1)];

      /* Check if the next item should
      switch place with the current item: */
      if (date1[0] > date2[0] || (date1[0] === date2[0] && date1[1] > date2[1])) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch= true;
        break;
      } 
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

/******************************* Schedule Script *******************************/


// click event
var element = document.querySelector('.scheduleBtn');
if(element){
    element.addEventListener("click", function(e) {
      showSchedule();
      }, false);
}

//add the classes based on the day of the week
var date = new Date();
var day = date.getDay();
var i;
for(i = 0; i < classList.length; i++){
  var times = JSON.parse(localStorage.getItem(classList[i] + "Time"));
  var j;
  for(j = 0; j < times.length; j++){
    if(dayStringToNum(times[j][0]) == day){
      //create a element for the schedule
      var div = document.createElement("li");
      div.id = classList[i] + "SchedNode";
      div.className = "schedNode";
      div.style.background = localStorage.getItem(classList[i] + "Color");

      //text
      var label = document.createElement("p");
      label.innerText = classList[i];
      label.className = "classLabel";
      div.appendChild(label);

      //time
      var time = document.createElement("p");
      time.innerText = times[j][1].substring(0, times[j][1].length - 2) + " to " + times[j][2].substring(0, times[j][2].length - 2);
      time.className = "classTime";
      if(times[j][1].substring(times[j][1].length - 2) === 'PM'){
        time.classList.toggle("PM");
      }
      div.appendChild(time);

      //add to schedule
      document.getElementById('schedule').appendChild(div);
    }
  }
}

sortSched(document.getElementById('schedule'));

function dayStringToNum(day){
  var num;
  switch(day){
    case "sun":
      num = 0;
      break;
    case "mon":
      num = 1;
      break;
    case "tue":
      num = 2;
      break;
    case "wed":
      num = 3;
      break;
    case "thur":
      num = 4;
      break;
    case "fri":
      num = 5;
      break;
    case "sat":
      num = 6;
      break; 
  }
  return num;
}


//function to show classes
function showSchedule(){
  var schedule = document.getElementById("schedule");
  var button = document.getElementById("scheduleBtn");
  $(schedule).slideToggle();
  if(button.innerText == 'Today'){
    button.innerText = 'Close';
  } else {
    button.innerText = 'Today';
  }
} 

function addToSchedule(){

}

function sortSched(list){
  var i, switching, b, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list items:
    //debugger;
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;

      var time = b[i].getElementsByClassName("classTime")[0];
      var time1 = time.innerText;
      var index = time1.indexOf("to");
      time1 = time1.substring(0, index-1);
      index = time1.indexOf(":");
      var hours1 = parseInt(time1.substring(0, index));
      var mins1 = parseInt(time1.substring(index+1));

      if(time.className.indexOf("PM") != -1){
        if(hours1 < 12){
          hours1 = hours1 + 12;
        }
      }

      time = b[i+1].getElementsByClassName("classTime")[0];
      var time2 = time.innerText;
      var index = time2.indexOf("to");
      time2 = time2.substring(0, index-1);
      index = time2.indexOf(":");
      var hours2 = parseInt(time2.substring(0, index));
      var mins2 = parseInt(time2.substring(index+1));

      if(time.className.indexOf("PM") != -1){
        if(hours2 < 12){
          hours2 += 12;
          console.log(hours2);
        }
      }

      /* Check if the next item should
      switch place with the current item: */
      if (hours1 > hours2 || (hours1 === hours2 && mins1 > mins2)) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch= true;
        break;
      } 
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}


/******************************* Productivity Script *******************************/


// click event
var element = document.querySelector('.prodBtn');
if(element){
    element.addEventListener("click", function(e) {
      showProductivity();
      }, false);
}

//function to show productivity data
function showProductivity(){
  var schedule = document.getElementById("prod");
  var button = document.getElementById("prodBtn");
  $(schedule).slideToggle();
  if(button.innerText == 'Productivity'){
    button.innerText = 'Close';
  } else {
    button.innerText = 'Productivity';
  }
}






