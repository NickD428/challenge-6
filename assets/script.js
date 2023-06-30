const apiKey = 'a57f017885ca4e1fbab263ece353c473'; 

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather-info');
const forecastDiv = document.getElementById('forecast-info');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city !== '') {
      getWeather(city);
    }
  });
  
  function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        displayCurrentWeather(data);
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
      })
      .then(response => response.json())
      .then(data => {
        displayForecast(data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }