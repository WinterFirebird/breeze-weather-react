import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { measureSystemContext } from '../../../context';
import { convertKelvinTo } from '../../../utils/tempConvert';
import { countryCodeToName } from '../../../utils/countryNames';
import { mainIcons } from '../../../assets';
import MeasureSystemSwitcher from '../../MeasureSystemSwitcher';

const Wrapper = styled.div`
  grid-area: main;
  width: 100%;
  padding: 40px 40px;
`;

const Content = styled.div`
  padding: 12px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 6px;
`;

const LocationName = styled.div`
  font-size: 1.3rem;
`;

const Weather = styled.div`
  max-width: 300px;
  width: 75%;
  display: inline-flex;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`; 

const MainIcon = styled.img`
  align-self: flex-end;
  margin-right: 12%;
`;

const MainDegrees = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  @media screen and (min-width: 720px) {
    flex-direction: row;
  }
  p:first-child {
    font-size: 4.4rem;
  }
  p:last-child {
    font-size: 0.9rem;
    font-style: italic;
    margin-bottom: 1rem;
    margin-left: 0.5rem;
  }
`;

const MainText = styled.div`
  align-self: flex-end;
  font-size: 2.4rem;
  margin-right: 22%;
`;

// eslint-disable-next-line react/prefer-stateless-function
class CurrentForecast extends Component {
  static contextType = measureSystemContext;
  render() {
    const {
      city, country, temp, feelsLike, main, icon
    } = this.props;
    const {isImperial} = this.context; 

    return (
      <Wrapper>
        <Content>
          <MeasureSystemSwitcher />
          <LocationName>
            <p>{city}, {countryCodeToName(country)}</p>
          </LocationName>
          <Weather>
            <MainIcon src={mainIcons[`m${icon}`]} alt={main} />
            <MainDegrees>
              <p>{isImperial ? `${convertKelvinTo(temp, 'f')} °F` : `${convertKelvinTo(temp, 'c')} °C`}</p>
              <p>{isImperial ? `Feels Like ${convertKelvinTo(feelsLike, 'f')} °F` : `Feels Like ${convertKelvinTo(feelsLike, 'c')} °C`}</p>
            </MainDegrees>
            <MainText>
              <p>{main}</p>
            </MainText>
          </Weather>
        </Content>
      </Wrapper>
    );
  }
}

CurrentForecast.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  displayName: PropTypes.string,
  temp: PropTypes.number,
  feelsLike: PropTypes.number,
  main: PropTypes.string,
  icon: PropTypes.string,
};

export default CurrentForecast;
