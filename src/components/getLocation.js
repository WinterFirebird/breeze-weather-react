import axios from 'axios';

/**
 * connects to ipapi.co api returning geocoordinates from client ip address to the callback
 * @param {Function} callback 
 */
export const getLocationFromIP = (callback) => {
  axios.get('https://ipapi.co/json/')
    .then(response => {
      const { latitude, longitude } = response.data;
      callback(latitude, longitude, false);
    })
    .catch(error => {
      console.log(`Error happened while calling the API: \n ${error}`);
    });
};

/**
 * connects to ipapi.co api returning geocoordinates from the Navigator API to the callback
 * @param {Function} callback 
 */
export const getLocationFromNavigator = (callback) => {
  const navigatorResponseHandler = (responseFromNavigator) => {
    const { latitude, longitude } = responseFromNavigator.coords;
    callback(latitude, longitude, true);
  };
  window.navigator.geolocation.getCurrentPosition(navigatorResponseHandler);
};
