import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './config/ReactotronConfig';

import history from './services/history';
import Routes from './routes';

import GlobalStyles from './styles/global';

function App() {
  return (
    <BrowserRouter history={history}>
      <Routes />
      <GlobalStyles />
    </BrowserRouter>
  );
}

export default App;
