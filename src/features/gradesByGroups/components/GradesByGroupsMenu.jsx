import React from 'react';
import { Menubar } from 'primereact/menubar';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

function GradesByGroupsMenu() {
  const items = [
    {
      template: () => (
        <NavLink
          to="reports"
          className={({ isActive }) =>
            classNames('flex align-items-center p-menuitem-link', isActive ? 'text-primary-500' : '')
          }
        >
          <span>Розрахунок</span>
        </NavLink>
      ),
    },
    {
      template: () => (
        <NavLink
          to="settings"
          className={({ isActive }) =>
            classNames('flex align-items-center p-menuitem-link', isActive ? 'text-primary-500' : '')
          }
        >
          <span>Налаштування</span>
        </NavLink>
      ),
    },
  ];

  return <Menubar model={items} />;
}

export default GradesByGroupsMenu;
