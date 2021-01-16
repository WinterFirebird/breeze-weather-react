/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

class CustomLoader extends Component {
  render() {
    const {
      locationResponseReady,
      weatherResponseReady,
      reverseGeocodingResponseReady,
    } = this.props;
    return (
      <Segment style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <Dimmer active inverted>
          {locationResponseReady ? (
            <Loader content inverted>
              <h1>Please wait...</h1>
              <h3>Fetching data</h3>
              <progress
                value={(weatherResponseReady || reverseGeocodingResponseReady) ? ((weatherResponseReady && reverseGeocodingResponseReady) ? '100' : '80') : '30'} 
                max="100"
              >
              </progress>
              {weatherResponseReady ? <div></div> : null}
              <h4>Stuck? It might be caused by an AdBlocker</h4>
            </Loader>
            ) : (
            <Loader indeterminate inverted>
              <h1>Please wait...</h1>
              <h3>Fetching data</h3>
              <progress 
              value="0" max="100"
              >
              </progress>
              <h4>Stuck? It might be caused by an AdBlocker</h4>
            </Loader>
            )}
        </Dimmer>
      </Segment>
    );
  }
}

export default CustomLoader;
