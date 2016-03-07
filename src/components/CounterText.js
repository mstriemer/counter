import { tree } from 'rendering';

const CounterText = ({ state }) => tree('span', {}, [`Count is ${state}`]);

export default CounterText;
