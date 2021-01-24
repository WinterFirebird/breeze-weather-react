import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { locationContext } from './context';
import { callDirectGeocodingApi } from './apiCalls';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  font-size: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 999;
  > ul {
    border: 1px solid #fff;
    background-color: rgba(0,0,0,0.7);
    line-height: 4rem;
    list-style-type: none;
    display: flex,
    flex-direction: column;
    li {
      cursor: pointer;
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
    border-right: 1px solid #fff;
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
  static contextType = locationContext;

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
      chosenResult: null,
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
      callDirectGeocodingApi(this.searchResponseHandler, currentState.readySearchValue);
    }
    
    // if the user has chosen a location, update the weather
    if (currentState.chosenResult != prevState.chosenResult) {
      const { lat, lon, city, country } = this.state.chosenResult;
      this.context.onSearchLocationChange(lat, lon, true, false);
      this.setState({
        searchMode: false,
      })
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
          {element.city}, {element.country} 
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
    let searchResultIndex;
    if (event.target.attributes.nth) {
      searchResultIndex = event.target.attributes.nth.value;
    }
    if (searchResultIndex || searchResultIndex == 0) {
      this.setState(prevState => {
        return {
          chosenResult: prevState.searchResults[searchResultIndex],
        };
      });
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
   * updates the value of the search query if the user hasn't been typing for 2s
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
   * enables search mode
   */
  inputFocusHandler = () => {
    this.setState({
      searchMode: true,
    });
  }

  /**
   * waits 500ms and disables searchMode if the search input loses focus
   */
  inputBlurHandler = () => {
    setTimeout(() => {
      this.setState({
        searchMode: false,
      });
    }, 500);
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
    )
  }
}

export default CitySearch;

CitySearch.propTypes = {
  locationChangeCallback: PropTypes.func,
};
