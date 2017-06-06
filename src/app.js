import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { store } from './store/store.js';
import Main from './components/main';

class TokenApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default TokenApp;

