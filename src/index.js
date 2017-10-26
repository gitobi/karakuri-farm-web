import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import karakuriFarmApp from './reducers'
import Home from './components/Home';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(karakuriFarmApp);

console.log(store.getState());

render(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
