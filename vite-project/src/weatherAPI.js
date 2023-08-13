import axios from 'axios';

const API_KEY = C10IZnO5vBA7OZmhuOmryYHsrsyEe5yx;
const BASE_URL = 'http://dataservice.accuweather.com/currentconditions/v1/';

export async function getWeatherData(locationKey) {
  try {
    const response = await axios.get(`${BASE_URL}${locationKey}`, {
      params: {
        apikey: API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data');
  }
}
