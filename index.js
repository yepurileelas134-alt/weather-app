// index.js
import axios from "axios";

const city = process.argv[2]?.trim();

if (!city) {
  console.log("❌ Please provide a city name, e.g.: node index.js London...");
  process.exit(1);
}

async function getWeather(city) {
  try {
    // Geocoding
    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    const results = geoResponse.data.results;

    if (!results || results.length === 0) {
      console.log("❌ Could not find that city. Please try another name.");
      return;
    }

    const { latitude, longitude, name } = results[0];

    // Weather
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          current_weather: true,
        },
      }
    );

    const current = weatherResponse.data.current_weather;
    const temperature = current.temperature;
    const windspeed = current.windspeed;
    const weathercode = current.weathercode;

    // Map weather codes to description
    const weatherCodesMap = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Dense",
      56: "Freezing Drizzle: Light",
      57: "Freezing Drizzle: Dense",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy",
      66: "Freezing Rain: Light",
      67: "Freezing Rain: Heavy",
      71: "Snow fall: Slight",
      73: "Snow fall: Moderate",
      75: "Snow fall: Heavy",
      77: "Snow grains",
      80: "Rain showers: Slight",
      81: "Rain showers: Moderate",
      82: "Rain showers: Violent",
      85: "Snow showers: Slight",
      86: "Snow showers: Heavy",
      95: "Thunderstorm: Slight or moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    const description = weatherCodesMap[weathercode] || "Unknown";

    console.log(
      `🌤 Weather in ${name} (lat: ${latitude}, lon: ${longitude}): ${temperature}°C, ${description}, wind speed: ${windspeed} km/h`
    );
  } catch (error) {
    console.error(
      "❌ Could not fetch weather. Check city name or internet connection."
    );
    console.error("Details:", error.message);
  }
}

getWeather(city);
