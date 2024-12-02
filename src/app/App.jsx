import React, { useContext, useEffect } from 'react'
import AppRoutes from './AppRoutes'
import { LayoutContext } from '../context/LayoutContext'
import QuestionsButton from '../shared/components/QuestionsButton/QuestionsButton'

function App() {
    const context = useContext(LayoutContext)

    useEffect(() => {
        if (context?.globalTitle) {
            document.querySelector('title').innerHTML = `${context?.globalTitle} | Grades Helper`
        }
    }, [context?.globalTitle])

    useEffect(() => {
        if ((!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) && window.location.pathname !== '/authorize') {
            window.location.href = '/authorize'
            // window.location.reload()
        }
    }, [])

    return (
        <section>
            <AppRoutes />
            <QuestionsButton/>
        </section>
    )
}

export default App 