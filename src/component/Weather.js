import { useState } from "react";
import styles from "./Weather.module.css";  // CSS 모듈 import

function Weather() {
    const API_KEY = process.env.REACT_APP_WEATHER_KEY;
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const getWeatherByCurrentLocation = async (lat, lon) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
        setLoading(true);
        let response = await fetch(url);
        let data = await response.json();
        setWeather(data);
        setLoading(false);
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            getWeatherByCurrentLocation(lat, lon);
        });
    };

    return (
        <div className={styles['weather-container']}>
            <h1 className={styles['weather-container-h1']}>날씨 정보</h1>


            {weather && (
                <div className={styles['weather-info']}>
                    <h2 className={styles['weather-title']}>&#91; {weather.name} &#93;</h2>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                        className={styles['weather-icon']}
                    />
                    <div className={styles['weather-detail']}> 
                    <h3 className={styles['weather-temp']}>{Math.round(weather.main.temp)}°C</h3>
                    <h3 className={styles['weather-description']}>| {weather.weather[0].description}</h3>
                    </div>
                </div>
            )}
            <div>
                <button className={styles['weather-button']} onClick={getCurrentLocation}>
                    {loading ? "Loading..." : "날씨 정보 가져오기"}
                </button>
            </div>
        </div>
    );
}

export default Weather;
