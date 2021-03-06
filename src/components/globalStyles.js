import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 14px;
  };

  * {
    margin: 0;
    padding: 0;
  }

  html {
    height: 100vh;
  }
  // html, body {
    // height: auto;
  // }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    font-family: 'Montserrat', sans-serif !important;
  }

  @media screen and (max-width: 375px) {
    :root {
      font-size: 12px;
    };
  }

  @media screen and (max-width: 340px) {
    :root {
      font-size: 10px;
    };
  }
`;

export default GlobalStyle;
