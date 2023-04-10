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
    //first Function: fetchVreme - gets passed latitude and longitude parameter and fetches
    //the API and stores JSON weather info
    fetchVreme: async function(lat, long) {

        //API URL
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=GMT&daily=temperature_2m_max&daily=temperature_2m_min&daily=weathercode&current_weather=true&hourly=temperature_2m&hourly=relativehumidity_2m&forecast_days=7`;
        // await and fetch
        var response = await fetch(apiUrl);
        var data = await response.json();

        //OK -->> console.log(data);

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

        //loop through the JSON
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

            //p for weathercode and icon
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
        
        //access weather description for code from defined wmoCode ictionary
        var codeDescription = wmoCodes[code];
        //console.log(codeDescription);

        //Store temperature and wind speed for future 
        var tempe = currentWeather.temperature;
        var wspeed = currentWeather.windspeed;
        //OK -->> console.log(data.current_weather);

        //Set current weather in main weather container
        document.querySelector(".city").innerText = "Weather in " + searchBarInput.value; // <<-- Location in heading
        document.querySelector(".temp").innerText = parseInt(data.current_weather.temperature) + "°C"; // <<-- Temperature
        document.querySelector(".windspeed").innerText = "Wind: " + parseInt(wspeed) + "km/h"; // <<-- Wind Speed
        document.querySelector(".humidity").innerText = "Humidity: " + parseInt(hourlyWeather.relativehumidity_2m[0]) + "%"; // <<-- Humidity
        document.querySelector(".weather").classList.remove("loading"); // <<-- Remove loading from class list to show full weather card
        document.querySelector(".desc").innerText = wmoCodes[code]; // <<-- Weather description based on weathercode
        // OK -->> console.log(codeDescription);
        document.querySelector(".weatherIcon").src = "/Icons/"+codeDescription+".svg";

        // Background image from unsplash based on location -- not very great though
        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600x900/?" + searchBarInput.value + "')";
    },
 

    //second function is a search function that takes the input from the 
    //search bar and passes it as the city name parameter. 
    search: function() {
        //Takes the input from the search bar and stores it
        var cityName = document.querySelector(".searchbar").value;
        //Call function to change cityName into latitude and longitude
        //so that fetchVreme() gets passed the correct parameters
        this.getCoordForCity(cityName);
    },

    ///third function to get coordinates from the cityName parameter that get passed in the SEARCHBOX
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

        //convert to 2 individual variables: lat & long
        var long = coordinates[0];
        var lat = coordinates[1];

        // call fetchVreme for stored values above
        this.fetchVreme(lat,long);
        //OK -->> console.log(lat, long);
        return coordinates;
    }


}

//Adding functionality to the magnifying glass button to search
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

//Adding functionality to the enter key 
document.querySelector(".searchbar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

//Store
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
        
        //Store components that make up the location data
        var addressComponents = data.results[0].address_components;
        var cityComponent = addressComponents.find(component => component.types.includes('locality'));
        var city = cityComponent ? cityComponent.long_name : '';
        
        //OK -->> console.log(lat, long);
        
        //find the city if it exists, else pass latitude and longitude in the searchbar
        var location = city ? city : `${lat},${long}`;


        //verify that it ACTUALLY STORES THE DAMN LOC // it does
        var passedLoc = document.getElementById('searchbar').value = location;
        
        //w
        // OK -->> console.log(passedLoc);
        
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

//Date and Time
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