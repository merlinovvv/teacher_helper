import React, { useContext, useEffect } from 'react';
import GradesByGroupsMenu from './components/GradesByGroupsMenu';
import { Outlet } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';

function GradesByGroups() {
  const { setGlobalTitle } = useContext(LayoutContext);

  useEffect(() => {
    setGlobalTitle('Оцінки за групами');
  }, []);

  return (
    <div className="flex flex-column gap-2">
      <GradesByGroupsMenu />
      <Outlet />
    </div>
  );
}

export default GradesByGroups;
