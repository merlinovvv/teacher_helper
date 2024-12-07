import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';
import Header from '../../shared/components/Header/Header.jsx';
import { useCheckPayments } from '../payment/data/useCheckPayments.js';
import { useGetUser } from '../../shared/hooks/useGetUser.js';
import SidebarCustom from './../../shared/components/Sidebar/Sidebar';

function Home() {
  const { isLogin, login, setLogin } = useContext(LayoutContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: paymentsData, isFetching: isLoadingPayments } = useCheckPayments()
  const { data: userData, mutate: getUserData, isSuccess: userDataSuccess } = useGetUser()

  useEffect(() => {
    if (paymentsData) {
      console.log(paymentsData);
      
      if (pathname !== '/' && pathname !== '/authorize' && !isLogin) {
        navigate('/authorize');
      } else if (isLogin && !paymentsData?.user && pathname !== '/payment' && pathname !== '/') {
        navigate('/payment');
      } else {
        if (!userData) {
          getUserData()
        }
      }
    }
  }, [pathname, paymentsData]);

  useEffect(() => {
    if (userDataSuccess && userData) {
      setLogin(userData?.user?.username)
      localStorage.setItem('login', userData?.user?.username)
    }
  }, [userDataSuccess])

  return (
    <div className="flex gap-2 p-1">
      <SidebarCustom />
      <div className="flex flex-column gap-2 w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
