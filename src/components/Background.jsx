import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { backgrounds, lqBackgrounds } from './media';

const BackgroundStyled = styled.div.attrs(props => ({
  /* sets the minimum height equal to the viewport height in pixels, calculated on document load,
  so that the background will not shrink on keyboard opening on mobile browsers
  */
  height: props.height ? `${props.height}px` : '100vh',
}))`
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,0.4);
    z-index: 3;
  }
  min-height: ${props => props.height};
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  > img:nth-child(1) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(40px);
    transform: scale(1.3);
    z-index: 0;
  }
  > img:nth-child(2) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
  > img:nth-child(3) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    object-fit: contain;
    z-index: 2;
  }
}
`;

class Background extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      newBackgroundsLoaded: false,
      innerHeight: null,
    };

    this.backgroundsArray = [
      [
        <img src={lqBackgrounds[`bg${this.props.icon}1_lq`]} alt="lq bg" />
      ],
    ];
  }
  
  /**
   * for a given icon code, caches two backgrounds, and updates the state when the load is finished
   * @param {string} icon 
   */
  cacheBackgrounds = (icon) => {
    // the full version of the new background, to be mounted when the image load finishes
    let newBackgroundSetAnimated = [
      <img
      src={backgrounds[`bg${icon}1`]}
      className="animate__animated animate__fadeIn" 
      alt={`background ${icon}`}
      />,
      <img
      src={backgrounds[`bg${icon}2`]} 
      className="animate__animated animate__fadeInDown"
      alt={`background ${icon}`}
    />,
    ];

    // pushing the created imagesets to the array, to be used in the render method
    this.backgroundsArray.push(newBackgroundSetAnimated);

    // promises that resolve on image load
    const image1Promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = backgrounds[`bg${icon}1`];
      image.onload = resolve;
    });
    const image2Promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = backgrounds[`bg${icon}2`];
      image.onload = resolve;
    });

    // when both of the promises resolve inform the component that it can now mount the images
    Promise.all([image1Promise, image2Promise]).then(results => {
      this.setState({
        newBackgroundsLoaded: true,
      });
    }).catch(err => {
      console.log(err);
    });
  } 

  // cache the backgrounds when the component mounts
  componentDidMount() {
    this.cacheBackgrounds(this.props.icon);

    // for changing the min-height of the document 
    const innerHeight = document.querySelector('html').getBoundingClientRect().height;
    this.setState({
      innerHeight: innerHeight,
    });
  }

  // cache the new backgrounds on component update, if new images are needed
  componentDidUpdate(prevProps) {
    if(this.props.icon != prevProps.icon) {
      this.setState({
        newBackgroundsLoaded: false,
      });
      this.cacheBackgrounds(this.props.icon);
    }
  }

  render() {
    const { newBackgroundsLoaded, innerHeight } = this.state;
    const bgArray = this.backgroundsArray;
    const { icon } = this.props;
    return (
      <BackgroundStyled height={innerHeight}>
        {/* to display only the lq image of the new background, until the full version is loaded */}
        <img src={lqBackgrounds[`bg${icon}1_lq`]} alt={`${icon} bg`} />
        {/* to display the last item in the array, 
        which is the full version of the new background */}
        {newBackgroundsLoaded ? bgArray[`${bgArray.length - 1}`] : null}
      </BackgroundStyled>
    );
  }
}

Background.propTypes = {
  icon: PropTypes.string.isRequired,
  displayName: PropTypes.string,
};

export default Background;
