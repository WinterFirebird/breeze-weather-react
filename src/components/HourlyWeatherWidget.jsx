import React, { Component } from 'react';
import styled from 'styled-components';
import { hoursHoursFromNow } from './getDate';
import { convertKelvinTo } from './tempConvert';

// eslint-disable-next-line react/prefer-stateless-function
class HourlyWeatherWidget extends Component {
  constructor(props) {
    super(props);

    this.Weather = styled.div`
      max-width: 70%;
      margin-left: auto;
      margin-right: auto;
    `;

    this.WeatherWrapper = styled.div`
      display: flex;
      justify-content: flex-start;
      width: 100%;
      padding: 10px;
      margin: 20px auto 10px auto;
      overflow-x: scroll;
    `;
  }

  render() {
    const { weather, imperial } = this.props;
    const jsxArray = weather.map((item, index) => {
      const hour = hoursHoursFromNow(index);

      return (
        <div key={index} style={{ padding: '10px' }}>
          <h4>
            {imperial ? `${convertKelvinTo(item.temp, 'f')} °F` : `${convertKelvinTo(item.temp, 'c')} °C`}
          </h4>
          <img src={`http://openweathermap.org/img/wn/${item.icon}.png`} alt={`${item.weatherMain} icon`} />
          <h4>{item.weatherMain}</h4>
          <hr />
          <h4>{hour}</h4>
        </div>
      );
    });

    return (
      <this.Weather>
        <h2 style={{ textAlign: 'left' }}>Hourly</h2>
        <this.WeatherWrapper>
          {jsxArray || null}
        </this.WeatherWrapper>
      </this.Weather>
    );
  }
}

export default HourlyWeatherWidget;
