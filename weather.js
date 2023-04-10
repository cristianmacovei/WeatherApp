var wmoCodes = {
    "0": "Clear Sky",
    "1": "Mainly Clear",
    "2": "Cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Heavy Fog",
    "51": "Light Drizzle",
    "53": "Moderate Drizzle",
    "55": "Heavy Drizzle",
    "56": "Light Freezing Drizzle",
    "57": "Heavy Freezing Drizzle",
    "61": "Light Rain",
    "63": "Moderate Rain",
    "65": "Heavy Rain",
    "66": "Light Freezing Rain",
    "67": "Heavy Freezing Rain",
    "71": "Light Snowfall",
    "73": "Moderate Snowfall",
    "75": "Heavy Snowfall",
    "76": "Snow Grains",
    "80": "Light Rain Showers",
    "81": "Moderate Rain Showers",
    "82": "Violent Rain Showers",
    "85": "Light Snow Shower",
    "86": "Heavy Snow Showers",
    "95": "Thunderstorm",
    "96": "Slight Hail",
    "97": "Heavy Hail"
};

let weather = {

    //////   API Key from OpenWeatherMap NOT NEEDED ANYMORE //////
        //"apiKey": "3bd94ef72906ad85bf362423ee27a2d7",


    //first Function: fetchVreme - gets passed the city parameter and searches
    //information on the api website using the CITY parameter and APIKEY
    fetchVreme: async function(lat, long) {

        const apiUrl2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=GMT&daily=temperature_2m_max&daily=temperature_2m_min&daily=weathercode&current_weather=true&hourly=temperature_2m&hourly=relativehumidity_2m&forecast_days=7`;
        var response = await fetch(apiUrl2);
        var data = await response.json();

        //console.log(data);

        //store aux
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var currentWeather = data.current_weather;
        var hourlyWeather = data.hourly;
        var code = data.current_weather.weathercode;
        var daily = data.daily;
        var maxTemp = data.daily.temperature_2m_max;
        var minTemp = data.daily.temperature_2m_min;
        var weatherCode = data.daily.weathercode;
        //console.log(maxTemp);

        var seven = document.getElementById('weather-seven-days');

        //daily.time.forEach(day =>
        for (let i = 0; i < daily.time.length; i++) 
        {
            const day = daily.time[i]
            //console.log(`day: ${day}`);

            //create Weather Card
            const card = document.createElement('div');
            card.classList.add(`card`);

            //create h2 tag for day
            const cardTitleDay = document.createElement('h2');
            cardTitleDay.classList.add('card-title-day');

            //icon for weather
            const weatherIconSm = document.createElement('img');
            weatherIconSm.classList.add('weatherIconSm');
            const codeDescSm = wmoCodes[weatherCode[i]];
            console.log("Code: "+codeDescSm);

            //h3 for weathercode and icon
            const weatherCodeh3 = document.createElement('p');
            weatherCodeh3.classList.add('weatherCodeh3');

            //create temp-max
            const tempMaxTag = document.createElement('p');
            tempMaxTag.classList.add('temp-max-tag');

            //create temp-min 
            const tempMinTag = document.createElement('p');
            tempMinTag.classList.add('temp-min-tag');

            //main container where the small cards will go
            const seven = document.querySelector('.weather-seven-days');
            
            //store the date 
            var dateAux = new Date(day);
            var weekdayName = dateAux.toString().split(' ')[0];
            console.log(weekdayName);
            
            //populate the tags with information from JSON
            cardTitleDay.innerHTML = weekdayName;
            weatherCodeh3.innerHTML = codeDescSm;
            weatherIconSm.src = `Icons/${codeDescSm}.svg`
            tempMaxTag.innerHTML = `High: ${parseInt(maxTemp[i])} °C`;
            tempMinTag.innerHTML = `Low: ${parseInt(minTemp[i])} °C`;

            //Append nodes to each card
            card.appendChild(cardTitleDay);
            card.appendChild(weatherCodeh3);
            card.appendChild(weatherIconSm);
            card.appendChild(tempMaxTag);
            card.appendChild(tempMinTag);

            //Append the seven cards to the main container
            seven.appendChild(card);
            console.log(weatherIconSm);

        }

        /*store forecast
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 1; i <= days.length; i++) {
            const dayOne = data.daily.time[i];
            const date = new Date(dayOne);

            const dayName = days[date.getDay()];
            //console.log(dayName);

            document.getElementById(`day-${i}`).textContent = dayName;
            console.log(document.getElementById('day-1').textContent);
        }*/

        var codeDescription = wmoCodes[code];
        //console.log(codeDescription);

        var tempe = currentWeather.temperature;
        var wspeed = currentWeather.windspeed;
        //console.log(data.current_weather);

        document.querySelector(".city").innerText = "Weather in " + searchBarInput.value;
        document.querySelector(".temp").innerText = parseInt(data.current_weather.temperature) + "°C";
        document.querySelector(".windspeed").innerText = "Wind: " + parseInt(wspeed) + "km/h";
        document.querySelector(".humidity").innerText = "Humidity: " + parseInt(hourlyWeather.relativehumidity_2m[0]) + "%";
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector(".desc").innerText = wmoCodes[code];
        // OK -->> console.log(codeDescription);
        document.querySelector(".weatherIcon").src = "/Icons/"+codeDescription+".svg";

        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600x900/?" + searchBarInput.value + "')";
        
        
        /////OPENWEATHERMAP DOESNT OFFER FORECAST SO IT WILL NOT BE IMPLEMENTED //////

        /*fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid=" 
            + this.apiKey
            //get the json data and (console.log it for testing then) display it 
        ).then((response) => response.json())
        .then((data) => this.displayVreme(data))
        .catch(error => console.error(error));*/
    },
 

    //third function is a search function that takes the input from the 
    //search bar and passes it as the city name parameter. 
    search: function() {
        //Takes the input from the search bar and stores it
        var cityName = document.querySelector(".searchbar").value;
        //Call function to change cityName into lat, long
        this.getCoordForCity(cityName);
    },

    /// asynchronous function to get coordinates from the cityName parameter that get passed in the SEARCHBOX
    getCoordForCity: async function(cityName) {

        // store api key and url
        const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY3Jpc3RpYW5tYWNvdmVpIiwiYSI6ImNsZzUwNzFicDAwMzYzZHByeHd2cXp4cjEifQ.TF3o7k2iti3xgiQNOcQVFA';
        const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

        // await fetch url and response in json
        var response = await fetch(geocodeURL);
        var data = await response.json();

        //store found data
        var coordinates = data.features[0].center;

        //OK -->> console.log("Coord:", coordinates);

        ////    Timisoara location: lat: 45.75, long: 21.2. 
        ////    This algorithm shows coordinates as [long, lat] and the implemented functions take (lat, long)
        ////    So when it would pass the variables inverted
        ////    So basically for Timisoara it would show the Weather in Saudi Arabia[21.2 , 45.75];

        //convert to 2 individual variables: lat & long
        var long = coordinates[0];
        var lat = coordinates[1];

        // call fetchVreme for stored values above
        this.fetchVreme(lat,long);

        // check to see if lat and long are correct
        // console.log(lat, long);
        return coordinates;
    }


}
//Adding functionality to the magnifying glass button to search
document
.querySelector(".search button")
.addEventListener("click", function () {
    weather.search();
});

//Adding functionality when the enter key is pressed
document
.querySelector(".searchbar")
.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});


const searchBarInput = document.getElementById('searchbar');

const mapsApiKey = "AIzaSyB1UoE2a_f-XSIIFnrI8zS7hZODlu_c08I";

//Ask for location PERMISSION and get it if allow
navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
  
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${mapsApiKey}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {


        // City name does not get passed to the SEARCHBAR // but does show up in the console
        //UPDATE it works. Issue was all the variables were declared as CONST instead of VAR.

        var addressComponents = data.results[0].address_components;
        var cityComponent = addressComponents.find(component => component.types.includes('locality'));
        var city = cityComponent ? cityComponent.long_name : '';
        
        console.log(lat, long);
        //var address = data.results[0].address_components;
        var location = city ? city : `${lat},${long}`;

        //verify that it ACTUALLY STORES THE DAMN LOC
        var passedLoc = document.getElementById('searchbar').value = location;
        
        //w
        console.log(passedLoc);
        //weather.search();
        weather.getCoordForCity(location);

      })
      .catch(error => {
        console.log(error.message);
        
        // Insert latitude and longitude into search bar as backup
        searchBarInput.innerText = `${lat},${long}`;
      });
  }, (error) => {
    console.log(error.message);
  });


const datetimeCont = document.getElementById('datetime-container');
const dateCont = document.getElementById('date');
const timeCont = document.getElementById('time');
//Time and date IRL
setInterval(() => {
    
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();

    //Get minutes and show a 0 if minutes less than 10 // 9:05 instead of 9:5
    const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    const date = now.toLocaleDateString('en-GB', {weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'});

    //const tomorrow = now.getDate()+1;
    //console.log(tomorrow);

    timeCont.textContent = `${time}`;
    dateCont.textContent = `Today is: ${date}`;

}, 1000);


