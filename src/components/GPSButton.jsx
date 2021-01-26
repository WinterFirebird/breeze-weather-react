import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { locationContext } from './context';

const TransparentButton = styled.button`
  background: none;
  border: none;
  outline: none;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  padding: 1rem;
`;

class GPSButton extends Component {
  static contextType = locationContext;
  render() {
    const {isLocationFromLocalStorage, isLocationFromGPS, locationFromNavigatorClickHandler} = this.context;
    const locationButton = (() => {
      let button = null;
      if (!isLocationFromLocalStorage && isLocationFromGPS) {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler} disabled >
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (isLocationFromLocalStorage && isLocationFromGPS) {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler} >
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler} style={{ opacity: '0.5' }} >
            <Icon name="location arrow" />
          </TransparentButton>
        )
      }
      return button;
    })();
    return (
      <>
        {locationButton}
      </>
    );
  }
}

export default GPSButton;
