import React from 'react';
import { render } from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import karakuriFarmApp from './reducers';
import registerServiceWorker from './registerServiceWorker';
import AppRoute from './containers/AppRoute'

import { Map } from 'immutable';
import { userPool } from './js/AuthUserPool';

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const currentUser = userPool.getCurrentUser();
const initialState = {
  me: Map({
    isAuthenticated: null != currentUser,
    username: currentUser ? currentUser.username : null,
  }),
};

const store = createStore(
  karakuriFarmApp,
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    )
  )
);

const rootElement = document.getElementById('root');

render(
  <Provider store={store}>
    <AppRoute />
  </Provider>,
  rootElement
);
registerServiceWorker();
