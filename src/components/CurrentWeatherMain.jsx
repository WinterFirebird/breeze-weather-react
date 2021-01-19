import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { convertKelvinTo } from './tempConvert';
import { mainIcons } from './media';

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
  font-size: 4.4rem;
`;

const MainText = styled.div`
  align-self: flex-end;
  font-size: 2.4rem;
  margin-right: 22%;
`;

const TransparentButton = styled.button`
  background: none;
  outline: none;
  border: 1px solid white;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  padding: 4px;
`;

// eslint-disable-next-line react/prefer-stateless-function
class CurrentWeatherWidget extends Component {
  render() {
    const {
      city, country, displayName,
      temp, feelsLike, main,
      icon, imperial,
      locationHandler, preciseLocation, locationFromLocalStorage,
    } = this.props;

    const locationButton = (() => {
      let button = null;
      if (preciseLocation && locationFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationHandler}>
            Update location
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (preciseLocation && !locationFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationHandler} disabled style={{ opacity: '0.7' }}>
            Precise location
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (!preciseLocation && !locationFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationHandler}>
            Precise location
            <Icon name="location arrow" />
          </TransparentButton>
        )
      }
      return button;
    })();

    return (
      <Wrapper>
        <Content>
          {locationButton}
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
        </Content>
      </Wrapper>
    );
  }
}

export default CurrentWeatherWidget;
