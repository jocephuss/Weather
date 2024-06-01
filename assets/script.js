const searchButton = document.querySelector('.srch-btn');
const locationBtn = document.querySelector('.location-btn')
const cityInput = document.querySelector('.city-input');
const cardsDiv = document.querySelector('.cards')
const currentDiv = document.querySelector('.current')

const apiKey = 'c9856c9f13592af328d5d42e71f072cc'; // API key for openweathermap

const createWeatherCard = (cityName, weatherItem, index) => {
    const tempFahrenheit = ((weatherItem.main.temp - 273.15) * 9/5) + 32;
    const windMph = weatherItem.wind.speed * 2.237;
    if (index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${tempFahrenheit.toFixed(2)}°F</h4>
            <h4>wind: ${windMph.toFixed(2)} MPH</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4> 
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;

    } else {
        return `<li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
            <h4>Temp: ${tempFahrenheit.toFixed(2)}°F</h4>
            <h4>wind: ${windMph.toFixed(2)} MPH</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4> 
            </li>`;

    }


}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(weatherApiUrl).then(response => response.json()).then(data => {
        const forecastDays = [];

        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!forecastDays.includes(forecastDate)) {
                return forecastDays.push(forecastDate);
            }
        });

        //clear old data
        cityInput.value = '';
        currentDiv.innerHTML = '';
        cardsDiv.innerHTML = '';

        //Creating cards and adding to DOM
        fiveDayForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentDiv.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));

            } else {
                cardsDiv.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));

            }




        });

    }).catch(() => {
        alert('Error occured fetching Forecast!');
    });
}


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // get city input and trim extra spaces
    if (!cityName) return; // retun if city name is empty
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`

    // get city location from api response
    fetch(apiUrl).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No location found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);

    }).catch(() => {
        alert('Error occured fetching location!');

    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const reverseApiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            fetch(reverseApiUrl).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                
        
            }).catch(() => {
                alert('Error occured fetching location!');
        
            });

        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Location request denied. reset location permission to grant access.");
            }
        }
    );
}

locationBtn.addEventListener('click', getUserCoordinates);
searchButton.addEventListener('click', getCityCoordinates);
