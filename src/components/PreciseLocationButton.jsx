import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { locationContext } from './context';

const TransparentButton = styled.button`
  background: none;
  outline: none;
  border: 1px solid white;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  padding: 4px;
`;

class PreciseLocationButton extends Component {
  static contextType = locationContext;
  render() {
    const {isPreciseLocation, isFromLocalStorage, handler} = this.context;
    const locationButton = (() => {
      let button = null;
      if (isPreciseLocation && isFromLocalStorage) {
        button = (
          <TransparentButton onClick={handler}>
            Update location
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (isPreciseLocation && !isFromLocalStorage) {
        button = (
          <TransparentButton onClick={handler} disabled style={{ opacity: '0.7' }}>
            Precise location
            <Icon name="location arrow" />
          </TransparentButton>
        )
      } else if (!isPreciseLocation && !isFromLocalStorage) {
        button = (
          <TransparentButton onClick={handler}>
            Precise location
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
