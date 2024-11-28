import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../context/LayoutContext.jsx';
import { useNavigate } from 'react-router-dom';

function Header({withoutSidebar = false}) {
  const { setSidebarIsOpen, sidebarIsOpen, globalTitle } = useContext(LayoutContext);
  const navigate = useNavigate();

  function unAuthorized() {
    localStorage.removeItem('access_token');
    navigate('/authorize');
  }

  return (
    <div className="surface-50 w-full border-round flex justify-content-between h-min py-2 px-4 border-1 surface-border">
      <div className="flex gap-3 align-items-center">
        {!withoutSidebar && <Button icon="pi pi-bars" text rounded onClick={() => setSidebarIsOpen(!sidebarIsOpen)} />}
        <span className="text-xl font-bold text-color">{globalTitle}</span>
      </div>
      <div className="flex gap-3 align-items-center">
        <Button severity="secondary" icon="pi pi-sign-out" text rounded onClick={unAuthorized} />
      </div>
    </div>
  );
}

export default Header;
