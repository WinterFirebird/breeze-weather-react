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
 * connects to locationIq reverse geocoding api and sends back the response to the callback
 * @param {Function} callback
 * @param {number} latitude
 * @param {number} longitude
 */
export const callOldReverseGeocodingApi = (callback, latitude, longitude) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://us1.locationiq.com/v1/reverse.php?key=pk.6d9d601ba728b5fc00e6570b660e1496&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en&format=json`)
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
  // callDirectGeocodingApi('Yerevan');
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=62aeb57d7356a18463b4c79abdcdab58`)
      .then(response => {
        // console.log(response)
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



export const callDirectGeocodingApi  = (callback, name) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=4&appid=62aeb57d7356a18463b4c79abdcdab58`)
      .then(response => {
        // console.log(response)
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);
        callback(parsedJSON);

        // const { name, country, lat, lon } = parsedJSON.data[0];
        // callback(lat, lon, name, country);
      })
      .catch(error => {
      });
  };
  makeTheCall();
};
