import React from 'react';
import ReactDOM from 'react-dom';
import Home from '../../home/Home';
import { createStore } from 'redux';
import karakuriFarmApp from '../../../reducers';
import { Provider } from 'react-redux';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const store = createStore(
    karakuriFarmApp,
  );

  ReactDOM.render(
    <Provider store={store}>
      <Home />
    </Provider>
    , div);
});
