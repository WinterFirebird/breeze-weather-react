import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { measureSystemContext } from '../../../context';
import { dateDaysFromNow } from '../../../utils/getDate';
import { convertKelvinTo } from '../../../utils/tempConvert';
import { mainIcons } from '../../../assets';

const Wrapper = styled.div`
  grid-area: daily;
  width: 100%;
  padding: 0 30px 40px 30px;
`;

const DailyWeather = styled.div`
  padding: 6px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 6px;

  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Element = styled.div`
  border-bottom: 1px solid rgba(256,256,256,0.6);
  &:last-child {
    border-bottom: none;
  }
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
class DailyForecast extends Component {
  static contextType = measureSystemContext;

  /**
   * returns a JSX list array of daily weather from the data array passed as props
   * @param {object} dailyWeatherArray 
   * @param {boolean} isImperial 
   */
  toJSXList = (dailyWeatherArray, isImperial) => {
    let newDailyWeatherList = dailyWeatherArray.map((item, index) => {
      const date = dateDaysFromNow(index);
      const {weatherMain, humidity, icon} = item;
      const temp = {
        day: (isImperial ? `${convertKelvinTo(item.temp.day, 'f')} °F` : `${convertKelvinTo(item.temp.day, 'c')} °C`),
        night: (isImperial ? `${convertKelvinTo(item.temp.night, 'f')} °F` : `${convertKelvinTo(item.temp.night, 'c')} °C`),
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

    return newDailyWeatherList;
  }

  render() {
    const { weather } = this.props;
    const { isImperial } = this.context;
    const dailyWeatherList = this.toJSXList(weather, isImperial);
    return (
      <Wrapper>
        <h2>daily forecast</h2>
        <DailyWeather>
          {dailyWeatherList || null}
        </DailyWeather>
      </Wrapper>
    );
  }
}

DailyForecast.propTypes = {
  weather: PropTypes.array,
}

export default DailyForecast;
