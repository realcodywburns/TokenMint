import React from 'react';
import ReactDOM from 'react-dom';
import TokenApp from './app';
import {start as startStore} from './store/store.js';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';

import { HashRouter } from 'react-router-dom';

ReactDOM.render((
  <HashRouter>
    <TokenApp/>
  </HashRouter>
    ), document.getElementById('root'));
startStore();
registerServiceWorker();
