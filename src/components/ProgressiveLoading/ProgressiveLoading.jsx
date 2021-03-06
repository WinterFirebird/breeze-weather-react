/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { loading } from '../../assets';

const Wrapper = styled.div`
  width: 100vw; 
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center; 
  .loader {
    max-width: 200px;
    width: 30vw;
    height: 200px;
    position: relative;
    > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    > *:nth-child(2) {
      z-index: 2;
    }
    > *:nth-child(3) {
      z-index: 3;
    }
  }
`;

class ProgressiveLoading extends Component {
  render() {
    const {
      isLocationResponseReady,
      isWeatherResponseReady,
      isReverseGeocodingResponseReady,
    } = this.props;
    return (
      <Wrapper>
        <div className='loader'>
          <img src={loading.stage1} className='animate__animated animate__fadeIn' />
          { isLocationResponseReady && (isWeatherResponseReady || isReverseGeocodingResponseReady) ? (
            <>
              <img src={loading.stage2} className='animate__animated animate__pulse' />.
              <img src={loading.stage3} className='animate__animated animate__flash' />
            </>
          )  : null }
        </div>
      </Wrapper>
    );
  }
}

ProgressiveLoading.propTypes = {
  isLocationResponseReady: PropTypes.bool,
  isWeatherResponseReady: PropTypes.bool,
  isReverseGeocodingResponseReady: PropTypes.bool,
}

export default ProgressiveLoading;
