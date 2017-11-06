import React from 'react';
import { render } from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import karakuriFarmApp from './reducers';
import registerServiceWorker from './registerServiceWorker';
import AppRoute from './containers/AppRoute'

const store = createStore(
  karakuriFarmApp,
  applyMiddleware(
    thunkMiddleware
  )
);

render(
  <Provider store={store}>
    <AppRoute />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
