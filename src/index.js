import counter from './reducers/counter';
import { createStore, combineReducers } from 'redux';
import Counter from './components/Counter';
import { renderApp } from 'rendering';

renderApp(
  Counter,
  createStore(combineReducers({ counter })),
  document.getElementById('app'));
