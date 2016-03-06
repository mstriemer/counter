const Button = ({ onClick, text }) => {
  const el = document.createElement('button');
  el.textContent = text;
  el.addEventListener('click', onClick);
  return el;
};

export default Button;
