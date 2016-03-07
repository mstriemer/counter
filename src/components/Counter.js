import Button from './Button';
import CounterText from './CounterText';
import { tree } from 'rendering';

const Counter = ({ store }) => {
  const state = store.getState();
  return tree('div', {}, [
    tree(CounterText, { state }),
    tree(Button, {
      onClick: () => store.dispatch({type: 'INCREMENT'}),
      text: '+',
    }),
    tree(Button, {
      onClick: () => store.dispatch({type: 'DECREMENT'}),
      text: '-',
    }),
  ]);
};

export default Counter;
