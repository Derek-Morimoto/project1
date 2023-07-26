import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface AddressComponents {
  city: string;
  state: string;
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

const UserLocation: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [address, setAddress] = useState<AddressComponents | null>(null);

  useEffect(() => {
    // Function to fetch user location using Geolocation API
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

  // Function to get the user's city and state using Google Maps API
  const getUserAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCacmRJcKR4bTsQbhE8V2kSQ3e9okKOFSE`
      );

      // Process the response and extract the city and state from the address components
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

  useEffect(() => {
    if (userLocation) {
      // Call the function to get the user's city and state once we have the location
      getUserAddress(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  //Getting Weather at current location
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const apiKey = "db81248686af3c0e32044815746cde22";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (address) {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${address.city}&appid=${apiKey}&units=metric`
          );
          setWeatherData(response.data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [address]);

  return address ? (
    <div>
      <p>
        City: {address.city}, {address.state} <br></br>
        Lat: {userLocation?.latitude}, Lon {userLocation?.longitude} <br></br>
        <h2>Weather in {address.city}</h2>
        <p>Temperature: {weatherData?.main.temp} °C</p>
        <p>Weather: {weatherData?.weather[0].description}</p>
      </p>
    </div>
  ) : (
    <div>Loading user location...</div>
  );
};

export default UserLocation;
