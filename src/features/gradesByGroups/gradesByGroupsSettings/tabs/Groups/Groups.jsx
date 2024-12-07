import { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useGetGradesByGroupsSettings, useSaveGradesByGroupsSettings } from '../../../data/useGradesByGroupsSettings.js';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { Panel } from 'primereact/panel';
import Loading from '../../../../../shared/components/Loading/Loading.jsx';
import { Message } from 'primereact/message';
import * as Yup from 'yup';
import TextField from '../../../../../shared/fields/TextField/TextField.jsx';
import CalendarField from '../../../../../shared/fields/CalendarField/CalendarField.jsx';
import AccordionHeaderTemplate from './components/AccordionHeaderTemplate.jsx';
import { useGetSubjects } from '../../../data/useSubjects.js';
import { useGetClasses } from '../../../data/useClasses.js';

function Groups() {

  const { toast } = useContext(LayoutContext);
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
  const { data: subjectsData, isPending: subjectsLoading } = useGetSubjects();
  const { data: classesData, isPending: classesLoading } = useGetClasses();

  const validationSchema = Yup.array().of(Yup.object().shape({
    schoolClass: Yup.string().required("Оберіть клас!"),
    subject: Yup.string().required("Оберіть предмет!"),
    groups: Yup.array().of(Yup.object().shape({
      name: Yup.string().required('Введіть назву групи'),
      control_dates: Yup.array(),
      assigment_dates: Yup.array()
    }))
  }))

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

  return false ? (
    <Loading />
  ) : (
    <Formik validationSchema={validationSchema} enableReinitialize initialValues={groups} onSubmit={(values) => handleSubmit(values)}>
      {({ values, handleChange, setFieldValue, dirty, errors, touched }) => {
        return (
          <Form className="flex gap-2 lg:flex-row flex-column">
            <div className="flex flex-column gap-2 lg:w-10 w-full">
              <Accordion>
                {values?.map(({ subject, groups }, indexSubject) => {
                  return (
                    <AccordionTab
                      key={`${indexSubject}`}
                      headerTemplate={<AccordionHeaderTemplate subjectsData={subjectsData} classesData={classesData} index={indexSubject} setGroups={setGroups} />}
                    >
                      {groups?.map((item, indexGroup) => {
                        return (
                          <div key={`${subject}-${indexGroup}-${indexSubject}`}>
                            <div className="flex gap-4 flex-column">
                              <div className='flex justify-content-between align-items-center'>
                                <span className="font-bold text-xl">{indexGroup + 1} група</span>
                                <Button
                                  text
                                  severity="danger"
                                  onClick={(e) =>
                                    handleDeleteGroup(subject, indexSubject, setFieldValue, values, indexGroup, e)
                                  }
                                  icon="pi pi-trash"
                                />
                              </div>
                              <div className="grid formgrid w-full">
                                <TextField
                                  label="Назва групи"
                                  name={`${indexSubject}.groups.${indexGroup}.name`}
                                  value={values[indexSubject].groups[indexGroup].name}
                                  onChange={handleChange}
                                />
                                <CalendarField
                                  selectionMode="multiple"
                                  numberOfMonths={2}
                                  name={`${indexSubject}.groups.${indexGroup}.assigment_dates`}
                                  value={values[indexSubject].groups[indexGroup].assigment_dates?.map(
                                    (date) => new Date(date)
                                  )}
                                  onChange={handleChange}
                                  label="Дати завдань"
                                />
                                <CalendarField
                                  selectionMode="multiple"
                                  numberOfMonths={2}
                                  name={`${indexSubject}.groups.${indexGroup}.control_dates`}
                                  value={values[indexSubject].groups[indexGroup].control_dates?.map(
                                    (date) => new Date(date)
                                  )}
                                  onChange={handleChange}
                                  label="Дати контролів"
                                />
                              </div>
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
            <Panel header="Збереження" className="lg:w-2 w-full">
              <div className='flex flex-column gap-2'>
                {dirty && (
                  <Message severity="warn" text="Є не збережені зміни" />
                )}
                {(Object.keys(errors)?.length !== 0 && Object.keys(touched)?.length !== 0) && (
                  <Message severity="error" text="Перевірте правильність введених даних" />
                )}
                <Button
                  disabled={(Object.keys(errors)?.length !== 0 && Object.keys(touched)?.length !== 0)}
                  loading={saveGradesByGroupsLoading || gradesByGroupsLoading}
                  className="w-full"
                  label="Зберегти"
                  icon="pi pi-save"
                  type="submit"
                />
              </div>

            </Panel>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Groups;
