import React, { Component } from 'react';
import CurrentWeatherWidget from './CurrentWeatherWidget';
import axios from 'axios';
import HourlyWeatherWidget from './HourlyWeatherWidget';
import DailyWeatherWidget from './DailyWeatherWidget';

// eslint-disable-next-line react/prefer-stateless-function
class Weather extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      apiRequestReady:false,
      imperial:false,
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
        weatherMain: null,
        humidity: null,
        icon: null,
      },
      hourlyWeather: [
        {
          temp: null,
          weatherMain:  null,
          icon: null,
        }
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
        }
      ]
    }
  }

  getLocationFromIP = () => {
    console.log(`response of IP api request below`);
    axios.get('http://ip-api.com/json/')
    .then(response => {
      console.log(response);
      this.setLocation(response, 'ip');
      console.log(`response of IP api request above`);
    })
    .catch(err => console.log(err));
  };

  getLocationFromNavigator = () => {
    window.navigator.geolocation.getCurrentPosition(this.setLocation);
  }

  setLocation = (position, from) => {
    let latt, long;
    console.log('position')
    console.log(position)
    if(from === 'ip') {
      latt = position.data.lat;
      long = position.data.lon;
    } else {
      latt = position.coords.latitude;
      long = position.coords.longitude;
    }
    
    console.log(`lat: ${latt}, long: ${long}`);
    this.setState({
      location: {
        latitude: latt,
        longitude: long,
      }
    });

    this.callApi();
  };

  callApi = () => {
    console.log('callApi called')
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&&appid=997d9b54abada6ff84291820778b192d`)
    .then(response => this.handleOneCallResponse(response))
    .catch(err => console.log(err));

    axios.get(`https://us1.locationiq.com/v1/reverse.php?key=pk.026f9b5e94ef539558116a8c355cd29f&lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&zoom=10&format=json`)
    .then(response => this.handleLocationResponse(response))
    .catch(err => console.log(err));
  }

  handleOneCallResponse = (response) => {
    console.log("the response from openweathermap api below");
    console.log(response);
    console.log("the response from openweathermap api above");

    //current weather config
    let currentWeatherObject = {
      temp: response.data.current.temp,
      weatherMain: response.data.current.weather[0].main,
      humidity: response.data.current.humidity,
      icon: response.data.current.weather[0].icon,
    };

    //hourly weather config
    let hourlyWeatherArray = [];
    response.data.hourly.forEach(nthHour => {
      if(response.data.hourly.indexOf(nthHour) < 24) {
        let hour = {
          temp: nthHour.temp,
          weatherMain: nthHour.weather[0].main,
          icon: nthHour.weather[0].icon,
        }
        hourlyWeatherArray.push(hour)
      }
    });

    //daily weather config
    let dailyWeatherArray = [];
    response.data.daily.forEach(nthDay => {
      if(response.data.daily.indexOf(nthDay) < 8) {
        let day = {
          temp: {
            day: nthDay.temp.day,
            night: nthDay.temp.night,
          },
          weatherMain: nthDay.weather[0].main,
          humidity: nthDay.humidity,
          icon: nthDay.weather[0].icon,
        }
        dailyWeatherArray.push(day)
      }
    })

    //state update
    this.setState({
      apiRequestReady: true,
      currentWeather: currentWeatherObject,
      hourlyWeather: hourlyWeatherArray,
      dailyWeather: dailyWeatherArray
    })

  }

  handleLocationResponse = (response) => {
    console.log("the response from locationIq api below");
    console.log(response);
    console.log("the response from locationIq api above");

    const {lat, lon, address, display_name} = response.data;

    this.setState(
      {
        location: {
          latitude: lat,
          longitude:  lon,
          city: (address.city? address.city : null),
          country: address.country,
          displayName: display_name,
        }
      }
    )
  }

  componentDidMount() {

    this.getLocationFromIP()
    this.callApi();
        
  }
    
  render() {
    return (
      <div>
        <CurrentWeatherWidget 
          city={this.state.location.city} country={this.state.location.country} displayName={this.state.location.displayName}
          temp={this.state.currentWeather.temp} main={this.state.currentWeather.weatherMain} humidity={this.state.currentWeather.humidity} icon={this.state.currentWeather.icon}
          imperial={this.state.imperial}
          locationHandler={this.getLocationFromNavigator}
        />
        <HourlyWeatherWidget weather={this.state.hourlyWeather} imperial={this.state.imperial} />
        <DailyWeatherWidget weather={this.state.dailyWeather} imperial={this.state.imperial} />
      </div>
    );
  }
}

export default Weather
