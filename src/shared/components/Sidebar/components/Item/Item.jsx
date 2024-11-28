import React from 'react';
import { Ripple } from 'primereact/ripple';
import { NavLink } from 'react-router-dom';

function Item({ title, to, icon = 'pi pi-circle' }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          'p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ' +
          (isActive && 'surface-200')
        }
      >
        <i className={'mr-2 ' + icon}></i>
        <span className="font-medium">{title}</span>
        <Ripple />
      </NavLink>
    </li>
  );
}

export default Item;
