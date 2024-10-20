import { useState } from "react";

function Weather() {
    const API_KEY = process.env.REACT_APP_WEATHER_KEY;
    console.log(process.env.REACT_APP_WEATHER_KEY);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const getWeatherByCurrentLocation = async (lat, lon) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        setLoading(true);
        let response = await fetch(url);
        let data = await response.json();
        setWeather(data);
        setLoading(false);
        console.log("현재 날씨는?", data);
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            console.log("현재 위치는?", lat, lon);

            getWeatherByCurrentLocation(lat, lon);
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "300px",
                justifyContent: "space-evenly",
            }}
        >
            <div>
                <h1>Weather App</h1>
                <button onClick={getCurrentLocation} style={{ color: "black", border: "1px solid black" }}>
                    {loading ? "Loading..." : "Get Current Location Weather"}
                </button>
            </div>

            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>{weather.weather[0].description}</p>
                    <p>{Math.round(weather.main.temp)}°C</p>
                </div>
            )}
        </div>
    );
}

export default Weather;
