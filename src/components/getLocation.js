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
    // setTimeout(callback(52.229675, 21.012230, true), 4000)
  };
  window.navigator.geolocation.getCurrentPosition(navigatorResponseHandler);
};
