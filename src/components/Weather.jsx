import React, { Component } from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import { getLocationFromIP, getLocationFromNavigator } from './getLocation';
import { callReverseGeocodingApi, callWeatherApi } from './callApi';
import CurrentWeatherWidget from './CurrentWeatherWidget';
import HourlyWeatherWidget from './HourlyWeatherWidget';
import DailyWeatherWidget from './DailyWeatherWidget';

// eslint-disable-next-line react/prefer-stateless-function
class Weather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preciseLocation: false,
      weatherInfoReady: false,
      imperial: false,
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
    getLocationFromIP(this.updateLocationAndWeather);
  }

  /**
   * updates the location in the state of the component and triggers weather update
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {boolean} preciseLocation 
   */
  updateLocationAndWeather = (latitude, longitude, preciseLocation) => {
    this.setState({
      preciseLocation,
      location: {
        latitude,
        longitude,
      },
    });

    this.updateWeather();
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
    const { temp, feels_like, weather, humidity, sunrise, sunset } = response.data.current;
    const currentWeatherObject = {
      temp,
      feelsLike: feels_like,
      weatherMain: weather[0].main,
      humidity,
      icon: weather[0].icon,
      sunrise,
      sunset,
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
      weatherInfoReady: true,
      currentWeather: currentWeatherObject,
      hourlyWeather: hourlyWeatherArray,
      dailyWeather: dailyWeatherArray,
    });
  }

  /**
   * processes the response from reverse geocoding api and updates the state with the new location
   * @param {object} response 
   */
  handleReverseGeocodingResponse = (response) => {
    const { lat, lon, address, display_name } = response.data;

    this.setState(
      {
        location: {
          latitude: lat,
          longitude: lon,
          city: (address.city ? address.city : null),
          country: address.country,
          displayName: display_name,
        },
      },
    );
  }

  render() {
    const { weatherInfoReady, imperial, preciseLocation, hourlyWeather, dailyWeather } = this.state;
    const { city, country, displayName } = this.state.location;
    const { temp, feelsLike, weatherMain, humidity, icon, sunrise, sunset } = this.state.currentWeather;

    if (weatherInfoReady) {
      return (
        <div>
          <CurrentWeatherWidget
            city={city} country={country} displayName={displayName}
            temp={temp} feelsLike={feelsLike} main={weatherMain}
            humidity={humidity} icon={icon}
            sunrise={sunrise} sunset={sunset}
            imperial={imperial}
            locationHandler={() => getLocationFromNavigator(this.updateLocationAndWeather)} preciseLocation={preciseLocation}
          />
          <HourlyWeatherWidget weather={hourlyWeather} imperial={imperial} />
          <DailyWeatherWidget weather={dailyWeather} imperial={imperial} />
        </div>
      );
    } else {
      return (
        <div>
          <Segment style={{ width: '100vw', height: '100vh' }}>
            <Dimmer active inverted>
              <Loader indeterminate inverted>
                <h1>Please wait...</h1>
                <hr/>
                <h3>Fetching data</h3>
                <h4>Stuck? Try turning off an ad-blocking software</h4>
              </Loader>
            </Dimmer>
            <Image src='/images/wireframe/short-paragraph.png' />
          </Segment>
        </div>
      );
    }
  }
}

export default Weather;
