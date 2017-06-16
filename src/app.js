import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { Route } from 'react-router';
import { store } from './store/store.js';
import Main from './components/main';
import About from './components/info/about';

class TokenApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
            <Route exact path="/" component={Main}/>
            <Route path="/about" component={About}/>
        </div>
      </Provider>
    );
  }
}

export default TokenApp;

