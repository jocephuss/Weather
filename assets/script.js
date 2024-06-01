const searchButton = document.querySelector('.srch-btn');
const cityInput = document.querySelector('.city-input');
const cardsDiv = document.querySelector('.cards')
const currentDiv = document.querySelector('.current')

const apiKey = 'c9856c9f13592af328d5d42e71f072cc'; // API key for openweathermap

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h4>
            <h4>wind: ${weatherItem.wind.speed}mph</h4>
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
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h4>
            <h4>wind: ${weatherItem.wind.speed}mph</h4>
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

searchButton.addEventListener('click', getCityCoordinates);