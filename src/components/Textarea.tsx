import type { FC } from 'react';
import NewTextarea, { TextareaProps as NewTextareaProps } from './ui/Textarea';

export type TextareaProps = NewTextareaProps;

const Textarea: FC<TextareaProps> = (props) => {
  return <NewTextarea {...props} />;
};

export default Textarea;
export { Textarea as LegacyTextarea };