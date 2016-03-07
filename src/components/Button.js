import { tree } from 'rendering';

const Button = ({ onClick, text }) => tree('button', { onClick }, [text]);

export default Button;
