import React, { useState, useEffect } from "react";
import axios from "axios";

const OPENWEATHER_API_KEY = "af65945d89a6e5e202f985e92e3d8e77";
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface AddressComponents {
  city: string;
  state: string;
}

interface Weather {
  main: string;
  description: string;
}

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Weather[];
}

interface Forecast {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: Weather[];
}

const WeatherApp: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [address, setAddress] = useState<AddressComponents | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
            setUserLocation(null);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const getUserAddress = async (latitude: number, longitude: number) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );

          const addressComponents = response.data.results[0].address_components;
          let city = "";
          let state = "";
          for (const component of addressComponents) {
            if (component.types.includes("locality")) {
              city = component.long_name;
            } else if (component.types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
          }

          setAddress({ city, state });
        } catch (error) {
          console.error("Error getting user address:", error);
        }
      };

      getUserAddress(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (address) {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${address.city}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          setWeatherData(response.data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [address]);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        if (address) {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${address.city}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          setForecastData(response.data.list);
        }
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [address]);

  return (
    <div className="weather-app">
      {address ? (
        <div className="location">
          <h1 className="location-name">
            {address.city}, {address.state}
          </h1>
          <p className="coordinates">
            Lat: {userLocation?.latitude}, Lon {userLocation?.longitude}
          </p>

          <div className="current-weather">
            <h2 className="weather-heading">Current Weather</h2>
            {weatherData && (
              <div className="weather-details">
                <p className="temperature">
                  {weatherData.main.temp} °C
                </p>
                <p className="weather-description">
                  {weatherData.weather[0].description}
                </p>
              </div>
            )}
          </div>

          <div className="forecast">
            <h2 className="weather-heading">5-Day Forecast</h2>
            <div className="forecast-details">
              {forecastData.map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <p className="date">{forecast.dt_txt}</p>
                  <p className="temperature">
                    {forecast.main.temp} °C
                  </p>
                  <p className="weather-description">
                    {forecast.weather[0].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">Loading user location...</div>
      )}
    </div>
  );
};

export default WeatherApp;
