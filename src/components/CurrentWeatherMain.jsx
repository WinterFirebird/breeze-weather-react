import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { epochTimeToLocalTime } from './getDate';
import { convertKelvinTo } from './tempConvert';
import { mainIcons, extraIcons } from './media';

const Wrapper = styled.div`
  grid-area: main;
  width: 100%;
  padding: 40px 40px;
`;

const LocationName = styled.div`
  font-size: 18px;
`;

const Weather = styled.div`
  max-width: 250px;
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
  font-size: 62px;
`;

const MainText = styled.div`
  align-self: flex-end;
  font-size: 34px;
  margin-right: 22%;
`;

const TransparentButton = styled.button`
  background: none;
  outline: none;
  border: 1px solid white;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding: 4px;
`;

// eslint-disable-next-line react/prefer-stateless-function
class CurrentWeatherWidget extends Component {
  render() {
    const {
      city, country, displayName,
      temp, feelsLike, main,
      icon, imperial,
      locationHandler, preciseLocation,
    } = this.props;

    return (
      <Wrapper>
        {
          preciseLocation ? (
            <TransparentButton onClick={locationHandler} disabled style={{ opacity: '0.7' }}>
              Use precise location 
              <Icon name='location arrow' />
            </TransparentButton>
          ) : (
            <TransparentButton onClick={locationHandler}>
              Use precise location 
              <Icon name="location arrow" />
            </TransparentButton>
          )
        }

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
            <p>{imperial ? `${convertKelvinTo(temp, 'f')} °F` : `${convertKelvinTo(temp, 'c')} °C`}</p>
          </MainDegrees>
          <MainText>
            <p>{main}</p>
          </MainText>
        </Weather>
      </Wrapper>
    );
  }
}

export default CurrentWeatherWidget;
