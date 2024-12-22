import React, { createContext, useEffect, useRef, useState } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { checkToken } from '../shared/utils/utils.js';
import { jwtDecode } from 'jwt-decode';

export const LayoutContext = createContext(); // Создаём контекст

function LayoutProvider({ children }) {
  const [login, setLogin] = useState(localStorage.getItem('login'))
  const [sidebarIsOpen, setSidebarIsOpen] = useState(window.innerWidth >= 992);
  const [globalTitle, setGlobalTitle] = useState('');
  const [isLogin, setIsLogin] = useState(checkToken(localStorage.getItem('access_token')));
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [role, setRole] = useState()
  const toast = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      const decodeToken = jwtDecode(localStorage.getItem('access_token'));
      if (decodeToken?.user_role === 'admin') {
        setRole('admin')
      }
    }
  }, [localStorage.getItem('access_token')])

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
        login,
        setLogin,
        role
      }}
    >
      <ConfirmPopup />
      <Toast ref={toast} />
      {children}
    </LayoutContext.Provider>
  );
}

export default LayoutProvider;
