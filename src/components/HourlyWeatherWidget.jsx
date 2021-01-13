import React, { Component } from 'react';
import styled from 'styled-components';
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
    > h2 {
      display: none;
    }
  }
`;

const HourlyWeather = styled.div`
  padding-bottom: 12px;
  display: grid;
  grid-gap: 14px;
  grid-template-rows: auto;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  overflow-x: scroll;
  img {
    width: 64px;
    @media screen and (min-width: 1024px) {
      width: 48px;
    }
  };
  @media screen and (min-width: 1024px) {
    grid-auto-flow: row;
    > div {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid white;
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
class HourlyWeatherWidget extends Component {
  render() {
    const { weather, imperial } = this.props;
    const jsxArray = weather.map((item, index) => {
      const hour = hoursHoursFromNow(index);
      const mainIconSource = mainIcons[`m${item.icon}`];
      const mainText = item.weatherMain;
      const temp = imperial ? `${convertKelvinTo(item.temp, 'f')} °F` : `${convertKelvinTo(item.temp, 'c')} °C`;

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

    return (
      <Wrapper>
        <h2>hourly forecast</h2>
        <HourlyWeather>
          {jsxArray || null}
        </HourlyWeather>
      </Wrapper>
    );
  }
}

export default HourlyWeatherWidget;
