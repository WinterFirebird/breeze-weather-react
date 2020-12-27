import React, { Component } from 'react';
import {dateDaysFromNow} from './getDate'
import { convertKelvinTo } from './tempConvert';
import styled from 'styled-components';

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
    let jsxArray = this.props.weather.map((item, index) => {
      const date = dateDaysFromNow(index);
      
      let temp = {
        day: ( this.props.imperial ? `${convertKelvinTo(item.temp.day, 'f')} °F` : `${convertKelvinTo(item.temp.day, 'c')} °C` ),
        night: ( this.props.imperial ? `${convertKelvinTo(item.temp.night, 'f')} °F` : `${convertKelvinTo(item.temp.night, 'c')} °C` ),
      }
      return (
        <div key={index} style={{padding: '10px'}}>
          <h4>🔆{temp.day} /🌙 {temp.night}</h4>
          <h4 style={{whiteSpace: 'pre-wrap'}}>{date}</h4>
        </div>
      )
    });

    return (
      <this.Weather>
        <h2 style={{textAlign: 'left'}}>Daily</h2>
        <this.WeatherWrapper>
          {jsxArray ? jsxArray : null}
        </this.WeatherWrapper>
      </this.Weather>
    )
  }
}

export default DailyWeatherWidget;
