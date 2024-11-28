import React, { createContext, useRef, useState } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { checkToken } from '../shared/utils/utils.js';

export const LayoutContext = createContext(); // Создаём контекст

function LayoutProvider({ children }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const [globalTitle, setGlobalTitle] = useState('');
  const [isLogin, setIsLogin] = useState(checkToken(localStorage.getItem('access_token')));
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const toast = useRef(null);
  return (
    <LayoutContext.Provider
      value={{
        setSidebarIsOpen,
        sidebarIsOpen,
        setGlobalTitle,
        globalTitle,
        toast,
        isLogin,
        setIsLogin,
        setAccessToken,
        accessToken,
      }}
    >
      <ConfirmPopup />
      <Toast ref={toast} />
      {children}
    </LayoutContext.Provider>
  );
}

export default LayoutProvider;
