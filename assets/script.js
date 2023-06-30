const apiKey = 'a57f017885ca4e1fbab263ece353c473'; 

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather-info');
const forecastDiv = document.getElementById('forecast-info');
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city !== '') {
    getWeather(city);
  }
});

function getWeather(city) {
  // Fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    })
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
      addCityToSearchHistory(city);
    })
    .catch(error => {
      console.log('Error:', error);
      // Handle error scenarios
    });
}

function displayCurrentWeather(data) {
  // Display current weather
  const { name, dt, weather, main, wind } = data;

  const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
  const date = new Date(dt * 1000).toLocaleDateString();

  const currentWeatherHTML = `
    <h2>${name}</h2>
    <p>Date: ${date}</p>
    <img src="${iconUrl}" alt="${weather[0].description}">
    <p>Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;

  currentWeatherDiv.innerHTML = currentWeatherHTML;
}

function displayForecast(data) {
  // Display forecast
  const forecastItems = data.list.slice(0, 5); // Display 5-day forecast

  let forecastHTML = '';
  forecastItems.forEach(item => {
    const { dt, weather, main, wind } = item;

    const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
    const date = new Date(dt * 1000).toLocaleDateString();

    forecastHTML += `
      <div>
        <p>Date: ${date}</p>
        <img src="${iconUrl}" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      </div>
    `;
  });

  forecastDiv.innerHTML = forecastHTML;
}

function addCityToSearchHistory(city) {
  // Add city to search history
  if (!searchHistory.includes(city)) {
    if (searchHistory.length >= 5) {
      searchHistory.shift();
    }
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    loadSearchHistory(); // Call the function to display updated search history
  }
}

function loadSearchHistory() {
  // Clear existing search history
  document.getElementById('search-history').innerHTML = '';

  // Load search history from localStorage
  for (let i = 0; i < searchHistory.length; i++) {
    const city = searchHistory[i];
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.addEventListener('click', function() {
      getWeather(city);
    });
    document.getElementById('search-history').appendChild(historyItem);
  }
}

loadSearchHistory();