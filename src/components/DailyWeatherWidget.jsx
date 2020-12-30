import React, { Component } from 'react';
import styled from 'styled-components';
import { dateDaysFromNow } from './getDate';
import { convertKelvinTo } from './tempConvert';

// eslint-disable-next-line react/prefer-stateless-function
class DailyWeatherWidget extends Component {
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
      const date = dateDaysFromNow(index);

      const temp = {
        day: (imperial ? `${convertKelvinTo(item.temp.day, 'f')} °F` : `${convertKelvinTo(item.temp.day, 'c')} °C`),
        night: (imperial ? `${convertKelvinTo(item.temp.night, 'f')} °F` : `${convertKelvinTo(item.temp.night, 'c')} °C`),
      };

      return (
        <div key={index} style={{ padding: '10px' }}>
          <h4 style={{ whiteSpace: 'nowrap'}}>🔆{temp.day} /🌙 {temp.night}</h4>
          <h4 style={{ whiteSpace: 'pre-wrap' }}>{date}</h4>
        </div>
      );
    });

    return (
      <this.Weather>
        <h2 style={{ textAlign: 'left' }}>Daily</h2>
        <this.WeatherWrapper>
          {jsxArray || null}
        </this.WeatherWrapper>
      </this.Weather>
    );
  }
}

export default DailyWeatherWidget;
