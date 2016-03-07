/** @jsx tree */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */

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
