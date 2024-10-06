const apiKey = 'fe7c732d7758c51322c4f7bc6851eb56';
const weatherInfoDiv = document.getElementById('weatherInfo');
const weatherCity = document.getElementById('weatherCity');
const weatherDescription = document.getElementById('weatherDescription');
const temperature = document.getElementById('temperature');

document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Please enter a city name');
    } else {
        getWeather(city);
    }
});

async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    weatherCity.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;

    weatherInfoDiv.style.display = 'block';
}
