/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import styled from 'styled-components';
import Weather from './Weather';

const MainApp = styled.div`
  color: white;
  padding-top: 1rem;
  min-height: 100vh;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
  'top-bar'
  'main'
  'hourly'
  'extra'
  'daily'
  'footer';
  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'top-bar null'
    'main extra'
    'hourly daily'
    'footer footer';
  }
  h2 {
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-align:center;
  }
`;

class Main extends Component {
  render() {
    return (
      <MainApp>
        <Weather />
      </MainApp>
    );
  }
}

export default Main;
