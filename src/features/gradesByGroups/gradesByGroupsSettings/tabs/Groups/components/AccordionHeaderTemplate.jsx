import { useFormikContext } from 'formik';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react'
import DropdownField from '../../../../../../shared/fields/DropdownField/DropdownField';

export default function AccordionHeaderTemplate({ setGroups, index, subjectsData, classesData }) {
    const [subjects, setSubjects] = useState();
    const [classes, setClasses] = useState();
    const { values, handleChange } = useFormikContext()

    function handleDeleteSubjectClass(e, index) {
        e.preventDefault();
        setGroups((prevState) => [...prevState?.filter((_, indexGroup) => indexGroup !== index)]);
    }

    useEffect(() => {
        if (subjectsData) {
            setSubjects(subjectsData?.subjects);
        }
    }, [subjectsData]);

    useEffect(() => {
        if (classesData) {
            setClasses(classesData?.classes);
        }
    }, [classesData]);

    return (
        <div className="flex align-items-center justify-content-between w-full">
            <span className="flex lg:align-items-center gap-2 w-full lg:flex-row flex-column">
                <DropdownField
                    className="col"
                    loading={!subjectsData}
                    value={values[index].subject}
                    options={subjects || []}
                    optionValue="_id"
                    optionLabel="name"
                    name={`${index}.subject`}
                    onChange={handleChange}
                    placeholder="Оберіть предмет"
                />
                <DropdownField
                    className="col"
                    loading={!classesData}
                    value={values[index].schoolClass}
                    options={classes || []}
                    optionValue="_id"
                    optionLabel="name"
                    name={`${index}.schoolClass`}
                    onChange={handleChange}
                    placeholder="Оберіть клас"
                />
            </span>
            <Button icon="pi pi-trash" text onClick={(e) => handleDeleteSubjectClass(e, index)} severity="danger" />
        </div>
    );
}
