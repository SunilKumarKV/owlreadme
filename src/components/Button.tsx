import type { FC } from 'react';
import NewButton, { ButtonProps as NewButtonProps } from './ui/Button';

export interface ButtonProps extends NewButtonProps {
  title?: string;
}

const Button: FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <NewButton variant={variant} {...props} />;
};

export default Button;
export { Button as LegacyButton };