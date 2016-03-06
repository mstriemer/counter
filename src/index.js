import counter from './reducers/counter';
import { createStore } from 'redux';
import Counter from './components/Counter';

const store = createStore(counter);

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(Counter({ store }));
}

store.subscribe(render);
render();
