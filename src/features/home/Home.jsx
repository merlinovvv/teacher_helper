import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';
import Sidebar from '../../shared/components/Sidebar/Sidebar.jsx';
import Header from '../../shared/components/Header/Header.jsx';
import { useCheckPayments } from '../payment/data/useCheckPayments.js';

function Home() {
  const { isLogin } = useContext(LayoutContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {data: paymentsData, isFetching: isLoadingPayments} = useCheckPayments()

  useEffect(() => {
    if(paymentsData){
      if (pathname !== '/' && pathname !== '/authorize' && !isLogin) {
        navigate('/authorize');
      } else if (isLogin && !paymentsData?.user && pathname !== '/payment' && pathname !== '/'){
        navigate('/payment');
      }
    }
    
  
  }, [pathname, paymentsData]);

  return (
    <div className="flex gap-2 p-1">
      <Sidebar />
      <div className="flex flex-column gap-2 w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
