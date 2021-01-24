/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

const LoadingGrid = styled.div`
  border: 1px solid #000;
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  > div {
    width: 100%;
    height: 10px;
    background-color: #000;
  }
`;

const SegmentStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  margin: 0,
}

const SegmentHeaderStyle = {
  whiteSpace: 'nowrap',
  color: '#000',
}

class CustomLoader extends Component {
  render() {
    const {
      isLocationResponseReady,
      isWeatherResponseReady,
      isReverseGeocodingResponseReady,
    } = this.props;
    return (
      <Segment style={SegmentStyle}>
        <Dimmer active inverted>
          {isLocationResponseReady ? (
            <Loader content inverted>
              <h1 style={SegmentHeaderStyle}>Please wait...</h1>
              <h3>Fetching data</h3>
              <LoadingGrid>
                <div></div>
                {isWeatherResponseReady? <div></div> : null}
                {isReverseGeocodingResponseReady? <div></div> : null}
              </LoadingGrid>
              <h4>Stuck? It might be caused by an AdBlocker</h4>
            </Loader>
            ) : (
            <Loader indeterminate inverted>
              <h1 style={SegmentHeaderStyle}>Please wait...</h1>
              <h3>Fetching data</h3>
              <LoadingGrid />
              <h4>Stuck? It might be caused by an AdBlocker</h4>
            </Loader>
            )}
        </Dimmer>
      </Segment>
    );
  }
}

CustomLoader.propTypes = {
  isLocationResponseReady: PropTypes.bool,
  isWeatherResponseReady: PropTypes.bool,
  isReverseGeocodingResponseReady: PropTypes.bool,
}

export default CustomLoader;
