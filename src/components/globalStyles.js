import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 14px;
  };

  * {
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: 'Montserrat', sans-serif !important;
  }

  @media screen and (max-width: 340px) {
    :root {
      font-size: 12px;
    };
  }
`;

export default GlobalStyle;
