import React, { Component } from 'react';
import styled from 'styled-components';
import CitySearch from './CitySearch';
import GPSButton from '../GPS/GPSButton';

const TopBarWrapper = styled.div`
  grid-area: top-bar;
`;

const LocationWrapper = styled.div`
  height: 50px;
  width: 100%;
  padding: 0 40px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: stretch;
  > * {
    height: 100%;
  };
  > div:first-child {
    flex-grow: 1;
    > div {
      width: 100%;
      display: flex;
      > input {
        flex-basis: auto;
        flex-grow: 1;
        flex-shrink: 1;
      };
    };
  }
`;

class TopBar extends Component {
  render() {
    return (
      <TopBarWrapper>
        <LocationWrapper>
          <CitySearch />
          <GPSButton />
        </LocationWrapper>
      </TopBarWrapper>
    );
  }
}

export default TopBar;
