import CounterText from './CounterText';
import { tree } from 'rendering';

const Counter = ({ dispatch, counter }) => (
  <div>
    <CounterText counter={counter} />
    <button onClick={() => dispatch({type: 'INCREMENT'})}>+</button>
    <button onClick={() => dispatch({type: 'DECREMENT'})}>-</button>
  </div>
);

export default Counter;
