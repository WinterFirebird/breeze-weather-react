import React, { Component } from 'react';
import styled from 'styled-components';
import { backgrounds, lqBackgrounds } from './media';
import alphaColorBg from '../assets/30_percent_opacity_black.png';

const BackgroundStyled = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background-image: url(${alphaColorBg});
  background-size: cover;
  background-attachment: fixed;

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
      imagesLoaded: false,
    }
  }
  

  cacheImages = (icon) => {
    let ico = icon;
    const retProm = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('promise initialized');
          
          let i = 1;
          const imgLoadCallback = () => {
            console.log('img load')
            if( i > 1) {
              resolve('both of the images are loaded');
            }
            i++;
          }
  
          const img1 = new Image();
          const img2 = new Image();
  
          img1.src = backgrounds[`bg${ico}1`];
          // img1.src = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg';
          img2.src = backgrounds[`bg${ico}2`];
          // img1.src = 'https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg';
          // img2.src = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg';
          img1.onload = () => {
            imgLoadCallback();
          };
          img2.onload = () => {
            imgLoadCallback();
          };
          img1.onerror = () => {
            reject('image 1 loading error');
          }
          img2.onerror = () => {
            reject('image 2 loading error');
          }
        } , 100)
      })
    }

    let promise = retProm(this.props.icon);
    promise.then(response => {
      console.log(response)
      this.setState({
        imagesLoaded: true,
      })
      // console.log()
    }).catch(err => {
      console.log(err)
      this.setState({
        imagesLoaded: false,
      })
    })
    
    console.log('this.cacheImages() initialized')
  } 

  componentDidMount() {
    this.cacheImages(this.props.icon)
  }

  componentDidUpdate() {
    // if(this.state.imagesLoaded) {
    //   this.setState(images)
    // }
  }

  render() {
    const { icon } = this.props;
    const { imagesLoaded } = this.state;

    console.log(`imagesLoaded: ${imagesLoaded}`)
    if(imagesLoaded) {
      return (
        <BackgroundStyled>
          <img src={lqBackgrounds[`bg${icon}1_lq`]} alt="lq bg" />

          <img
          src={backgrounds[`bg${icon}1`]} 
          // src='https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg' 
          className="animate__animated animate__zoomIn" 
          />

          <img
          src={backgrounds[`bg${icon}2`]} 
          className="animate__animated animate__fadeInDown" 
          />
        </BackgroundStyled>
      )
    } else {
      return (
        <BackgroundStyled>
          <img src={lqBackgrounds[`bg${icon}1_lq`]} alt="lq bg" />
        </BackgroundStyled>
      )
    }
  }
}

export default Background;
