import React, { useContext, useEffect } from 'react';
import { useCheckPayments } from './data/useCheckPayments.js';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import Header from '../../shared/components/Header/Header.jsx';
import { LayoutContext } from '../../context/LayoutContext.jsx'

function Payment() {
  const { setGlobalTitle } = useContext(LayoutContext)
  const { data: paymentsData, refetch: getCheckPayments } = useCheckPayments()
  const navigate = useNavigate();

  useEffect(() => {  
    if (paymentsData?.user) {
      navigate('/')
    }
  }, [paymentsData]);

  useEffect(() => {
    getCheckPayments()
    setGlobalTitle('Тарифи')
  }, [])

  return (
    <div className="">
      <Header withoutSidebar={true} />
      <div className="flex flex-column justify-content-center align-items-center w-full">
        <div className="text-900 font-bold text-6xl mt-4 mb-4 text-center">Тарифи</div>
        <div className="text-700 text-xl mb-6 text-center line-height-3">Достатньо оплатити один раз, щоб користуватися зручною платформою</div>

        <div className="grid justify-content-center align-items-center w-full">
          <div style={{maxWidth: 500}} className="w-full">
            <div className="p-3 h-full">
              <div className="surface-card shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                <div className="text-900 font-medium text-xl mb-2">Стандарт</div>
                <div className="text-600">Для одного вчителя</div>
                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                <div className="flex align-items-center">
                  <span className="font-bold text-2xl text-900 text-red-500 flex align-items-start gap-2">₴99 <span className='line-through text-color text-lg'>₴400</span></span>
                  <span className="ml-2 font-medium text-600">одноразово</span>
                </div>
                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                <ul className="list-none p-0 m-0 flex-grow-1">
                  <li className="flex align-items-center mb-3">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Особистий акаунт</span>
                  </li>
                  <li className="flex align-items-center mb-3">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Можливість додавати/перезавантажувати необмежену кількість звітів</span>
                  </li>
                  <li className="flex align-items-center mb-3">
                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                    <span>Будь-яка кількість класів, предметів і груп оцінок для них</span>
                  </li>
                </ul>
                <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                <div className="flex flex-column gap-2 align-items-center w-full">
                  <Button onClick={() => window.open('https://donatello.to/GradesHelper', '_blank')} icon="pi pi-external-link" label="Придбати за допомогою Donatello" className="w-full mt-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Payment;