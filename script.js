const apiKey = "bd56f35d837bb03e6d31239acbe065da";

// Fetch and display weather data
function searchWeather() {
    const location = document.getElementById("locationSearch").value;

    if (!location) {
        alert("Please enter a location.");
        return;
    }

    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching current weather data.");
            }
            return response.json();
        })
        .then(data => {
            // Display current weather data
            document.getElementById("location").innerText = `Location: ${data.name}`;
            document.getElementById("temperature").innerText = `${data.main.temp}°C`;
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("humidity").innerText = `${data.main.humidity}%`;
            document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
            document.getElementById("windDirection").innerText = `${data.wind.deg}°`;
            document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;

            // Update weather icon
            const weatherIcon = document.getElementById("weatherIcon");
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
            weatherIcon.style.display = "block";

            // Fetch 5-day forecast
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Could not fetch weather. Please try again.");
        });
}

// Fetch and display 5-day forecast
function fetchForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching forecast data.");
            }
            return response.json();
        })
        .then(data => {
            const forecastDisplay = document.getElementById("forecastDisplay");
            forecastDisplay.innerHTML = ""; // Clear previous forecast

            const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Use midday data
            dailyForecasts.forEach(item => {
                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecast-item");
                forecastItem.innerHTML = `
                    <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                    <p>${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                `;
                forecastDisplay.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            alert("Could not fetch forecast data.");
        });
}

// Fetch location-based weather on page load
function fetchLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude: lat, longitude: lon } = position.coords;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        // Update weather data
                        document.getElementById("location").innerText = `Location: ${data.name}`;
                        document.getElementById("temperature").innerText = `${data.main.temp}°C`;
                        document.getElementById("description").innerText = data.weather[0].description;
                        document.getElementById("humidity").innerText = `${data.main.humidity}%`;
                        document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
                        document.getElementById("windDirection").innerText = `${data.wind.deg}°`;
                        document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;

                        // Update weather icon
                        const weatherIcon = document.getElementById("weatherIcon");
                        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                        weatherIcon.alt = data.weather[0].description;
                        weatherIcon.style.display = "block";

                        // Fetch 5-day forecast
                        fetchForecast(data.coord.lat, data.coord.lon);
                    } else {
                        alert("Weather data not available for your location.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching location weather:", error);
                });
        },
        error => {
            console.error("Error getting geolocation:", error);
            alert("Could not get your location.");
        }
    );
}


// Update current time every second
function updateTime() {
    const timeElement = document.getElementById("current-time");
    const currentDate = new Date();
    timeElement.innerText = currentDate.toLocaleTimeString();
}

// Initialize
setInterval(updateTime, 1000); // Update time every second
window.onload = fetchLocationWeather;
