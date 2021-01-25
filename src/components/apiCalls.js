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
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&appid=62aeb57d7356a18463b4c79abdcdab58`)
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
 * connects to openweathermap reverse geocoding api and sends back the response to the callback
 * @param {Function} callback
 * @param {number} latitude
 * @param {number} longitude
 */
export const callReverseGeocodingApi = (callback, latitude, longitude) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=62aeb57d7356a18463b4c79abdcdab58`)
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);

        const { name, country, lat, lon } = parsedJSON.data[0];
        callback(lat, lon, name, country);
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
 * searches for locations given a string and send back the response to the callback
 * @param {Function} callback 
 * @param {string} name 
 */
export const callDirectGeocodingApi  = (callback, name) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=4&appid=62aeb57d7356a18463b4c79abdcdab58`)
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);
        callback(parsedJSON);
      })
      .catch(error => {
      });
  };
  makeTheCall();
};
