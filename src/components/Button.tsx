import type { FC } from 'react';
import NewButton, { ButtonProps as NewButtonProps } from './ui/Button';

export type ButtonProps = NewButtonProps;

const Button: FC<ButtonProps> = (props) => {
  return <NewButton {...props} />;
};

export default Button;
export { Button as LegacyButton };