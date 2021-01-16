import axios from 'axios';
import { toaster } from './Weather';

/**
 * connects to openWeatherMap api and sends back the response to the callback 
 * @param {Function} callback
 * @param {number} latitude
 * @param {number} longitude
 */
export const callWeatherApi = (callback, latitude, longitude) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&appid=997d9b54abada6ff84291820778b192d`)
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);
        callback(parsedJSON);
      })
      .catch(error => {
        toaster(error, 'Trying again...');
        if (callCount < 2) {
          setTimeout(() => {
            makeTheCall();
            callCount++;
          }, 1000);
        }
      });
  };
  makeTheCall();
};

/**
 * connects to locationIq reverse geocoding api and sends back the response to the callback
 * @param {Function} callback
 * @param {number} latitude
 * @param {number} longitude
 */
export const callReverseGeocodingApi = (callback, latitude, longitude) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://us1.locationiq.com/v1/reverse.php?key=pk.026f9b5e94ef539558116a8c355cd29f&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en&format=json`)
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);
        callback(parsedJSON);
      })
      .catch(error => {
        toaster(error, 'Trying again...');
        if (callCount < 2) {
          setTimeout(() => {
            makeTheCall();
            callCount++;
          }, 1000);
        }
      });
  };
  makeTheCall();
};
