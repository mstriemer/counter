import { tree } from 'rendering';

const CounterText = ({ counter }) => tree('span', {}, [`Count is ${counter}`]);

export default CounterText;
