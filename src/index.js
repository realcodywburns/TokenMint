import React from 'react';
import ReactDOM from 'react-dom';
import TokenApp from './app';
import {start as startStore} from './store/store.js';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';

ReactDOM.render(<TokenApp />, document.getElementById('root'));
startStore();
registerServiceWorker();
