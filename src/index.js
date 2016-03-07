import counter from './reducers/counter';
import { createStore, combineReducers } from 'redux';
import Counter from './components/Counter';
import { tree, renderTree } from 'rendering';

const store = createStore(combineReducers({ counter }));

const container = document.getElementById('app');

function render() {
  container.innerHTML = '';
  const state = store.getState();
  const dispatch = store.dispatch;
  renderTree(tree(Counter, { dispatch, ...state }), container);
}

store.subscribe(render);
render();
