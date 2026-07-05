import type { FC } from 'react';
import NewInput, { InputProps as NewInputProps } from './ui/Input';

export type InputProps = NewInputProps;

const Input: FC<InputProps> = (props) => {
  return <NewInput {...props} />;
};

export default Input;
export { Input as LegacyInput };