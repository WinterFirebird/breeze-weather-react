import React, { Component } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { getLocationFromLocalStorage, getLocationFromIP, getLocationFromNavigator } from './getLocation';
import { callReverseGeocodingApi, callWeatherApi } from './apiCalls';
import { measureSystemContext, locationContext } from './context';
import CustomLoader from './CustomLoader';
import Background from './Background';
import CurrentWeatherWidget from './CurrentWeatherWidget';
import CurrentWeatherExtraWidget from './CurrentWeatherExtraWidget';
import HourlyWeatherWidget from './HourlyWeatherWidget';
import DailyWeatherWidget from './DailyWeatherWidget';
import CitySearch from './CitySearch';
import TopBar from './TopBar';

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
      isImperial: false,
      location: {
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        displayName: null,
        id: null,
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
    getLocationFromLocalStorage(this.updateLocationAndWeather);
    this.handleMeasureSystemChange(null, false);
  }

  /**
   * updates the location in the state of the component and triggers weather update
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {boolean} isPreciseLocation 
   * @param {boolean} isFromLocalStorage
   */
  updateLocationAndWeather = (latitude, longitude, isPreciseLocation, isFromLocalStorage) => {
    this.setState({
      isLocationResponseReady: true,
      isPreciseLocation: isPreciseLocation,
      isLocationFromLocalStorage: isFromLocalStorage,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
    });

    // if the geocoordinates are new, store them in the browser local storage
    if (isPreciseLocation && !isFromLocalStorage) {
      window.localStorage.setItem('preciseLatitude', latitude);
      window.localStorage.setItem('preciseLongitude', longitude);
    }

    setTimeout(() => {
      this.updateWeather(false);
    }, 1);
  }

  /**
   * updates the weather and place names with the present geocoordinates in the component state
   */
  updateWeather = () => {
    const { latitude, longitude } = this.state.location;
    callWeatherApi(this.handleWeatherResponse, latitude, longitude);
    callReverseGeocodingApi(this.handleReverseGeocodingResponse, latitude, longitude);
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
    // const { lat, lon, address, display_name } = response.data;

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
    const { isImperial, isPreciseLocation, isLocationFromLocalStorage, hourlyWeather, dailyWeather } = this.state;
    const { city, country } = this.state.location;
    const { temp, feelsLike, weatherMain, humidity, pressure, visibility, windSpeed, icon, sunrise, sunset } = this.state.currentWeather;
    const { isLocationResponseReady, isWeatherResponseReady, isReverseGeocodingResponseReady } = this.state;

    if (isLocationResponseReady && isWeatherResponseReady && isReverseGeocodingResponseReady) {
      return (
        <>
          <ToastContainer />
          <measureSystemContext.Provider value={{isImperial: isImperial, handler: this.handleMeasureSystemChange,}}>
            <locationContext.Provider 
            value={{isPreciseLocation: isPreciseLocation, 
              isFromLocalStorage: isLocationFromLocalStorage,
              locationFromNavigatorClickHandler: () => getLocationFromNavigator(this.updateLocationAndWeather),
              onSearchLocationChange: this.updateLocationAndWeather,
            }} 
            >
              <Background icon={icon} />
              {/* <CitySearch locationChangeCallback={this.updateLocationAndWeather} /> */}
              <TopBar />
              <CurrentWeatherWidget
                city={city} country={country}
                temp={temp} feelsLike={feelsLike} main={weatherMain}
                icon={icon}
              />
              <HourlyWeatherWidget weather={hourlyWeather} />
              <CurrentWeatherExtraWidget
                humidity={humidity} pressure={pressure} visibility={visibility} windSpeed={windSpeed}
                sunrise={sunrise} sunset={sunset}
              />
              <DailyWeatherWidget weather={dailyWeather} />
            </locationContext.Provider>
          </measureSystemContext.Provider>
        </>
      );
    } else {
      return (
          <>
            <ToastContainer />
            <CustomLoader 
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
