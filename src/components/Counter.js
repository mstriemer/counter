import CounterText from './CounterText';
import { tree } from 'rendering';

const Counter = ({ dispatch, counter }) => (
  tree('div', {}, [
    tree(CounterText, { counter }),
    tree('button', {
      onClick: () => dispatch({type: 'INCREMENT'}),
    }, ['+']),
    tree('button', {
      onClick: () => dispatch({type: 'DECREMENT'}),
    }, ['-']),
  ])
);

export default Counter;
