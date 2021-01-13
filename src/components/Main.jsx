import React, { Component } from 'react';
import Weather from './Weather';
import styled from 'styled-components';

const App = styled.div`
  color: white;
  padding-top: 1rem;
  min-height: 100vh;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
  'main'
  'hourly'
  'extra'
  'daily';
  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'main extra'
    'hourly daily';
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
      <App>
        <Weather />
      </App>
    )
  }
}

export default Main
