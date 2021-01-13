import React, { Component } from 'react';
import styled from 'styled-components';
import { dateDaysFromNow } from './getDate';
import { convertKelvinTo } from './tempConvert';
import { mainIcons } from './media';

const Wrapper = styled.div`
  grid-area: daily;
  width: 100%;
  padding: 0 30px 40px 30px;
`;

const DailyWeather = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Element = styled.div`
  border-bottom: 1px solid white;
  display: flex;
  justify-content: space-between;
  > h4 {
    white-space: nowrap;
  }
  > div:last-child {
    flex-grow: 1;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    > div:first-child {
      margin-right: 8%;
      display: flex;
      align-items: flex-end;
      img {
        width: 48px;
      }
      span:nth-child(1) {
        font-size: 16px;
      }
      span:nth-child(2) {
        font-size: 14px;
        opacity: 0.8;
        margin-left: 4px;
      }
    }
  }
`

// eslint-disable-next-line react/prefer-stateless-function
class DailyWeatherWidget extends Component {
  render() {
    const { weather, imperial } = this.props;
    const jsxArray = weather.map((item, index) => {
      const date = dateDaysFromNow(index);
      const {weatherMain, humidity, icon} = item;
      const temp = {
        day: (imperial ? `${convertKelvinTo(item.temp.day, 'f')} °F` : `${convertKelvinTo(item.temp.day, 'c')} °C`),
        night: (imperial ? `${convertKelvinTo(item.temp.night, 'f')} °F` : `${convertKelvinTo(item.temp.night, 'c')} °C`),
      };

      return (
        <Element key={index} style={{ padding: '10px' }}>
          <h4>{date}</h4>
          <div>
            <div>
              <span>{temp.day}</span>
              <span>| {temp.night}</span>
              <img src={mainIcons[`m${icon}`]} alt={`${icon} icon`} />
            </div>
            <div>{weatherMain}</div>
          </div>
          
        </Element>
      );
    });

    return (
      <Wrapper>
        <h2>daily forecast</h2>
        <DailyWeather>
          {jsxArray || null}
        </DailyWeather>
      </Wrapper>
    );
  }
}

export default DailyWeatherWidget;
