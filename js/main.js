//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;
document.addEventListener("DOMContentLoaded", function() {
   var css = document.createElement("link");
   css.setAttribute("rel", "stylesheet");
   css.setAttribute("href", "main.css");
   css.addEventListener("load", loadCount);
   document.querySelector("head").appendChild(css);
   var jq = document.createElement("script");
   jq.addEventListener("load", loadCount);
   jq.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
   document.querySelector("head").appendChild(jq);
});

function buildWidget() {
   var forecastKey = "0d9c129bbad86897906ba4fdb281d0a5";
   var lat = "45.348391";
   var long = "-75.757045";
   $.ajax({
       url: "https://api.forecast.io/forecast/" + forecastKey + "/" + lat + "," + long + "?units=ca",
       type: "GET",
       dataType: "jsonp",
       success: function(resp) {
           buildCurrent(resp.currently);
           buildHourly(resp.hourly);
           console.log(resp);
       },
       error: function() {
           alert("An error occurred");
       }
   });
}

function buildCurrent(current) {
   var today = new Date();
   var container = $(".weather-forecast");
   $("<p>").text("Current Conditions for today, " + today.getDate() + "/" + (parseInt(today.getMonth()) + 1)).appendTo(container);
   $("<i>").addClass("wi").addClass("wi-forecast-io-" + current.icon).addClass("current").appendTo(container);
   $("<p>").text("Temperature " + current.temperature + " C").appendTo(container);
   $("<p>").text(current.summary).appendTo(container);
}

function buildHourly(hourly) {
   var containerNode = $("<table>");
   var today = new Date();
   for (var i = 0; i < hourly.data.length; i++) {
       var hourlyData = hourly.data[i];
       var time = new Date(hourlyData.time * 1000);
       if (time.getDate() === today.getDate()) {
           time = time.getHours() + ":00";
           var hourNode = $("<tr>");
           $("<td>").text(time).appendTo(hourNode);
           $("<td>").text(hourlyData.humidity.toString().split(".")[1] + "%").appendTo(hourNode);
           $("<td>").text(hourlyData.cloudCover === 1 ? "100%" : hourlyData.cloudCover.toString().split(".")[1] + "%").appendTo(hourNode);
           $("<td>").text(hourlyData.temperature + " C").appendTo(hourNode);
           $("<td>").text(hourlyData.windSpeed + " km/h").appendTo(hourNode);
           $("<i>").addClass("wi").addClass("wi-forecast-io-" + hourlyData.icon).appendTo($("<td>")).appendTo(hourNode);
           $("<td>").text(hourlyData.summary).appendTo(hourNode);
           hourNode.appendTo(containerNode);
       }
   }
   containerNode.appendTo($(".weather-forecast"));
}

function loadCount() {
   scriptsLoaded++;
   if (scriptsLoaded === 2) {
       buildWidget(".weather-forecast");
       console.log("both scripts loaded");
   }
}