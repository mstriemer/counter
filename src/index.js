import counter from './reducers/counter';
import { createStore } from 'redux';
import Counter from './components/Counter';
import { tree, renderTree } from 'rendering';

const store = createStore(counter);

const container = document.getElementById('app');

function render() {
  container.innerHTML = '';
  renderTree(tree(Counter, { store }), container);
}

store.subscribe(render);
render();
