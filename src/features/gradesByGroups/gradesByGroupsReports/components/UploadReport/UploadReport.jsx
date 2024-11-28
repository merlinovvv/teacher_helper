import { useContext, useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { useGetSubjects } from '../../../data/useSubjects.js';
import { useGetClasses } from '../../../data/useClasses.js';
import { useSaveReport } from '../../data/useReport.js';

function UploadReport({ getReports }) {
  const { toast } = useContext(LayoutContext);
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [filePath, setFilePath] = useState();
  const [payload, setPayload] = useState();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectFileLabel, setSelectFileLabel] = useState('Обрати файл');
  const { data: subjectsData, isFetching: subjectsLoading } = useGetSubjects();
  const { data: classesData, isFetching: classesLoading } = useGetClasses();
  const {
    data: saveReportData,
    mutate: getSaveReport,
    isPending: saveReportLoading,
    isSuccess: saveReportSuccess,
  } = useSaveReport(payload);

  const initialValues = {
    subject: '',
    schoolClass: '',
  };

  function handleChangeFile(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectFileLabel(file.name);
      setFile(file);
      const path = URL.createObjectURL(file);
      setFilePath(path);
    } else {
      setSelectFileLabel('Обрати файл');
      setFile();
      setFilePath();
    }
  }

  async function handleSubmit(values) {
    await setPayload({
      file,
      filePath,
      ...values,
    });
    await getSaveReport();
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

  useEffect(() => {
    if (saveReportSuccess && saveReportData) {
      toast.current.show({
        summary: 'Звіт',
        detail: saveReportData?.message,
        severity: saveReportData?.success ? 'success' : 'error',
      });
      getReports();
    }
  }, [saveReportSuccess, saveReportData]);

  return (
    <Formik initialValues={initialValues} onSubmit={async (values) => handleSubmit(values)}>
      {({ values, handleChange }) => {
        return (
          <Form className="grid formgrid">
            <div className="field col-3 flex flex-column">
              <label htmlFor="" className="text-sm font-bold">
                Оберіть предмет
              </label>
              <Dropdown
                options={subjects}
                optionValue="_id"
                optionLabel="name"
                name="subject"
                onChange={handleChange}
                value={values?.subject}
                showClear
                loading={subjectsLoading}
                placeholder="Оберіть предмет"
              />
            </div>
            <div className="field col-3 flex flex-column">
              <label htmlFor="schoolClass" className="text-sm font-bold">
                Оберіть клас
              </label>
              <Dropdown
                options={classes}
                optionValue="_id"
                optionLabel="name"
                name="schoolClass"
                onChange={handleChange}
                value={values?.schoolClass}
                showClear
                loading={classesLoading}
                placeholder="Оберіть клас"
              />
            </div>
            <div className="field col-3 flex flex-column">
              <label htmlFor="" className="font-bold text-sm">
                Оберіть звіт
              </label>
              <Button
                disabled={!(values?.subject && values?.schoolClass)}
                label={selectFileLabel}
                icon="pi pi-file"
                onClick={(e) => {
                  e.preventDefault();
                  fileRef.current.click();
                }}
                outlined
              />
              <input className="hidden" ref={fileRef} type="file" onChange={(e) => handleChangeFile(e)} />
            </div>
            <div className="field col-3 flex flex-column">
              <label htmlFor="" className="font-bold text-sm">
                Завантажити звіт
              </label>
              <Button
                loading={saveReportLoading}
                disabled={!(values?.subject && values?.schoolClass && file)}
                icon="pi pi-upload"
                type="submit"
                className="w-full"
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default UploadReport;
