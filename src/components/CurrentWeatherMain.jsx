import React, { Component } from 'react';
import styled from 'styled-components';
import { measureSystemContext } from './context';
import { convertKelvinTo } from './tempConvert';
import { mainIcons } from './media';
import MeasureSystemSwitcher from './MeasureSystemSwitcher';
import PreciseLocationButton from './PreciseLocationButton';

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
class CurrentWeatherWidget extends Component {
  static contextType = measureSystemContext;
  render() {
    const {
      city, country, displayName,
      temp, feelsLike, main, icon
    } = this.props;
    const {isImperial} = this.context; 

    return (
      <Wrapper>
        <Content>
          <PreciseLocationButton />
          <MeasureSystemSwitcher />
          {
          city ? (
            <LocationName>
              <p>{city}, {country}</p>
            </LocationName>
          ) : (
            <LocationName>
              <p>{displayName}</p>
            </LocationName>
          )
          }
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

export default CurrentWeatherWidget;
