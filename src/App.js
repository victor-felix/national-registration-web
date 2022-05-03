import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Router } from 'react-router-dom';

import AppProvider from '~/hooks';
import Routes from '~/routes';
import GlobalStyle from '~/styles/global';
import history from '~/services/history';

function App() {
  return (
    <AppProvider>
      <Router history={history}>
        <Routes />
        <GlobalStyle />
        <ToastContainer autoClose={3000} />
      </Router>
    </AppProvider>
  );
}

export default App;
