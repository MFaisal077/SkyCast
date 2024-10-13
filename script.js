

    const apiKey = 'fe7c732d7758c51322c4f7bc6851eb56';
   
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    
   
    async function getWeather() {
        const city = document.getElementById('city').value;
        if (!city) {
            displayError('Please enter a city name');
            return;
        }
        fetchWeatherData(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    }
    
    
    function getWeatherByLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            }, () => displayError('Unable to retrieve your location'));
        } else {
            displayError('Geolocation is not supported by this browser');
        }
    }
    
    
    async function fetchWeatherData(url) {
        document.getElementById('loading').style.display = 'block'; // Show loading
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();
            displayWeatherData(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        } catch (error) {
            displayError(error.message);
        } finally {
            document.getElementById('loading').style.display = 'none'; // Hide loading
        }
    }
    
    
    function displayWeatherData(data) {
        document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById('temp-div').innerHTML = `${data.main.temp} °C`;
        document.getElementById('weather-info').innerHTML = `${data.weather[0].description}`;
        document.getElementById('extra-info').innerHTML = `
            Humidity: ${data.main.humidity}%<br>
            Wind Speed: ${data.wind.speed} m/s<br>
            Pressure: ${data.main.pressure} hPa
        `;
        document.getElementById('error-message').innerHTML = '';
    }
    
    
    async function fetchForecast(lat, lon) {
        const forecastResponse = await fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();
        displayHourlyForecast(forecastData);
        displayDailyForecast(forecastData);
    }
    
    
    function displayHourlyForecast(data) {
        const hourlyContainer = document.getElementById('hourly-forecast');
        hourlyContainer.innerHTML = ''; 
    
        for (let i = 0; i < 8; i++) { 
            const forecast = data.list[i];
            const time = new Date(forecast.dt_txt).getHours() + ':00';
            hourlyContainer.innerHTML += `
                <div class="forecast-item">
                    <strong>${time}</strong><br>
                    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
                    <br>${forecast.main.temp} °C
                </div>
            `;
        }
    }
    
   
    function displayDailyForecast(data) {
        const dailyContainer = document.getElementById('daily-forecast');
        dailyContainer.innerHTML = ''; // Clear previous forecast
        const days = {};
    
        
        data.list.forEach(item => {
            const date = new Date(item.dt_txt).toDateString();
            if (!days[date]) {
                days[date] = item;
            }
        });
    
      
        Object.keys(days).slice(0, 5).forEach(date => {
            const forecast = days[date];
            dailyContainer.innerHTML += `
                <div class="forecast-item">
                    <strong>${date}</strong><br>
                    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
                    <br>${forecast.main.temp} °C
                </div>
            `;
        });
    }
    
   
    function displayError(message) {
        document.getElementById('error-message').innerHTML = message;
    }
     