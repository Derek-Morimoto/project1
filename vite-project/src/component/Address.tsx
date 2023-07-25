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

  return address ? (
    <div>
      <p>City: {address.city}</p>
      <p>State: {address.state}</p>
    </div>
  ) : (
    <div>Loading user location...</div>
  );
};

export default UserLocation;
