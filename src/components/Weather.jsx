import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getLocationFromLocalStorage, getLocationFromIP, getLocationFromNavigator } from './getLocation';
import { callReverseGeocodingApi, callWeatherApi } from './apiCalls';
import { measureSystemContext, locationContext } from './context';
import ProgressiveLoading from './ProgressiveLoading';
import Background from './Background';
import TopBar from './TopBar';
import CurrentForecast from './CurrentForecast';
import HourlyForecast from './HourlyForecast';
import CurrentForecastExtra from './CurrentForecastExtra';
import DailyForecast from './DailyForecast';
import Footer from './Footer';

/**
 * triggers a toast notification with the specified title and message
 * @param {string} title 
 * @param {string} message 
 */
export const toaster = (title, message) => {
  toast.error(`${title}\n ${message}`, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
};

// eslint-disable-next-line react/prefer-stateless-function
class Weather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLocationResponseReady: false,
      isWeatherResponseReady: false,
      isReverseGeocodingResponseReady: false,
      isPreciseLocation: false,
      isLocationFromLocalStorage: null,
      isLocationFromGPS: null,
      isImperial: false,
      location: {
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        displayName: null,
        //id: null,
      },
      currentWeather: {
        temp: null,
        feelsLike: null,
        weatherMain: null,
        humidity: null,
        pressure: null,
        windSpeed: null,
        visibility: null,
        sunrise: null,
        sunset: null,
        icon: null,
      },
      hourlyWeather: [
        {
          temp: null,
          weatherMain: null,
          icon: null,
        },
      ],
      dailyWeather: [
        {
          temp: {
            day: null,
            night: null,
          },
          weatherMain: null,
          humidity: null,
          icon: null,
        },
      ],
    };
  }

  componentDidMount() {
    getLocationFromLocalStorage(this.updateLocationAndTriggerWeatherUpdate);
    this.handleMeasureSystemChange(null, false);
  }

  /**
   * updates the location in the state of the component and triggers weather update
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {boolean} isPreciseLocation 
   * @param {boolean} isFromLocalStorage
   */
  updateLocationAndTriggerWeatherUpdate = (latitude, longitude, isPreciseLocation, isLocationFromLocalStorage, isLocationFromGPS, city, country) => {
    this.setState({
      isLocationResponseReady: true,
      isPreciseLocation: isPreciseLocation,
      isLocationFromLocalStorage: isLocationFromLocalStorage,
      isLocationFromGPS: isLocationFromGPS,
      location: {
        latitude: latitude,
        longitude: longitude,
        city: city ? city : null,
        country: country ? country : null,
        displayName: `${city}, ${country}`,
      },
    });
    if (city && country) {
      this.setState({
        isReverseGeocodingResponseReady: true,
      });
    }

    // if the geocoordinates are new and they are not from IP geocoding, store them in the browser local storage
    if (isPreciseLocation && !isLocationFromLocalStorage) {
      window.localStorage.setItem('preciseLatitude', latitude);
      window.localStorage.setItem('preciseLongitude', longitude);
      window.localStorage.setItem('isLocationFromGPS', isLocationFromGPS);
      if (city) {
        window.localStorage.setItem('preciseCity', city);
      }
      if (country) {
        window.localStorage.setItem('preciseCountry', country);
      }
    }

    setTimeout(() => {
      this.updateWeatherAndLocationName(false);
    }, 1);
  }

  /**
   * updates the weather and place names (if needed) with the present geocoordinates in the component state
   */
  updateWeatherAndLocationName = () => {
    const { latitude, longitude, city, country } = this.state.location;
    callWeatherApi(this.handleWeatherResponse, latitude, longitude);
    // call the reverse geocoding api only if no data is already provided 
    if(!city || !country) {
      callReverseGeocodingApi(this.handleReverseGeocodingResponse, latitude, longitude);
    }
  }

  /**
   * processes the response from weather api and updates the state
   * @param {object} response 
   */
  handleWeatherResponse = (response) => {
    //  current weather object
    const { temp, feels_like, weather, humidity, pressure, visibility, wind_speed, sunrise, sunset } = response.data.current;
    const currentWeatherObject = {
      temp: temp,
      feelsLike: feels_like,
      weatherMain: weather[0].main,
      humidity: humidity,
      pressure: pressure,
      windSpeed: wind_speed,
      visibility: visibility,
      icon: weather[0].icon,
      sunrise: sunrise,
      sunset: sunset,
    };

    //  hourly weather array
    const hourlyWeatherArray = [];
    response.data.hourly.forEach(nthHour => {
      if (response.data.hourly.indexOf(nthHour) < 24) {
        const hour = {
          temp: nthHour.temp,
          weatherMain: nthHour.weather[0].main,
          icon: nthHour.weather[0].icon,
        };
        hourlyWeatherArray.push(hour);
      }
    });

    //  daily weather array
    const dailyWeatherArray = [];
    response.data.daily.forEach(nthDay => {
      if (response.data.daily.indexOf(nthDay) < 8) {
        const day = {
          temp: {
            day: nthDay.temp.day,
            night: nthDay.temp.night,
          },
          weatherMain: nthDay.weather[0].main,
          humidity: nthDay.humidity,
          icon: nthDay.weather[0].icon,
        };
        dailyWeatherArray.push(day);
      }
    });

    //  state update
    this.setState({
      isWeatherResponseReady: true,
      currentWeather: currentWeatherObject,
      hourlyWeather: hourlyWeatherArray,
      dailyWeather: dailyWeatherArray,
    });
  }

  /**
   * processes the response from reverse geocoding api and updates the state with the new location
   * @param {object} response 
   */
  handleReverseGeocodingResponse = (lat, lon, city, country) => {
    this.setState(
      {
        isReverseGeocodingResponseReady: true,
        location: {
          latitude: lat,
          longitude: lon,
          city: city,
          country: country,
          displayName: `${city}, ${country}`,
        },
      },
    );
    window.localStorage.setItem('preciseCity', city);
    window.localStorage.setItem('preciseCountry', country);
  }

  /**
   * If parameter userDefined is true, updates the component 
   * state with the imperial mode state passed and saves the preference in the local storage.
   * If no parameters are passed defines the imperial mode by the language preference of the browser, 
   * if no preference can be found in the local storage.
   * @param {boolean} isImperial 
   * @param {boolean} userDefined
   */
  handleMeasureSystemChange = (isImperial, userDefined) => {
    let isImp;
    if (userDefined) {
      isImp = isImperial;
      window.localStorage.setItem('isImperial', isImperial);
    } else {
      if (window.localStorage.isImperial) {
        isImp = (window.localStorage.isImperial == 'true') ? true : false; 
      } else {
        const lang = window.navigator.language;
        isImp = (lang == 'en-US' || lang == 'en-us') ? true : false;
      }
    }

    this.setState({
      isImperial: isImp,
    });
  }

  render() {
    const { isImperial, isPreciseLocation, isLocationFromLocalStorage, isLocationFromGPS, hourlyWeather, dailyWeather } = this.state;
    const { city, country } = this.state.location;
    const { temp, feelsLike, weatherMain, humidity, pressure, visibility, windSpeed, icon, sunrise, sunset } = this.state.currentWeather;
    const { isLocationResponseReady, isWeatherResponseReady, isReverseGeocodingResponseReady } = this.state;
    const isDataReady =  isLocationResponseReady && isWeatherResponseReady && isReverseGeocodingResponseReady;

    if (isDataReady) {
      return (
        <>
          <ToastContainer />
          <measureSystemContext.Provider value={{isImperial: isImperial, handler: this.handleMeasureSystemChange,}}>
            <locationContext.Provider 
            value={{
              isLocationFromLocalStorage: isLocationFromLocalStorage,
              isLocationFromGPS: isLocationFromGPS,
              locationFromNavigatorClickHandler: () => getLocationFromNavigator(this.updateLocationAndTriggerWeatherUpdate),
              onSearchLocationChange: this.updateLocationAndTriggerWeatherUpdate,
            }} 
            >
              <Background icon={icon} />
              <TopBar />
              <CurrentForecast
                city={city} country={country}
                temp={temp} feelsLike={feelsLike} main={weatherMain}
                icon={icon}
              />
              <HourlyForecast weather={hourlyWeather} />
              <CurrentForecastExtra
                humidity={humidity} pressure={pressure} visibility={visibility} windSpeed={windSpeed}
                sunrise={sunrise} sunset={sunset}
              />
              <DailyForecast weather={dailyWeather} />
              <Footer />
            </locationContext.Provider>
          </measureSystemContext.Provider>
        </>
      );
    } else {
      return (
          <>
            <ToastContainer />
            <ProgressiveLoading 
            isLocationResponseReady={isLocationResponseReady}
            isWeatherResponseReady={isWeatherResponseReady}
            isReverseGeocodingResponseReady={isReverseGeocodingResponseReady} 
            />
          </>
      );
    }
  }
}

export default Weather;
