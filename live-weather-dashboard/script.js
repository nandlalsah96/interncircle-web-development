/* =========================================
   WEATHERLY - LIVE WEATHER DASHBOARD
   Uses Open-Meteo APIs
   ========================================= */


/* ---------- API URLS ---------- */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* ---------- DOM ELEMENTS ---------- */

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const message =
    document.getElementById("message");

const loading =
    document.getElementById("loading");

const weatherContent =
    document.getElementById("weatherContent");

const emptyState =
    document.getElementById("emptyState");

const locationName =
    document.getElementById("locationName");

const locationDetails =
    document.getElementById("locationDetails");

const weatherIcon =
    document.getElementById("weatherIcon");

const currentTemperature =
    document.getElementById("currentTemperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const forecastGrid =
    document.getElementById("forecastGrid");

const updatedTime =
    document.getElementById("updatedTime");


/* =========================================
   WEATHER CODE INFORMATION
   ========================================= */

const weatherCodes = {

    0: {
        description: "Clear sky",
        icon: "☀️"
    },

    1: {
        description: "Mainly clear",
        icon: "🌤️"
    },

    2: {
        description: "Partly cloudy",
        icon: "⛅"
    },

    3: {
        description: "Overcast",
        icon: "☁️"
    },

    45: {
        description: "Foggy",
        icon: "🌫️"
    },

    48: {
        description: "Rime fog",
        icon: "🌫️"
    },

    51: {
        description: "Light drizzle",
        icon: "🌦️"
    },

    53: {
        description: "Moderate drizzle",
        icon: "🌦️"
    },

    55: {
        description: "Dense drizzle",
        icon: "🌧️"
    },

    61: {
        description: "Light rain",
        icon: "🌦️"
    },

    63: {
        description: "Moderate rain",
        icon: "🌧️"
    },

    65: {
        description: "Heavy rain",
        icon: "🌧️"
    },

    71: {
        description: "Light snow",
        icon: "🌨️"
    },

    73: {
        description: "Moderate snow",
        icon: "❄️"
    },

    75: {
        description: "Heavy snow",
        icon: "❄️"
    },

    80: {
        description: "Rain showers",
        icon: "🌦️"
    },

    81: {
        description: "Moderate showers",
        icon: "🌧️"
    },

    82: {
        description: "Heavy showers",
        icon: "⛈️"
    },

    95: {
        description: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "Thunderstorm with hail",
        icon: "⛈️"
    },

    99: {
        description: "Heavy thunderstorm",
        icon: "⛈️"
    }

};


/* =========================================
   SEARCH EVENT
   ========================================= */

searchForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();


    /* Validate input */

    if (city === "") {

        showError(
            "Please enter a city name."
        );

        cityInput.focus();

        return;

    }


    if (city.length < 2) {

        showError(
            "Please enter at least 2 characters."
        );

        cityInput.focus();

        return;

    }


    getWeather(city);

});


/* =========================================
   GET WEATHER
   ========================================= */

async function getWeather(city) {

    try {

        setLoading(true);

        clearError();


        /* ------------------------------
           STEP 1: FIND CITY
           ------------------------------ */

        const locationUrl =
            `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const locationResponse =
            await fetch(locationUrl);


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to search for this city."
            );

        }


        const locationData =
            await locationResponse.json();


        /* Check whether city exists */

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                `No city found for "${city}".`
            );

        }


        const location =
            locationData.results[0];


        /* ------------------------------
           STEP 2: GET WEATHER
           ------------------------------ */

        const weatherUrl =
            `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;


        const weatherResponse =
            await fetch(weatherUrl);


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const weatherData =
            await weatherResponse.json();


        /* ------------------------------
           STEP 3: DISPLAY DATA
           ------------------------------ */

        displayWeather(
            location,
            weatherData
        );


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );


    } finally {

        setLoading(false);

    }

}


/* =========================================
   DISPLAY WEATHER
   ========================================= */

function displayWeather(
    location,
    weatherData
) {

    const current =
        weatherData.current;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    /* ---------- LOCATION ---------- */

    locationName.textContent =
        location.name;


    const region =
        location.admin1
            ? `${location.admin1}, `
            : "";


    locationDetails.textContent =
        `${region}${location.country}`;


    /* ---------- CURRENT WEATHER ---------- */

    weatherIcon.textContent =
        weatherInfo.icon;


    currentTemperature.textContent =
        Math.round(
            current.temperature_2m
        );


    weatherDescription.textContent =
        weatherInfo.description;


    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* ---------- FORECAST ---------- */

    displayForecast(
        weatherData.daily
    );


    /* ---------- UPDATED TIME ---------- */

    updatedTime.textContent =
        `Updated ${formatTime(
            new Date()
        )}`;


    /* ---------- SHOW CONTENT ---------- */

    weatherContent.hidden = false;

    emptyState.hidden = true;

}


/* =========================================
   DISPLAY 5-DAY FORECAST
   ========================================= */

function displayForecast(daily) {

    forecastGrid.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const date =
            new Date(
                daily.time[i] + "T12:00:00"
            );


        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const card =
            document.createElement("article");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <p class="forecast-day">
                ${getDayName(date)}
            </p>

            <div class="forecast-icon">
                ${weatherInfo.icon}
            </div>

            <p class="forecast-description">
                ${weatherInfo.description}
            </p>

            <div class="forecast-temperatures">

                <span class="forecast-high">
                    ${Math.round(
                        daily.temperature_2m_max[i]
                    )}°
                </span>

                <span class="forecast-low">
                    ${Math.round(
                        daily.temperature_2m_min[i]
                    )}°
                </span>

            </div>

        `;


        forecastGrid.appendChild(card);

    }

}


/* =========================================
   GET WEATHER INFORMATION
   ========================================= */

function getWeatherInfo(code) {

    return (
        weatherCodes[code] || {
            description: "Unknown",
            icon: "🌡️"
        }
    );

}


/* =========================================
   GET DAY NAME
   ========================================= */

function getDayName(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );

}


/* =========================================
   FORMAT TIME
   ========================================= */

function formatTime(date) {

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================
   LOADING STATE
   ========================================= */

function setLoading(isLoading) {

    loading.hidden =
        !isLoading;


    if (isLoading) {

        weatherContent.hidden = true;

        emptyState.hidden = true;

        searchButton.disabled = true;

        searchButton.textContent =
            "Loading...";

    } else {

        searchButton.disabled = false;

        searchButton.textContent =
            "Search";

    }

}


/* =========================================
   ERROR MESSAGE
   ========================================= */

function showError(errorText) {

    message.textContent =
        errorText;

}


function clearError() {

    message.textContent = "";

}


/* =========================================
   INITIAL SEARCH
   ========================================= */

cityInput.value = "Coimbatore";

getWeather("Coimbatore");