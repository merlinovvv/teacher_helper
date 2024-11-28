import { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useGetSubjects } from '../../../data/useSubjects.js';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import {
  useGetGradesByGroupsSettings,
  useSaveGradesByGroupsSettings,
} from '../../../data/useGradesByGroupsSettings.js';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { Panel } from 'primereact/panel';
import Loading from '../../../../../shared/components/Loading/Loading.jsx';
import { useGetClasses } from '../../../data/useClasses.js';

function Groups() {
  const { toast } = useContext(LayoutContext);
  const { data: subjectsData, isPending: subjectsLoading } = useGetSubjects();
  const { data: classesData, isPending: classesLoading } = useGetClasses();
  const [groups, setGroups] = useState([]);
  const {
    data: saveGradesByGroupsData,
    mutate: saveGradesByGroups,
    isPending: saveGradesByGroupsLoading,
    isSuccess: saveGradesByGroupsSuccess,
  } = useSaveGradesByGroupsSettings(groups);
  const {
    data: gradesByGroupsData,
    refetch: getGradesByGroups,
    isFetching: gradesByGroupsLoading,
  } = useGetGradesByGroupsSettings();
  const [subjects, setSubjects] = useState();
  const [classes, setClasses] = useState();

  function handleAddGroup(nameSubject, indexSubject, setFieldValue, values, e) {
    e.preventDefault();
    setFieldValue(`${indexSubject}.groups`, [
      ...values[indexSubject].groups,
      {
        name: '',
        assigment_dates: [],
        control_dates: [],
      },
    ]);
  }

  function handleDeleteGroup(nameSubject, indexSubject, setFieldValue, values, indexGroup, e) {
    e.preventDefault();
    setFieldValue(`${indexSubject}.groups`, [
      ...values[indexSubject].groups?.filter((_, index) => index !== indexGroup),
    ]);
  }

  function accordionHeaderTemplate(subject, index, handleChange, values) {
    return (
      <div className="flex align-items-center justify-content-between w-full">
        <span className="flex align-items-center gap-2 w-full">
          <Dropdown
            value={values[index].subject}
            options={subjects || []}
            optionValue="_id"
            optionLabel="name"
            name={`${index}.subject`}
            onChange={handleChange}
            placeholder="Оберіть предмет"
          />
          <Dropdown
            value={values[index].schoolClass}
            options={classes || []}
            optionValue="_id"
            optionLabel="name"
            name={`${index}.schoolClass`}
            onChange={handleChange}
            placeholder="Оберіть клас"
          />
        </span>
        <Button icon="pi pi-times" text onClick={(e) => handleDeleteSubjectClass(e, index)} severity="danger" />
      </div>
    );
  }

  function handleAddSubjectClass(e) {
    e.preventDefault();
    setGroups([
      ...groups,
      {
        subject: '',
        schoolClass: '',
        groups: [
          {
            name: '',
            assigment_dates: [],
            control_dates: [],
          },
        ],
      },
    ]);
  }

  function handleDeleteSubjectClass(e, index) {
    e.preventDefault();
    setGroups([...groups?.filter((_, indexGroup) => indexGroup !== index)]);
  }

  async function handleSubmit(values) {
    await setGroups(values);
    await saveGradesByGroups();
  }

  useEffect(() => {
    if (saveGradesByGroupsSuccess) {
      toast.current.show({
        severity: saveGradesByGroupsData?.success ? 'success' : 'error',
        summary: 'Групи оцінок',
        detail: saveGradesByGroupsData?.message,
      });
      getGradesByGroups();
    }
  }, [saveGradesByGroupsSuccess]);

  useEffect(() => {
    if (gradesByGroupsData) {
      setGroups(gradesByGroupsData?.groups || []);
    }
  }, [gradesByGroupsData]);

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

  return subjectsLoading || classesLoading ? (
    <Loading />
  ) : (
    <Formik enableReinitialize initialValues={groups} onSubmit={(values) => handleSubmit(values)}>
      {({ values, handleChange, setFieldValue }) => {
        return (
          <Form className="flex gap-2">
            <div className="flex flex-column gap-2 w-10">
              <Accordion>
                {values?.map(({ subject, groups }, indexSubject) => {
                  return (
                    <AccordionTab
                      key={`${indexSubject}`}
                      headerTemplate={(e) => accordionHeaderTemplate(subject, indexSubject, handleChange, values)}
                    >
                      {groups?.map((item, indexGroup) => {
                        return (
                          <div key={`${subject}-${indexGroup}-${indexSubject}`}>
                            <div className="flex gap-6 align-items-center">
                              <span className="font-bold text-xl">{indexGroup + 1}</span>
                              <div className="grid formgrid w-full">
                                <div className="field col-12 flex flex-column">
                                  <label
                                    htmlFor={`${indexSubject}.groups.${indexGroup}.name`}
                                    className="font-bold text-sm"
                                  >
                                    Назва групи
                                  </label>
                                  <InputText
                                    value={values[indexSubject].groups[indexGroup].name}
                                    name={`${indexSubject}.groups.${indexGroup}.name`}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="field col-12 flex flex-column">
                                  <label
                                    htmlFor={`${indexSubject}.groups.${indexGroup}.assigment_dates`}
                                    className="font-bold text-sm"
                                  >
                                    Дати завдань
                                  </label>
                                  <Calendar
                                    locale="uk"
                                    showIcon
                                    selectionMode="multiple"
                                    readOnlyInput
                                    numberOfMonths={2}
                                    name={`${indexSubject}.groups.${indexGroup}.assigment_dates`}
                                    value={values[indexSubject].groups[indexGroup].assigment_dates?.map(
                                      (date) => new Date(date)
                                    )}
                                    onChange={handleChange}
                                    touchUI
                                    dateFormat="dd.mm.yy"
                                  />
                                </div>
                                <div className="field col-12 flex flex-column">
                                  <label
                                    htmlFor={`${indexSubject}.groups.${indexGroup}.control_dates`}
                                    className="font-bold text-sm"
                                  >
                                    Дати контролів
                                  </label>
                                  <Calendar
                                    locale="uk"
                                    showIcon
                                    selectionMode="multiple"
                                    readOnlyInput
                                    numberOfMonths={2}
                                    name={`${indexSubject}.groups.${indexGroup}.control_dates`}
                                    value={values[indexSubject].groups[indexGroup].control_dates?.map(
                                      (date) => new Date(date)
                                    )}
                                    onChange={handleChange}
                                    touchUI
                                    dateFormat="dd.mm.yy"
                                  />
                                </div>
                              </div>
                              <Button
                                text
                                severity="danger"
                                onClick={(e) =>
                                  handleDeleteGroup(subject, indexSubject, setFieldValue, values, indexGroup, e)
                                }
                                icon="pi pi-times"
                              />
                            </div>
                            <Divider className="mt-4 mb-6" />
                          </div>
                        );
                      })}
                      <Button
                        className="w-full"
                        outlined
                        size="small"
                        label="Додати группу"
                        icon="pi pi-plus"
                        onClick={(e) => handleAddGroup(subject, indexSubject, setFieldValue, values, e)}
                      />
                    </AccordionTab>
                  );
                })}
              </Accordion>
              <Button
                severity="success"
                outlined
                label="Додати предмет"
                icon="pi pi-plus"
                onClick={(e) => handleAddSubjectClass(e)}
              />
            </div>
            <Panel header="Збереження" className="w-2">
              <Button
                loading={saveGradesByGroupsLoading || gradesByGroupsLoading}
                className="w-full"
                label="Зберегти"
                icon="pi pi-save"
                type="submit"
              />
            </Panel>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Groups;
