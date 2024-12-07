import React from 'react';
import { Menubar } from 'primereact/menubar';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { MegaMenu } from 'primereact/megamenu';

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
          <span>Звіти</span>
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

  return <MegaMenu model={items}  breakpoint="360px" />
}

export default GradesByGroupsMenu;
