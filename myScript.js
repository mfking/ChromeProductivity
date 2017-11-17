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

/******************************* To Do List Script *******************************/
var element = document.querySelector('.addBtn');
if(element){
  console.log("ELEMENT1");
    element.addEventListener("click", function(e) {
      newElement();
      }, false);
} 

var element = document.querySelector('.toDo');
if(element){
  console.log("ELEMENT2");
    element.addEventListener("click", function(e) {
      showToDoList();
      }, false);
}   
                               

var items = [];
var checks = [];


//add items from local storage
items = JSON.parse(localStorage.getItem("items"));
checks = JSON.parse(localStorage.getItem("checks"));
var i;
for(i = 0; i < items.length; i++){
  var li = document.createElement("li");
  var itemValue = items[i];
  var t = document.createTextNode(itemValue);
  li.appendChild(t);
  var ul = document.getElementById("myUL");
  if(ul){
    ul.appendChild(li);
  }

  if(checks.indexOf(itemValue) > -1){
      li.classList.toggle('checked');
  }
}

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
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
      var div = this.parentElement;
      div.style.display = "none";
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

/** TEST FUNCTION **/

$(function(){
 
    // Specify the ZIP/location code and units (f or c)
    var loc = '10001'; // or e.g. SPXX0050
    var u = 'f';
 
    var query = "SELECT item.condition FROM weather.forecast WHERE woeid in (select woeid from geo.places(1) where text='" + loc + "' and country='United States') AND u='" + u + "'";
    var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: url,
      cache: true,
      success: function(result){
        console.log("Success");
        console.log(result.query.results);
        var info = result.query.results.channel.item.condition;
        $('#wxIcon').css({
          backgroundPosition: '-' + (61 * info.code) + 'px 0'
        }).attr({
          title: info.text
        });
        $('#wxIcon2').append('<img src="http://l.yimg.com/a/i/us/we/52/' + info.code + '.gif" width="34" height="34" title="' + info.text + '" />');
        $('#wxTemp').html(info.temp + '&deg;' + (u.toUpperCase()));
      }
    }); 

/*
    $.ajax({
        dataType: 'json',
        url: url,
        cache: true,
        jsonpCallback: 'wxCallback'
    }); */
     
});
