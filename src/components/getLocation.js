import axios from 'axios';
import { toaster } from './Weather';

/**
 * connects to navigator api returning geocoordinates  to the callback
 * @param {Function} callback;
 */
export const getLocationFromNavigator = (callback) => {
  const navigatorResponseHandler = (responseFromNavigator) => {
    const { latitude, longitude } = responseFromNavigator.coords;
    callback(latitude, longitude, true);
  };
  window.navigator.geolocation.getCurrentPosition(navigatorResponseHandler);
};

/**
 * connects to ipapi.co api returning geocoordinates from client ip address to the callback,
 * calls the navigator api if fails
 * @param {Function} callback
 */
export const getLocationFromIP = (callback) => {
  let callCount = 0;
  const makeTheCall = () => {
    axios.get('https://ipapi.co/json/')
      .then(response => {
        let parsedJSON;
        if (typeof response === 'object') parsedJSON = response;
        if (typeof response === 'string') parsedJSON = JSON.parse(response);

        try {
          const { latitude, longitude } = parsedJSON.data;
          if (latitude && longitude) {
            callback(latitude, longitude, false);
          } else {
            throw 'Error: cannot derive location from IP address...';
          }
        } catch (err) {
          toaster(err, 'trying to get precise location');
          getLocationFromNavigator(callback);
        }
      })
      .catch(error => {
        if (callCount < 2) {
          toaster(error, 'Trying again...');
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
 * returns the geocoordinates from the local storage, 
 * calls ipapi.co api on failure 
 * @param {Function} callback 
 */
export const getLocationFromLocalStorage = (callback) => {
  const { preciseLatitude, preciseLongitude, preciseCity, preciseCountry } = window.localStorage;
  if (preciseLatitude && preciseLongitude) {
    setTimeout(() => callback(preciseLatitude, preciseLongitude, true, true, preciseCity, preciseCountry), 1);
  } else {
    getLocationFromIP(callback);
  }
}