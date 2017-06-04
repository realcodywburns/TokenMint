import React, { Component } from 'react';
import logo from './img/logo.png';
import './TokenApp.css';

class TokenApp extends Component {
  render() {
    return (
      <div className="TokenApp">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Token Mint</h2>
        </div>
        <p className="App-intro">
          Hello
        </p>
      </div>
    );
  }
}

export default TokenApp;
