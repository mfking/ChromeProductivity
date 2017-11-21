/******************************* Main Page Script *******************************/

//set the background image
var num = Math.floor(Math.random() * 6);
var url = "url('images/" + num + ".jpg')";
document.body.style.backgroundImage = url;

var header = document.getElementById("header");
var date = new Date();
if(date.getHours() < 12){
  header.innerText = "Good Morning";
} else if(date.getHours() < 5){
  header.innerText = "Good Afternoon";
} else {
  header.innerText = "Good Evening";
}

//for later usage (determining if the page has already been visited today)
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
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
console.log("Close length: " + close.length);
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
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
if(list){
  list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');

      var str = ev.target.innerText;
      if(ev.target.className == 'checked'){
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
    }
  }
}

function showToDoList() {
    var list = document.getElementById("toDoList");
    var button = document.getElementById("toDo");
    if(list.style.display == "none"){
      list.style.display = "block";
      button.innerText = "Close";
    } else {
      list.style.display = "none";
      button.innerText = "To Do List";
    }
}

/******************************* Weather Script *******************************/

//weather button click event
var element = document.querySelector('.weatherButton');
if(element){
    element.addEventListener("click", function(e) {
      showWeather();
      }, false);
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
        console.log("Success");

        console.log(result.query.results.channel[0].item.forecast);
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
//get list of classes
var classList = JSON.parse(localStorage.getItem("classes"));
if(!classList){
  classList = [[]];
}
/*
//add classes and class events
//index [i][0] is class name, [i][1] is first event [i][2] is first event due date etc
var i = 0, j=0;
for(i = 0; i < classList.length; i++){
  //create the class
  var div = document.createElement("div");

  //crate the header
  var className = document.createElement("h3");
  className.innerText = classList[i][0];

  //create the list
  var list = document.createElement("ul");

  //TO DO: MAKE THE LIST
  for(j = 1; j < classList[i].length; j+=2){
    var item = classList[i][j];
    var date = classList[i][j+1];
  }

  div.appendChild(className);
  div.appendChild(list);
} */

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
console.log("Close length: " + close.length);
for (i = 0; i < courseClose.length; i++) {
  courseClose[i].onclick = function() {

    //remove the element from the display
    var div = this.parentElement;
    div.style.display = "none";
  
    //remove the element from the items list (storage)
    var string = this.parentElement.innerText;
    // edit this to remove from course info list 
    /*
    var index = items.indexOf(string.substring(0, string.length-1));
    if(index > -1){
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));*/
  }
}


//add item event
var courseAdds = document.getElementsByClassName("courseBtn");
var i;
for (i = 0; i < courseAdds.length; i++) {
  courseAdds[i].onclick = function() {
    var li = document.createElement("li");
    var course = this.id.substring(0, this.id.length-3);
    var inputID = course + "Input";
    console.log(course);
    console.log(inputID);
    var inputValue = document.getElementById(inputID).value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    li.className = "courseToDo";
    if (inputValue != '')
      var id = course + "toDo";
      document.getElementById(id).appendChild(li);
    }
  
    document.getElementById("myInput").value = "";
  
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
      }
    }
  }



//function to show classes
function showClasses(){
  var classes = document.getElementById("classes");
  var button = document.getElementById("classButton");
  if(classes.style.display == "none"){
      classes.style.display = "block";
      button.innerText = "Close";
    } else {
      classes.style.display = "none";
      button.innerText = "Classes";
    }
} 

//function to show add class
function showAddClass(){
  var addClass = document.getElementById("addClass");
  var button = document.getElementById("addButton");
  if(addClass.style.display == "none"){
    addClass.style.display = "block";
    button.innerText = "x";
    button.style.padding = "4px 9px";
  }else {
      addClass.style.display = "none";
      button.innerText = "+";
      button.style.padding = "4px 8px";
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

  //create the list
  var list = document.createElement("ul");
  list.className = "courseToDo";
  list.id = inputValue + "toDo";
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
  div.appendChild(createNew);

  //add the class
  document.getElementById("classes").appendChild(div);

  for (i = 0; i < courseAdds.length; i++) {
    courseAdds[i].onclick = function() {
      var li = document.createElement("li");
      var course = this.id.substring(0, this.id.length-3);
      var inputID = course + "Input";
      console.log(course);
      console.log(inputID);
      var inputValue = document.getElementById(inputID).value;
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      li.className = "courseToDo";
      if (inputValue === '') {
        alert("You must write something!");
      } else {
        var id = course + "toDo";
        document.getElementById(id).appendChild(li);
      }
    
      document.getElementById(inputID).value = "";

      //create date 
      var dateIn = document.getElementById(course + "Date").value;
      var dateSpan = document.createElement("SPAN");
      var dateTxt = document.createTextNode(dateIn);
      console.log(dateIn);
      dateSpan.className = "dateSpan";
      li.appendChild(dateSpan);
    
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
        }
      }
    }
  }

  //reset the input and button
  document.getElementById("classInput").value = "";
  document.getElementById("addClass").style.display = "none";
  document.getElementById("addButton").innerText = "+";
  document.getElementById("addButton").style.padding = "4px 8px";
}














