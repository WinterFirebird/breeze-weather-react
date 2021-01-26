import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { measureSystemContext } from './context';
import { hoursHoursFromNow } from './getDate';
import { convertKelvinTo } from './tempConvert';
import { mainIcons } from './media';

const Wrapper = styled.div`
  grid-area: hourly;
  width: 100%;
  padding: 0 30px 40px 30px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  };
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media screen and (max-width: 768px) {
    width: 100vw;
    > h2 {
      display: none;
    }
  }
`;

const HourlyWeather = styled.div`
  padding: 6px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 6px;
  
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  padding-bottom: 12px;
  @supports (grid-auto-flow: column) {
    display: grid;
    grid-gap: 1rem;
    grid-template-rows: auto;
    grid-auto-columns: auto;
    grid-auto-flow: column;
  };

  @supports not (grid-auto-flow: column) {
    display: flex;
    flex-direction: row;
    > div {
      margin: 14px;
    }
  };

  overflow-x: scroll;
  img {
    width: 64px;
    @media screen and (min-width: 1024px) {
      width: 48px;
    }
  };
  @media screen and (min-width: 1024px) {
    @supports (grid-auto-flow: row) {
      grid-auto-flow: row;
    }
    @supports not (grid-auto-flow: row) {
      flex-direction: column;
    }
    overflow-x: hidden;
    > div {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(256,256,256,0.6);
      &:last-child {
        border-bottom: none;
      }
      > div {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        > * {
          margin: 4px;
        }
      }
    }
  }
}
`;

const Element = styled.div`
  padding: '10px';
`;

// eslint-disable-next-line react/prefer-stateless-function
class HourlyForecast extends Component {
  static contextType = measureSystemContext;

  /**
   * updates the JSX list array of hourly weather from the data array passed as props
   * @param {object} hourlyWeatherArray 
   * @param {boolean} isImperial 
   */
  toJSXList = (hourlyWeatherArray, isImperial) => {
    let newHourlyWeatherList = hourlyWeatherArray.map((item, index) => {
      const hour = hoursHoursFromNow(index);
      const mainIconSource = mainIcons[`m${item.icon}`];
      const mainText = item.weatherMain;
      const temp = isImperial ? `${convertKelvinTo(item.temp, 'f')} °F` : `${convertKelvinTo(item.temp, 'c')} °C`;

      return (
        <Element key={index}>
          <h4>{hour}</h4>
          <div>
            <img src={mainIconSource} alt={`${mainText} icon`} />
            <h4>{mainText}</h4>
            <h4>{temp}</h4>
          </div>
        </Element>
      );
    });

    return newHourlyWeatherList;
  }
  
  render() {
    const { weather } = this.props;
    const { isImperial } = this.context;
    const hourlyWeatherList = this.toJSXList(weather, isImperial);
    return (
      <Wrapper>
        <h2>hourly forecast</h2>
        <HourlyWeather>
          {hourlyWeatherList || null}
        </HourlyWeather>
      </Wrapper>
    );
  }
}

HourlyForecast.propTypes = {
  weather: PropTypes.array,
};

export default HourlyForecast;
