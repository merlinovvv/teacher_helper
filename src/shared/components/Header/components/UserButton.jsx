import { Button } from 'primereact/button'
import React, { Fragment, useContext, useRef } from 'react'
import { LayoutContext } from '../../../../context/LayoutContext'
import { Menu } from 'primereact/menu'
import { useNavigate } from 'react-router-dom';

export default function UserButton() {
    const menu = useRef(null);
    const { login } = useContext(LayoutContext)
    const navigate = useNavigate()
    
    const items = [
        {
            items: [
                {
                    label: 'Вихід',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        localStorage.removeItem('access_token');
                        navigate('/authorize');
                    }
                }
            ]
        }
    ];

    return (
        <Fragment>
            <Menu model={items} popup ref={menu} id="popup_menu_right" popupAlignment="right" />
            <Button
                icon="pi pi-user"
                label={login}
                outlined
                rounded
                onClick={(event) => menu.current.toggle(event)}
            />
        </Fragment>

    )
}
