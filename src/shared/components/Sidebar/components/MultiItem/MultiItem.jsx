import React, { useRef } from 'react';
import { StyleClass } from 'primereact/styleclass';
import { Ripple } from 'primereact/ripple';
import { NavLink } from 'react-router-dom';

function MultiItem({ title, items = [] }) {
  const btnRef = useRef();

  return (
    <li>
      <StyleClass
        nodeRef={btnRef}
        selector="@next"
        enterClassName="hidden"
        enterActiveClassName="slidedown"
        leaveToClassName="hidden"
        leaveActiveClassName="slideup"
      >
        <a
          ref={btnRef}
          className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
        >
          <i className="pi pi-chart-line mr-2"></i>
          <span className="font-medium">{title}</span>
          <i className="pi pi-chevron-down ml-auto mr-1"></i>
          <Ripple />
        </a>
      </StyleClass>
      <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
        {items?.map(({ title, to }) => {
          return (
            <li key={to + title}>
              <NavLink
                to={to}
                className="p-ripple flex align-items-center no-underline cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
              >
                <i className="pi pi-chart-line mr-2"></i>
                <span className="font-medium">{title}</span>
                <Ripple />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default MultiItem;
