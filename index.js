
const weatherform = document.querySelector(".weatherform");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const sunnyVideo = document.getElementById("sunny-video");
const rainVideo = document.getElementById("Rainy-video");
const cloudVideo = document.getElementById("cloud-video");
const snowVideo = document.getElementById("snow-video");
const fogVideo = document.getElementById("fog-video");
const firstVideo = document.getElementById("first-video");
const apikey = "75f84d4b2c905d2799669ef7364c8ea5";


// Handle form submission
weatherform.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city.");
    }
});

// Fetch weather data by city name
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch the data.");
    }
    return await response.json();
}

// Display weather information
function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    // Handle video display based on weather condition
    switch (true) {
        case (id === 800): // Clear sky
            fadeIn(sunnyVideo);
            fadeOut(rainVideo, cloudVideo, snowVideo, fogVideo,firstVideo);
            break;
        case (id >= 200 && id < 600): // Rainy weather
            fadeIn(rainVideo);
            fadeOut(sunnyVideo, cloudVideo, snowVideo, fogVideo,firstVideo);
            break;
        case (id >= 600 && id < 700): // Snowy weather
            fadeIn(snowVideo);
            fadeOut(sunnyVideo, rainVideo, cloudVideo, fogVideo,firstVideo);
            break;
        case (id >= 700 && id < 800): // Foggy weather
            fadeIn(fogVideo);
            fadeOut(sunnyVideo, rainVideo, cloudVideo, snowVideo,firstVideo);
            break;
        case (id >= 801): // Cloudy weather
            fadeIn(cloudVideo);
            fadeOut(sunnyVideo, rainVideo, snowVideo, fogVideo,firstVideo);
            break;
        default:
            fadeIn(firstVideo);
            fadeOut(cloudVideo,sunnyVideo, rainVideo, snowVideo, fogVideo);
    }
}


// Get weather emoji based on weather ID
function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
        case (weatherId >= 300 && weatherId < 400):
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️"; // Rain or drizzle
        case (weatherId >= 600 && weatherId < 700):
            return "❄️"; // Snow
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; // Mist or fog
        case (weatherId === 800):
            return "🌞"; // Clear sky
        case (weatherId >= 801 && weatherId < 810):
            return "☁️"; // Cloudy
        default:
            return "❓"; // Unknown weather
    }
}

// Display error message
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

// Fade in an element
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = "block";
    let opacity = 0;
    const interval = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(interval);
        }
        element.style.opacity = opacity;
        opacity += 0.1;
    }, 30);
}

// Fade out an element
function fadeOut(...elements) {  // Use rest parameter to accept multiple elements
    elements.forEach(element => {
        let opacity = 1;
        const interval = setInterval(() => {
            if (opacity <= 0) {
                clearInterval(interval);
                element.style.display = "none";
            }
            element.style.opacity = opacity;
            opacity -= 0.1;
        }, 10);
    });
}