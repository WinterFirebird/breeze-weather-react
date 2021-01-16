import React, { Component } from 'react';
import styled from 'styled-components';
import { backgrounds, lqBackgrounds } from './media';

const BackgroundStyled = styled.div`
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
  height: 100%;
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
    height: 100vh;
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
    height: 100vh;
    object-fit: cover;
    z-index: 1;
  }
  > img:nth-child(3) {
    position: absolute;
    left: 0;
    width: 100%;
    object-fit: contain;
    z-index: 2;
  }
}
`;

class Background extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      newBackgroundsLoaded: false,
    }

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
    // Two version of image set, one without animation, one with animation.
    // The one without animation is displayed when the next image is loading, so that the next image will mount with animation. 
    let newBackgroundSetAnimated = [
      <img src={lqBackgrounds[`bg${icon}1_lq`]} alt="lq bg" />,
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
    let newBackgroundSetNotAnimated = [
      <img src={lqBackgrounds[`bg${icon}1_lq`]} alt="lq bg" />,
      <img
      src={backgrounds[`bg${icon}1`]}
      alt={`background ${icon}`}
      />,
      <img
      src={backgrounds[`bg${icon}2`]}
      alt={`background ${icon}`}
      />,
    ];

    // pushing the created imagesets to the array, to be used in the render method
    this.backgroundsArray.push(newBackgroundSetAnimated, newBackgroundSetNotAnimated);

    // a promise that resolves when all of the images are loaded
    let backgroundsLoadPromise = (() => {
      return new Promise((resolve, reject) => {
        /* on load of one of the images, checks if the other one is loaded too
          before resolving the promise */
        let i = 1;
        const imgLoadCallback = () => {
          if( i > 1) {
            resolve();
          }
          i++;
        }
  
        const img1 = new Image();
        const img2 = new Image();
  
        img1.src = backgrounds[`bg${icon}1`];
        img2.src = backgrounds[`bg${icon}2`];
        img1.onload = () => {
          imgLoadCallback();
        };
        img2.onload = () => {
          imgLoadCallback();
        };
      });
    })();

    // on promise resolve (when all of the images are loaded)
    backgroundsLoadPromise.then(response => {
      this.setState({
        newBackgroundsLoaded: true,
      });
    }).catch(err => {
      console.log(err)
    });
  } 

  // cache the backgrounds when the component mounts
  componentDidMount() {
    this.cacheBackgrounds(this.props.icon);
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
    const { newBackgroundsLoaded } = this.state;
    const bgArray = this.backgroundsArray;

    if(newBackgroundsLoaded) {
      return (
        <BackgroundStyled>
          {/* to display the penultimate item in the array, 
          which is the animated version of the new background */}
          {bgArray[`${bgArray.length - 2}`]}
        </BackgroundStyled>
      )
    } else {
      return (
        <BackgroundStyled>
          {/* to display the non-animated version of the previous background, 
          so that the animation of the new background triggers */}
          {bgArray.length >= 3 ? bgArray[`${bgArray.length - 3}`] : bgArray[0]}
        </BackgroundStyled>
      )
    }
  }
}

export default Background;
