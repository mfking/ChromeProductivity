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
    list.classList.toggle("scale-out");
    if(button.innerText === "To Do List"){
      button.innerText = "Close";
    } else {
      button.innerText = "To Do List";
    }
}

/******************************* Weather Script *******************************/

var autocomplete;
var countryRestrict = {'country': 'us'};

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
    console.log("THIS PLACE: " + place.geometry.location);
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city...';
  }
}


//weather button click event
var element = document.querySelector('.weatherButton');
if(element){
    element.addEventListener("click", function(e) {
      showWeather();
      }, false);
}  

/* TESTING ANIMATION 
$(document).ready(function(){
  $('.weatherButton').click(function(){
    $('.weather').slideToggle();
  });
}); */

//search button
var element = document.querySelector('.searchButton');
if(element){
  console.log("interset");
  element.addEventListener("click", function(e) {
    locationSearch();
    }, false);
  }

function locationSearch(){
  console.log("clcik");
  var input = document.getElementById("autocomplete")
  $(input).toggle(100, "linear");
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
  if(weather.style.display == "none"){
      weather.style.display = "block";
      button.innerText = "Close";
  } else {
      weather.style.display = "none";
      weatherButton.innerText = "Weather";
  }
} 


//function to call yahoo API to get and display weather information (should probably only call this a few times a day not
//every time a tab opens --> will look into this)
$(function(){
 
    // Specify the ZIP/location code and units (f or c)
    var loc = '02481'; // or e.g. SPXX0050
    var u = 'f';
 
    var query = "SELECT item.forecast FROM weather.forecast WHERE woeid in (select woeid from geo.places(1) where text='" + loc + "' and country='United States') AND u='" + u + "'";
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

        document.getElementById("day1high").innerText = today.high + "\xB0";
        var day2 = document.getElementById("day2");
        var day3 = document.getElementById("day3");

        //TO DO: IMPLEMENT GETTING/ DISPLAYING ALL DESIRED WEATHER INFO
      }
    });    
});

/******************************* Classes Script *******************************/


//TO DO
/* Create a menu "schedule" that displays a daily schedule and lists of all classes. Can Add meeting times 
and then this adds it to classes list */

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
  if(i%2 == 0){
    className.style.background = "rgba(71, 190, 255, 0.8)";
  } else {
    className.style.background = "rgba(126, 274, 136, 0.8)";
  }

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
  if(classes.style.display == "none"){
      classes.style.display = "block";
      button.innerText = "Close";
  } else {
      classes.style.display = "none";
      button.innerText = "Classes";
  }
  if(classList.length == 0){
    document.getElementById("newClass").style.display = "block";
    document.getElementById("newInfo").style.display = "block";
    document.getElementById("addButton").innerText = "\u00D7";
  }

} 

//function to show add class
function showAddClass(){
  var input = document.getElementById("newClass");
  var info = document.getElementById("newInfo");
  var button = document.getElementById("addButton");
  $(input).toggle(100, "linear");
  $(info).slideToggle(100, "linear");
  if(button.innerText === "+"){
    button.innerText = "\u00D7";
  } else {
    button.innerText = "+";
  }

}

function addClass() {
  var div = document.createElement("div");

  //create the header
  var inputValue = document.getElementById("classInput").value;
  var className = document.createElement("p");
  className.innerText = inputValue;
  className.className = "courseTitle";
  div.appendChild(className);
  div.className = "course";
  div.id = inputValue;

  if(classList.length%2 == 0){
    className.style.background = "rgba(71, 190, 255, 0.8)";
  } else {
    className.style.background = "rgba(126, 274, 136, 0.8)";
  }

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

  //reset the input and button
  document.getElementById("classInput").value = "";
  //document.getElementById("newClass").style.display = "none";
  $("#newClass").toggle(100, "linear");
  $("#newInfo").slideToggle(100, "linear");
  //document.getElementById("newInfo").style.display = "none;"
  document.getElementById("addButton").innerText = "+";
  document.getElementById("addButton").style.padding = "4px 8px";
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


//function to show classes
function showSchedule(){
  var schedule = document.getElementById("schedule");
  var button = document.getElementById("scheduleBtn");
  if(schedule.style.display == "none"){
      schedule.style.display = "block";
      button.innerText = "Close";
    } else {
      schedule.style.display = "none";
      button.innerText = "Schedule";
    }
} 










