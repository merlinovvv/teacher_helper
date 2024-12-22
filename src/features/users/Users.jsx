import React from 'react'
import { useGetUsers } from './data/useUsers'
import { Panel } from 'primereact/panel'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'

export default function Users() {
    const { data: users, refetch: getUsers, isFetching: isLoadingUsers } = useGetUsers()
    const roles = {
        'user': 'Користувач',
        'admin': 'Адмін'
    }
    const severities = {
        'user': '',
        'admin': 'danger'
    }

    return (
        <Panel header="Користувачі">
            <DataTable value={users?.users || []} loading={isLoadingUsers} showGridlines stripedRows>
                <Column field='username' header="Ім'я користувача" />
                <Column field='email' header="Email" />
                <Column body={({ reports }) => reports.length} header="Кількість звітів" />
                <Column body={({ user_role }) => <Tag severity={severities[user_role]} value={roles[user_role]} />} header="Роль" />
            </DataTable>
        </Panel>
    )
}
