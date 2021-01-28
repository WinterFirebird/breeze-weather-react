import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const FooterWrapper = styled.div`
  background-color: rgba(0,0,0,0.4);
  grid-area: footer;
  footer {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    color: #dadada;
    >p:first-child {
      font-size: 1rem;
    }
    >p:last-child {
      font-size: 0.8rem;
      margin-top: 0.6rem;
      opacity: 0.6;
    }
    a {
      color: inherit;
      transition: color 0.2s ease-in;
      &:hover {
        color: #fff;
      }
    }
  }
`;


class Footer extends Component {
  render() {
    return (
      <FooterWrapper>
        <footer>
          <p>
            Made with <Icon name="heart outline icon" /> by <a href="https://github.com/armanDark" target="_blank">Arman Grigoryan</a>
          </p>
          <p>powered by OpenWeather™ API</p>
        </footer>
      </FooterWrapper>
    )
  }
}


export default React.memo(Footer);
