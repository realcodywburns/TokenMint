import React from 'react';
import ReactDOM from 'react-dom';
import TokenApp from './app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<TokenApp />, document.getElementById('root'));
registerServiceWorker();
