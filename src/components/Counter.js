import Button from './Button';
import CounterText from './CounterText';

const Counter = ({ store }) => {
  const state = store.getState();
  const root = document.createElement('div');
  root.appendChild(CounterText({ state }));
  root.appendChild(Button({
    onClick: () => store.dispatch({type: 'INCREMENT'}),
    text: '+',
  }));
  root.appendChild(Button({
    onClick: () => store.dispatch({type: 'DECREMENT'}),
    text: '-',
  }));
  return root;
};

export default Counter;
