import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css'
import { Divider } from 'primereact/divider';
import Login from './components/login/Login';
import Registration from './components/registration/Registration.jsx';
import { LayoutContext } from '../../context/LayoutContext.jsx';

function Authorize() {
    const { login } = useContext(LayoutContext)
    const [isLoginType, setIsLoginType] = useState(login ? true : false)
    return (
        <div className="flex lg:flex-row flex-column justify-content-center min-h-screen align-items-center">
            {isLoginType ? <Login setIsLoginType={setIsLoginType} /> : <Registration setIsLoginType={setIsLoginType} />}
            <div className='lg:w-8 lg:flex hidden relative'>
                <div className='m-4 p-6 flex flex-column gap-6 surface-card border-round-3xl justify-content-center align-items-center border-1 border-gray-300 shadow-4'>
                    <div className="flex align-items-center gap-2 text-7xl font-bold text-center">
                        <img src="/logo.svg" alt="" />
                        Grades Helper
                    </div>
                    <div className="text-2xl w-9 font-light text-color text-center">
                        Платформа для шановних освітян у <span className="text-primary-500">допомозі</span> розподілу поточного та підсумкового <span className="text-primary-500">оцінювання по групах</span>, згідно нового Державного стандарту базової середньої освіти у НУШ, та виведенню з врахуванням пріоритетності та динаміки у навчальному поступі.
                    </div>
                    <Divider />
                    <div className="flex flex-column gap-3 align-items-center">
                        <div className='text-xl font-light text-color text-center'>
                            Не знаєте як <span className="text-primary-500">користуватися</span> платформою? Перегляньте наш <Link to="https://youtu.be/3YYHrIS62nQ?si=GIidOdi3VNYScg0C" target='_blank' className="text-primary-500 font-bold underline">відеоурок <i className='pi pi-youtube'></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Authorize;
