

/*
==============================================
Weather Application
==============================================
*/


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


////////////////////AJAX CALL FOR FLICKER///////////////////////////////

var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

function flicker(input){
    var promise = $.Deferred();
     $.ajax({
        url: flickerAPI,
        data: {
            tags: input,
            format: "json"
        },
        dataType: 'json',
        success: function(response){
            promise.resolve(response.items)
        }  
    })
    return promise;
}

////////////////////AJAX CALL FOR WEATHER///////////////////////////////

var weatherApi = 'http://api.openweathermap.org/data/2.5/weather';
function findWeather(input){
	var promise = $.Deferred();
	$.ajax({
		url: weatherApi,
		data: {
			q: input,
			units: "metric"
		},
		dataType: "json",
		timeout: 3000,
		beforeSend: function(){
			$('#displayWeather').html('<h1>Loading . . .</h1>');
		},
		success: function(response){
			promise.resolve(response)
		}
	});
	return promise;
}

$('#weatherApp').on('click', 'button', function(event){
	event.preventDefault();

	var value = $('.city').val();
	
		//if user leave inputs empty
		if(value == '' ){
			$('#displayWeather').html('<p class="weatherAlert text-center">Enter the name of city so I can find the weather</p>');
			return false
		}

	$.when(
		findWeather(value),
		flicker(value)
		).then(function(weatherData, flikcerData){

		
	///////////////WEATHER CALLBACK//////////////////
	//creating variables using object received from weather website
	var temperature = parseInt(weatherData.main.temp);
	var city = weatherData.name;
	var country = weatherData.sys.country;
	var humidity = weatherData.main.humidity;
	var description = weatherData.weather[0].description;
	var wind = weatherData.wind.speed;
	
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
	
		

	///////////////FLICKER CALLBACK//////////////////
    	var gallery = $('<div class="flickerGallery "></div>')
        $.each(flikcerData, function(i, item){
            var img = $( "<img>" ).attr( "src", item.media.m );
          	gallery.append(img);
        if ( i === 1) {
          return false;
        }
        });
        $('#displayWeather').append(gallery);
        $('.flickerGallery img').css({'width': '150px', 'height': '150px', 'margin-left': '10px'})
        
      
   
	})

});




