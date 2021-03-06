import { React, Fragment } from 'react';
import GlobalStyle from './components/globalStyles.js';
import styled from 'styled-components';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Main from './components/Main';

const AppStyled = styled.div`
  text-align: center;
  /* font-family: 'Open Sans Condensed', sans-serif; */
  /* font-family: 'Noto Sans HK', sans-serif !important; */
  font-family: 'Montserrat', sans-serif !important;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppStyled>
        <Main />
      </AppStyled>
    </>
  );
}

export default App;
