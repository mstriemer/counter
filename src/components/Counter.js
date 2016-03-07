import Button from './Button';
import CounterText from './CounterText';
import { tree } from 'rendering';

const Counter = ({ dispatch, state }) => (
  tree('div', {}, [
    tree(CounterText, { state }),
    tree(Button, {
      onClick: () => dispatch({type: 'INCREMENT'}),
      text: '+',
    }),
    tree(Button, {
      onClick: () => dispatch({type: 'DECREMENT'}),
      text: '-',
    }),
  ])
);

export default Counter;
