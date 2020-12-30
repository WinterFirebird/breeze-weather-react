import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { epochTimeToLocalTime } from './getDate';
import { convertKelvinTo } from './tempConvert';

// eslint-disable-next-line react/prefer-stateless-function
class CurrentWeatherWidget extends Component {
  constructor(props) {
    super(props);

    this.Weather = styled.div`
      max-width: max-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 40px auto 20px auto;
      div {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    `;

    this.TransparentButton = styled.button`
      background: none;
      outline: none;
      border: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      padding: 4px;
    `;
  }

  render() {
    const {
      city, country, displayName,
      temp, feelsLike, main,
      humidity, sunrise, sunset,
      icon, imperial,
      locationHandler, preciseLocation,
    } = this.props;

    return (
      <this.Weather>
        {
          preciseLocation ? (
            <this.TransparentButton onClick={locationHandler} disabled style={{ opacity: '0.7' }}>
              Use precise location 
              <Icon name='location arrow' />
            </this.TransparentButton>
          ) : (
            <this.TransparentButton onClick={locationHandler}>
              Use precise location 
              <Icon name="location arrow" />
            </this.TransparentButton>
          )
        }

        {
        city ? (
          <h1>
            {city}, {country}
          </h1>
        ) : <h1>{displayName}</h1>
        }
        <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt='main weather icon' />
        <div>
          <h2>{imperial ? `${convertKelvinTo(temp, 'f')} °F` : `${convertKelvinTo(temp, 'c')} °C`}</h2>
          <h2>{main}</h2>
        </div>
        <h4>
          Feels like: {imperial ? `${convertKelvinTo(feelsLike, 'f')} °F` : `${convertKelvinTo(feelsLike, 'c')} °C`}
        </h4>
        <h4>
          Humidity: {humidity}%
        </h4>
        <div>
          <div>
            <h4>
              Sunrise: 
              {epochTimeToLocalTime(sunrise)}
            </h4>
          </div>
          <div>
            <h4>
              Sunset: 
              {epochTimeToLocalTime(sunset)}
            </h4>
          </div>
        </div>
      </this.Weather>
    );
  }
}

export default CurrentWeatherWidget;
