import React, { useRef } from 'react';
import { StyleClass } from 'primereact/styleclass';
import { Ripple } from 'primereact/ripple';

function Category({ children, title }) {
  const btnRef = useRef();
  return (
    <ul className="list-none p-3 m-0">
      <li>
        <StyleClass
          nodeRef={btnRef}
          selector="@next"
          enterClassName="hidden"
          enterActiveClassName="slidedown"
          leaveToClassName="hidden"
          leaveActiveClassName="slideup"
        >
          <div
            ref={btnRef}
            className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
          >
            <span className="font-medium uppercase">{title}</span>
            <i className="pi pi-chevron-down"></i>
            <Ripple />
          </div>
        </StyleClass>
        <ul className="list-none p-0 m-0 overflow-hidden">{children}</ul>
      </li>
    </ul>
  );
}

export default Category;
