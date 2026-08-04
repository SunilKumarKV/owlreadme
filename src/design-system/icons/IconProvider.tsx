import React, { createContext, useContext, ReactNode } from 'react';
import { IconContextValue } from '../types/icon';

const IconContext = createContext<IconContextValue>({
  size: 'md',
  strokeWidth: 2,
});

export interface IconProviderProps extends IconContextValue {
  children: ReactNode;
}

export const IconProvider: React.FC<IconProviderProps> = ({
  size = 'md',
  strokeWidth = 2,
  color,
  children,
}) => {
  return (
    <IconContext.Provider value={{ size, strokeWidth, color }}>
      {children}
    </IconContext.Provider>
  );
};

export function useIconContext(): IconContextValue {
  return useContext(IconContext);
}

export default IconProvider;
