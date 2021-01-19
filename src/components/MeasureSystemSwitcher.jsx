import React, { Component } from 'react';
import styled from 'styled-components';
import { measureSystemContext } from './context';

const Wrapper = styled.div`
  display: inline-block;
  margin: 8px;
  font-size: 1rem;
  button {
    padding: 4px;
    color: #fff;
    opacity: 0.7;
    /**/
    border: none;
    outline: none;
    background: none;
  };
  button[disabled] {
    opacity: 1;
  }
`

class MeasureSystemSwitcher extends Component {
  static contextType = measureSystemContext;

  render() {
    const { isImperial, handler } = this.context;
    const buttons = (() => {
      if (isImperial) {
        return (
          <>
            <button 
            onClick={() => handler(false, true)}
            >°C</button>
            /
            <button disabled>°F</button>
          </>
        )
      } else {
        return (
          <>
            <button disabled>°C</button>
            /
            <button
            onClick={() => handler(true, true)}
            >°F</button>
          </>
        )
      }
    })();

    return (
      <Wrapper>
        {buttons}
      </Wrapper>
    );
  }
}

export default MeasureSystemSwitcher
