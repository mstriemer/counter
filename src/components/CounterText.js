const CounterText = ({ state }) => {
  const el = document.createElement('span');
  el.textContent = `Count is ${state}`;
  return el;
};

export default CounterText;
