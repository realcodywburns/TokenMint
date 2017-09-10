import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { Route } from 'react-router';
import { store } from './store/store.js';
import Main from './components/main';
import About from './components/info/about';
import ViewIco from './components/ico/view';
import ShowWallet from './components/wallet/show';
import ShapeShift from './components/transaction/shapeshift';
import Blank from './components/blank';

class TokenApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
            <Route exact path="/" component={Main}/>
            <Route path="/about" component={About}/>
            <Route path="/ss" component={ShapeShift}/>
            <Route path="/blank" component={Blank}/>
            <Route path="/ico/:id" component={ViewIco}/>
            <Route path="/addr/:addr" component={ShowWallet}/>
        </div>
      </Provider>
    );
  }
}

export default TokenApp;

