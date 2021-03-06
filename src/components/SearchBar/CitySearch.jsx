import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { locationContext } from '../../context';
import  api from '../../api';
import { countryCodeToName } from '../../utils/countryNames';

const Wrapper = styled.div`
  font-size: 1.2rem;
  border-right: 1px solid #fff;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 999;
  > ul {
    border: 1px solid #fff;
    border-top: none;
    background-color: rgba(0,0,0,0.8);
    padding: 4px 8px;
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    line-height: 4rem;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    li {
      cursor: pointer;
      border-bottom: 1px solid rgba(256,256,256,0.3); 
    }
  }
`;

const SearchWrapper = styled.div`
  i {
    margin: 1rem;
    height: 100% !important;
  };
  input {
    background-color: rgba(0,0,0,0.3);
    border: none;
    border-left: 1px solid #fff;
    color: #fff;
    padding: 0.2rem 0.6rem;
    height: 100%;
  };
  input:focus {
    outline: none;
  };
  input::placeholder {
    color: #fff;
    opacity: 0.5;
    font-family: inherit;
  };
`;

class CitySearch extends Component {
  static contextType = locationContext

  constructor(props) {
    super(props);
    this.state = {
      searchMode: false,
      searchValue: '',
      readySearchValue: '',
      searchResults: [
        {
          city: null,
          country: null,
          lat: null,
          lon: null,
        }
      ],
    };
    this.inputElement = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const currentState = this.state;
    // make an api call only if there is a ready search query (2sec have passed since typing)
    // and if the last ready search query has changed  
    if (currentState.readySearchValue == currentState.searchValue 
      && 
      currentState.readySearchValue != prevState.readySearchValue 
      && currentState.searchMode) {
      api.callDirectGeocodingApi(this.searchResponseHandler, currentState.readySearchValue);
    }
  }

  /**
   * returns a JSX list of search results from a given array
   * @param {object} array 
   */
  toJSXList = (array) => {
    let JSXList;
    // if the array isn't empty
    if (array[0] && array[0].city) {
      JSXList = <ul>{array.map((element, index) => {
        return <li key={index} onClick={(event) => this.searchOptionClickHandler(event)} nth={index}>
          <Icon name="building outline" />
          {element.city}, {countryCodeToName(element.country)} 
          </li>
      })}</ul>;
    } else {
      JSXList = null;
    }
    return JSXList;
  }

  /**
   * updates the weather from the choosen search result
   * @param {object} event 
   */
  searchOptionClickHandler = (event) => {
    if(event.target.attributes.nth) {
      let index = event.target.attributes.nth.value;
      const { lat, lon, city, country } = this.state.searchResults[index];
      this.context.onSearchLocationChange(lat, lon, true, false, false, city, country);
    }
  }

  /**
   * updates the search results array in the state from the response of the direct search api
   * @param {object} response 
   */
  searchResponseHandler = (response) => {
    let resultsArray = [];
    response.data.forEach((element, index) => {
      let result = {
        city: element.name,
        country: element.country,
        lat: element.lat,
        lon: element.lon,
      };
      resultsArray.push(result);
    });
    this.setState({
      searchResults: resultsArray,
    });
  }

  /**
   * handles the change of search input 
   */
  inputChangeHandler = () => {
    let val = this.inputElement.current.value;
    if (val.length > 1) {
      setTimeout(() => {
        this.setState(prevState => {
          if (prevState.searchValue != this.state.readySearchValue) {
            return {
              readySearchValue: prevState.searchValue,
            };
          }
        });
      }, 2000);
    }
    this.setState({
      searchValue: val,
    });
  }

  /**
   * disables search mode
   */
  inputFocusHandler = () => {
    this.setState({
      searchMode: true,
    });
  }

  /**
   * waits 100ms and disables searchMode, has to wait so that the list closes after click on a result
   */
  inputBlurHandler = () => {
    setTimeout(() => {
      this.setState({
        searchMode: false,
      });
    }, 100);
  }
  
  render() {
    const { searchMode, searchResults } = this.state;
    const resultsJSXList = this.toJSXList(searchResults);

    return (
      <Wrapper>
        <SearchWrapper>
          <Icon name="search" />
          <input 
          ref={this.inputElement} 
          type="text" 
          placeholder="Search" 
          value={this.state.searchValue} 
          onFocus={this.inputFocusHandler}
          onChange={this.inputChangeHandler}
          onBlur={this.inputBlurHandler}
          />
        </SearchWrapper>
        {searchMode? resultsJSXList : null}
      </Wrapper>
    );
  }
}

export default CitySearch;

CitySearch.propTypes = {
  locationChangeCallback: PropTypes.func,
};
