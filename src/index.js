import counter from './reducers/counter';
import { createStore } from 'redux';
import Counter from './components/Counter';
import { tree, renderTree } from 'rendering';

const store = createStore(counter);

const container = document.getElementById('app');

function render() {
  container.innerHTML = '';
  const state = store.getState();
  const dispatch = store.dispatch;
  renderTree(tree(Counter, { dispatch, state }), container);
}

store.subscribe(render);
render();
