import React, { useContext, useEffect, useState } from 'react';
import Category from './components/Category/Category';
import Item from './components/Item/Item';
import { LayoutContext } from '../../../context/LayoutContext.jsx';

function Sidebar() {
  const { sidebarIsOpen } = useContext(LayoutContext);
  const [sidebarStyles, setSidebarStyles] = useState();

  useEffect(() => {
    if (sidebarIsOpen) {
      setSidebarStyles({
        opacity: '1',
        pointerEvents: 'all',
        transform: 'translateX(0%)',
        transition: 'all 0.2s ease 0s',
        width: '320px',
      });
    } else {
      setSidebarStyles({
        transform: 'translateX(-100%)',
        transition: 'all 0.2s ease 0s',
        width: '0',
        opacity: '0',
        pointerEvents: 'none',
      });
    }
  }, [sidebarIsOpen]);

  return (
    <div
      style={sidebarStyles}
      className="min-h-screen flex relative lg:static surface-50 border-round border-1 surface-border"
    >
      <div
        id="app-sidebar-2"
        className="h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 select-none w-full"
      >
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
            <span className="text-2xl font-bold flex align-items-center gap-2"><div style={{width: '25px', height: '25px'}} className="bg-primary-500 border-circle"></div>Teacher Helper</span>
          </div>
          <div className="overflow-y-auto">
            <Category title="Меню">
              <Item to="grades-by-groups" title="Оцінки за групами" />
            </Category>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
