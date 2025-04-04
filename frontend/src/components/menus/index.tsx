import React from 'react';
import { MenuProvider } from './MenuContext';
import { HomeMenu } from './HomeMenu';

export const MenusRoot: React.FC = () => {
  return (
    <MenuProvider>
      <HomeMenu />
    </MenuProvider>
  );
};

export { HomeMenu } from './HomeMenu';
export { useMenuContext } from './MenuContext';
