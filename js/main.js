/*
==============================================
Weather Application
==============================================
*/
//waiting for html to load first
(function(){

//creating object of pictures realted to different description
var cloudPictures = {
	"overcast clouds": 'img/overcast.jpg',
	"broken clouds": 'img/broken.jpg',
	"scattered clouds": 'img/scattered.jpg',
	"Sky is Clear": 'img/clearSky.jpg',
	"sky is clear": 'img/clearSky.jpg',
	"few clouds": 'img/fewClouds.jpg',
	"light rain": 'img/lightRain.jpg'
}

$('#weatherApp form').on('submit', function(event){
	event.preventDefault();

	//after cklicking inside any input, clears the text on the page
	$('input').focus(function(){
				$('#displayWeather').text('');
			});

	var formUrl = $(this).attr('action');
	var formData = $(this).serializeArray();
	var jsonData = {};

	// creating new object similar to json data format
	$.each(formData, function(){
		if(jsonData[this.name]){
			//if it doesn't push 
			if(!jsonData[this.name].push){
				jsonData[this.name] = [jsonData[this.name]];
			}
			jsonData[this.name].push(this.value || '');
		} else {
			jsonData[this.name] = this.value || '';	
		}
	});

	
	//using api key from the openweathermap.org with ajax request
	$.ajax({
		context: $('#weatherApp form'),
		url: 'http://api.openweathermap.org/data/2.5/weather',
		data: {
			q: jsonData.city,
			units: "metric"
		},
		//contentType: 'appication/json'   asking the server to respond with json
		// type: 'POST',
		dataType: "json",
		timeout: 3000,
		beforeSend: function(){
			$('#displayWeather').html('<h1>Loading . . .</h1>');
		},
		success: function(response){

			//creating variables using object received from weather website
			var temperature = parseInt(response.main.temp);
			var city = response.name;
			var country = response.sys.country;
			var humidity = response.main.humidity;
			var description = response.weather[0].description;
			var wind = response.wind.speed;
			
			//building list of information about the weather of the city entered
			$('#displayWeather').html('<h1 >' + city + '</h1>');
			$('#displayWeather').append('<h2><span class="glyphicon glyphicon-cloud"></span> ' + description + '</h2>');
			$('#displayWeather').append('<img src="' + cloudPictures[description] + '">');

			var lists = $('<ul></ul>');
			lists.append('<li><span class="glyphicon glyphicon-dashboard"></span> Temperature:<span ><b> ' + temperature + 'C</b></span></li>');
			lists.append('<li><span class="glyphicon glyphicon-tint"></span> Humidity:<span><b> ' + humidity +'%</b></span></li>');
			lists.append('<li><span class="glyphicon glyphicon-flash"></span> Wind:<span><b> ' + wind + ' km/h</b></span></li>');
			lists.addClass('slideLeftWeather');
			$('#displayWeather').append(lists);
		
		},
		error: function(request, errorType, errorMessage){
			alert('Error: ' + errorType + ' with message: ' + errorMessage );
		}

	});	
	
	//if user leave inputs empty
		if($('.city').val() == '' ){
			$('#displayWeather').html('<p class="weatherAlert text-center">Enter the name of city so I can find the weather</p>');
		}

});


//function ready ends here
})();



