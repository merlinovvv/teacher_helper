import React, { useContext, useState, useEffect } from 'react'
import { useGetUser } from '../../../../../shared/hooks/useGetUser';
import { useUpdateUser } from '../../../../../shared/hooks/useUpdateUser';
import { reportTypes } from '../../../../../shared/utils/constants'
import DropdownField from '../../../../../shared/fields/DropdownField/DropdownField';
import { Form, Formik } from 'formik';
import { LayoutContext } from '../../../../../context/LayoutContext';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

export default function ReportType() {
    const { toast } = useContext(LayoutContext)
    const [payload, setPayload] = useState({})
    const { data: userData, mutate: getUserData, isSuccess: userDataSuccess, isPending: userDataLoading } = useGetUser()
    const { data: userUpdateData, mutate: getUserUpdate, isSuccess: userUpdateSuccess, isPending: userUpdateLoading } = useUpdateUser(payload)

    async function handleSubmit(values) {
        await setPayload(values)
        getUserUpdate()
    }

    useEffect(() => {
        if (userUpdateSuccess && userUpdateData) {
            toast.current.show({
                severity: userUpdateData?.success ? 'success' : 'error',
                summary: 'Тип звіту',
                detail: userUpdateData?.message
            })
            getUserData()
        }
    }, [userUpdateSuccess])

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <Formik enableReinitialize initialValues={userData?.user || {}} onSubmit={async (values) => handleSubmit(values)}>
            {({ values, handleChange }) => (
                <Form className="flex gap-2 w-full">
                    <div className='formgrid w-full'>
                        <DropdownField
                            label="Тип звітів"
                            placeholder="Виберіть тип звітів"
                            options={reportTypes}
                            name="type_report"
                            onChange={handleChange}
                            value={values.type_report}
                        />
                    </div>
                    <Panel className='w-20rem' header="Збереження">
                        <Button
                            label="Зберегти"
                            icon="pi pi-save"
                            type="submit"
                            loading={userDataLoading || userUpdateLoading}
                        />
                    </Panel>
                </Form>
            )}
        </Formik>

    )
}
