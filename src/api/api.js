import axios from 'axios';
import { toaster } from '../components/Weather';
import { countryNameToCode } from '../utils/countryNames'

const OPEN_WEATHER_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;

/**
 * connects to openWeatherMap api and sends back the response to the callback 
 * @param {Function} callback
 * @param {number} latitude
 * @param {number} longitude
 */
export const callWeatherApi = (callback, latitude, longitude) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&appid=${OPEN_WEATHER_KEY}`)
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
    axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`)
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
 * makes the query more precise, if gets a comma separeted city and country as an argument 
 * @param {Function} callback 
 * @param {string} query 
 */
export const callDirectGeocodingApi  = (callback, query) => {
  let callCount = 0;
  let apiQuery = (() => {
    if (query.includes(',')) {
      const [ cityName, countryName ] = query.split(',');
      console.log(cityName, countryName);
      let countryCode = countryNameToCode(countryName);
      return cityName + ',' + countryCode;
    } else return query;
  })();
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${apiQuery}&limit=5&appid=${OPEN_WEATHER_KEY}`)
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);
        callback(parsedJSON);
      })
      .catch(err => {
        console.log(err);
      });
  };
  makeTheCall();
};
