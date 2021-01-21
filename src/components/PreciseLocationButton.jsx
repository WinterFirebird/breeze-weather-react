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

class PreciseLocationButton extends Component {
  static contextType = locationContext;
  render() {
    const {isPreciseLocation, isFromLocalStorage, locationFromNavigatorClickHandler} = this.context;
    const locationButton = (() => {
      let button = null;
      if (isPreciseLocation && isFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler}>
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (isPreciseLocation && !isFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler} disabled style={{ opacity: '0.5' }}>
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (!isPreciseLocation && !isFromLocalStorage) {
        button = (
          <TransparentButton onClick={locationFromNavigatorClickHandler}>
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

export default PreciseLocationButton;
