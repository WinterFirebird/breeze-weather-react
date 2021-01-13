import axios from 'axios';

/**
 * connects to openWeatherMap api and sends back the response to the callback 
 * @param {Function} callback 
 * @param {number} latitude 
 * @param {number} longitude 
 */
export const callWeatherApi = (callback, latitude, longitude) => {
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&appid=997d9b54abada6ff84291820778b192d`)
    .then(response => callback(response))
    .catch(error => {
      console.log(`Error happened while calling the API: \n ${error}`)
    });
};

/**
 * connects to locationIq reverse geocoding api and sends back the response to the callback
 * @param {Function} callback 
 * @param {number} latitude 
 * @param {number} longitude 
 */
export const callReverseGeocodingApi = (callback, latitude, longitude) => {
  axios.get(`https://us1.locationiq.com/v1/reverse.php?key=pk.026f9b5e94ef539558116a8c355cd29f&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en&format=json`)
    .then(response => callback(response))
    .catch(error => {
      console.log(`Error happened while calling the API: \n ${error}`)
    });
};
