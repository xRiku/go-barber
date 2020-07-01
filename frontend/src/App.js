import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './config/ReactotronConfig';

import history from './services/history';
import Routes from './routes';

function App() {
  return (
    <BrowserRouter history={history}>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
