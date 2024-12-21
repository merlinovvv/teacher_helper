import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { Fragment, useState } from 'react'

export default function QuestionsButton() {
    const [show, setShow] = useState(false)
    return (
        <Fragment>
            <Dialog header="Для запитань" visible={show} onHide={() => setShow(false)}>
                <div className='text-lg max-w-30rem'>
                    <p>
                        Якщо ви не знаєте як користуватися платформою, ви можете переглянути наш відео-урок за
                        <a className="text-primary-500 font-bold underline" target='_black' href="https://youtu.be/3YYHrIS62nQ?si=GIidOdi3VNYScg0C"> посиланням <i className='pi pi-youtube'></i></a>.
                    </p>
                    <p>
                        Якщо у вас виникли проблеми з платформою, ви можете звернутися до адміністратора:
                    </p>
                    <div className="flex flex-column gap-2">
                        <a className="text-primary-500 font-bold underline" target='_black' href="https://t.me/merlinovvv"><i className='pi pi-telegram'></i> Telegram</a>
                        <a className="text-primary-500 font-bold underline" target='_black' href="mailto:merlinovandrej@gmail.com"><i className='pi pi-at'></i> merlinovandrej@gmail.com</a>
                    </div>
                </div>

            </Dialog>
            <Button
                style={{ bottom: 20, right: 20 }}
                className='fixed'
                icon="pi pi-question"
                tooltip='Маєте питання?'
                tooltipOptions={{ position: 'left' }}
                rounded
                onClick={() => setShow(true)}
            />
        </Fragment>

    )
}
