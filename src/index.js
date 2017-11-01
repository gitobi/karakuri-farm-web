import React from 'react';
import { render } from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import karakuriFarmApp from './reducers';
import { renameMe, signUpMe } from './actions/me';
import Home from './components/Home';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  karakuriFarmApp,
  applyMiddleware(
    thunkMiddleware
  )
);

console.log(store.getState());
store.dispatch(renameMe('Samurai'));
console.log(store.getState());

store
  .dispatch(signUpMe('deraru', 'deraru@gmail.com', 'P@ssw0rd'))
  .then(() => console.log(store.getState()));

render(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
