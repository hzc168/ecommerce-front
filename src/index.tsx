import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import Routes from './Routes';
import store from './store';
import { history } from './store'
import 'antd/dist/antd.css'
import './style.css'
import AnotherStore from './anotherStore';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AnotherStore>
        <Routes />
      </AnotherStore>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

