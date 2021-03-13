/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { measureSystemContext } from '../../../context';
import { epochTimeToLocalTime } from '../../../utils/getDate';
import { WiHumidity, WiWindDeg, WiBarometer, WiHorizonAlt, WiSunrise, WiSunset } from 'react-icons/wi';

const Wrapper = styled.div`
  grid-area: extra;
  width: 100%;
  padding: 30px 30px 40px 30px;
`;

const Grid = styled.div`
  padding: 6px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 6px;

  width: 100%;
  @supports (grid-template-columns: 1fr) {
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @media screen and (max-width: 320px) {
      grid-template-columns: 1fr 1fr;
      grid-gap: 2rem;
    };
    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    };
    @media screen and (min-width: 1024px) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
    };
  };
  @supports not (grid-template-columns: 1fr) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > div {
      flex: 1 1 25%;
    }
    @media screen and (min-width: 768px) {
      > div {
      flex: 1 1 15%;
      }
    };
    @media screen and (min-width: 1024px) {
      > div {
        flex: 1 1 30%;
      }
    };
  };
`;

const Element = styled.div`
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  svg {
    font-size: 6rem !important;
  };
`;

class CurrentForecastExtra extends Component {
  static contextType = measureSystemContext;
  render() {
    const { humidity, pressure, visibility, windSpeed, 
      sunrise, sunset, } = this.props;
    const { isImperial } = this.context;
    const sunriseLocal = epochTimeToLocalTime(sunrise);
    const sunsetLocal = epochTimeToLocalTime(sunset);

    return (
      <Wrapper>
        <Grid>
          <Element>
            <WiHumidity />
            <h4>humidity</h4>
            <p>{humidity} %</p>
          </Element>
          <Element>
            <WiWindDeg />
            <h4>wind</h4>
            <p>{windSpeed}m/s</p>
          </Element>
          <Element>
            <WiBarometer />
            <h4>pressure</h4>
            <p>{pressure}hPa</p>
          </Element>
          <Element>
            <WiHorizonAlt />
            <h4>visibility</h4>
            <p>{visibility}m</p>
          </Element>
          <Element>
            <WiSunrise />
            <h4>sunrise</h4>
            <p>{sunriseLocal}</p>
          </Element>
          <Element>
            <WiSunset />
            <h4>sunset</h4>
            <p>{sunsetLocal}</p>
          </Element>
        </Grid>
      </Wrapper>
    );
  }
}

CurrentForecastExtra.propTypes = {
  humidity: PropTypes.number,
  pressure: PropTypes.number,
  visibility: PropTypes.number,
  windSpeed: PropTypes.number, 
  sunrise: PropTypes.number,
  sunset: PropTypes.number,
};

export default CurrentForecastExtra;
