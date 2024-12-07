import React, { Fragment, useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../context/LayoutContext.jsx';
import { Sidebar } from 'primereact/sidebar';
import SidebarContent from './components/SidebarContent/SidebarContent.jsx';

function SidebarCustom() {
  const { sidebarIsOpen, setSidebarIsOpen } = useContext(LayoutContext);
  const [sidebarStyles, setSidebarStyles] = useState();
  const [windowWidth, setWindowWidth] = useState()

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

  useEffect(() => {
    const updateReportWidth = () => {
      const calculatedWidth = window.innerWidth;
      setWindowWidth(calculatedWidth);
    };

    updateReportWidth(); // Первичное обновление при монтировании компонента

    const handleResize = () => {
      updateReportWidth(); // Обновление при изменении размера окна
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarIsOpen]);

  return (
    <Fragment>
      {windowWidth < 992 ? (
        <Sidebar
          visible={sidebarIsOpen}
          onHide={() => setSidebarIsOpen(false)}
          content={({ closeIconRef, hide }) => (
            <SidebarContent closeIconRef={closeIconRef} hide={hide} />
          )} />
      ) : (
        <SidebarContent />
      )}
    </Fragment>
  );
}

export default SidebarCustom;
