const apiKey = '5d3c33dbef6d232c009f2daac1a57188';
const searchInput = document.getElementById('city-search');
const currentLocationBtn = document.getElementById('current-location');
const forecastDisplay = document.getElementById('forecast-display');
const recentCitiesDropdown = document.querySelector('.recent-cities');
const currentTemperature = document.getElementById('current-temperature');
const weatherDescription = document.getElementById('weather-description');
const dateLocation = document.getElementById('date-location');
const currentTimeElement = document.getElementById('current-time');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const feelsLike = document.getElementById('feels-like');
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');

let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Event listener for city search with suggestions
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        getCitySuggestions(query);
    } else {
        updateRecentCitiesDropdown();
        recentCitiesDropdown.classList.remove('hidden');
    }
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
        getCitySuggestions(searchInput.value.trim());
    } else {
        updateRecentCitiesDropdown();
        recentCitiesDropdown.classList.remove('hidden');
    }
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => recentCitiesDropdown.classList.add('hidden'), 150);
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherDataByCoords(latitude, longitude);
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function getWeatherData(city) {
    if (!city) {
        alert('Please enter a valid city name');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert('City not found');
                return;
            }
            displayCurrentWeather(data);
            addRecentCity(city);
            getExtendedForecast(data.coord.lat, data.coord.lon);
            searchInput.value = ''; // Clear search input after successful search
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function getWeatherDataByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            addRecentCity(data.name);
            getExtendedForecast(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayCurrentWeather(data) {
    currentTemperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    // dateLocation.textContent = `${data.name}, ${new Date().toLocaleDateString()}`;
     // Format the date to Indian format (dd/mm/yyyy)
     const currentDate = new Date();
     const day = formatTime(currentDate.getDate()); // Get day
     const month = formatTime(currentDate.getMonth() + 1); // Get month (0-indexed, so add 1)
     const year = currentDate.getFullYear(); // Get full year
     dateLocation.textContent = `${day}/${month}/${year}, ${data.name}`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${data.visibility / 1000} km`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    windSpeed.textContent = `${data.wind.speed} m/s`;

  // Function to format time with leading zeros
function formatTime(unit) {
  return unit < 10 ? '0' + unit : unit;
}

// Function to get the day name
function getDayName(dayIndex) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
}

// Function to update the current time dynamically
function updateCurrentTime() {
  const now = new Date();
  const dayName = getDayName(now.getDay()); // Get day name
  let hours = now.getHours();
  const minutes = formatTime(now.getMinutes());
  const seconds = formatTime(now.getSeconds());

  // Determine AM or PM and convert to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert hour '0' to '12' for 12-hour format

  currentTimeElement.textContent = `${dayName}, ${formatTime(hours)}:${minutes}:${seconds} ${ampm}`;
}

// Start the time update interval
setInterval(updateCurrentTime, 1000);
    // Sunrise & Sunset
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    sunriseTime.textContent = `${sunrise.getHours()}:${sunrise.getMinutes()} AM`;
    sunsetTime.textContent = `${sunset.getHours()}:${sunset.getMinutes()} PM`;
}

function getExtendedForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayForecast(data) {
    forecastDisplay.innerHTML = '';
    const dailyData = data.list.filter((reading, index) => index % 8 === 0);
    dailyData.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.classList.add('p-4', 'bg-gray-700', 'rounded');
        
        dayElem.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].description}</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;
        
        forecastDisplay.appendChild(dayElem);
    });
}

// Fetch city suggestions from the OpenWeatherMap Geocoding API
function getCitySuggestions(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCitySuggestions(data);
        })
        .catch(error => {
            console.error('Error fetching city suggestions:', error);
        });
}

// Display city suggestions in the dropdown
function displayCitySuggestions(suggestions) {
    recentCitiesDropdown.innerHTML = '';
    suggestions.forEach(city => {
        const cityElem = document.createElement('div');
        cityElem.classList.add('p-2', 'hover:bg-gray-600', 'cursor-pointer');
        cityElem.textContent = `${city.name}, ${city.country}`;
        cityElem.addEventListener('click', () => {
            searchInput.value = city.name;
            recentCitiesDropdown.classList.add('hidden');
            getWeatherData(city.name);
        });
        recentCitiesDropdown.appendChild(cityElem);
    });
    recentCitiesDropdown.classList.remove('hidden');
}

function addRecentCity(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        if (recentCities.length > 5) recentCities.pop();
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    updateRecentCitiesDropdown();
}

function updateRecentCitiesDropdown() {
    recentCitiesDropdown.innerHTML = '';
    recentCities.forEach(city => {
        const cityElem = document.createElement('div');
        cityElem.classList.add('p-2', 'hover:bg-gray-600', 'cursor-pointer');
        cityElem.textContent = city;
        cityElem.addEventListener('click', () => {
            getWeatherData(city);
        });
        recentCitiesDropdown.appendChild(cityElem);
    });
}

// Initial Load
updateRecentCitiesDropdown();
