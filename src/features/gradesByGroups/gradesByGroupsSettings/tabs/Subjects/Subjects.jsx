import { useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { confirmPopup } from 'primereact/confirmpopup';
import { useDeleteSubjects, useGetSubjects, useSaveSubjects } from '../../../data/useSubjects.js';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';

function Subjects() {
  const { toast } = useContext(LayoutContext);
  const [subjects, setSubjects] = useState([]);
  const [payload, setPayload] = useState();
  const {
    data: saveSubjectsData,
    mutate: saveSubjects,
    isSuccess: saveSubjectsSuccess,
    isPending: saveSubjectsLoading,
  } = useSaveSubjects(payload);
  const { data: subjectsData, refetch: getSubjects, isFetching: subjectsLoading } = useGetSubjects();
  
  const [deleteId, setDeleteId] = useState();
  const {
    data: deleteSubjectsData,
    mutate: deleteSubjects,
    isPending: deleteSubjectsLoading,
  } = useDeleteSubjects(deleteId);

  const handleAddNewSubject = () => {
    setSubjects([
      ...subjects,
      {
        name: 'Змініть назву предмету',
      },
    ]);
  };

  const handleDeleteSubject = async (id) => {
    await setDeleteId(id);
    await deleteSubjects();
  };

  const onRowEditComplete = async (e) => {
    let _subjects = [...subjects];
    let { newData, index } = e;

    _subjects[index] = newData;

    await setSubjects(_subjects);
    await setPayload(newData);
    await saveSubjects();
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const footerDataTable = () => {
    return (
      <div className="flex">
        <Button label="Додати новий предмет" icon="pi pi-plus" onClick={handleAddNewSubject} />
      </div>
    );
  };

  const confirmDelete = (e, id, name) => {
    confirmPopup({
      target: e.currentTarget,
      message: `Ви впевнені, що хочете видалити предмет "${name}"?`,
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => handleDeleteSubject(id),
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
    });
  };

  useEffect(() => {
    if (saveSubjectsSuccess) {
      toast.current.show({
        severity: saveSubjectsData?.success ? 'success' : 'error',
        summary: 'Предмети',
        detail: saveSubjectsData?.message,
      });
      getSubjects();
    }
  }, [saveSubjectsSuccess]);

  useEffect(() => {
    if (subjectsData) {
      setSubjects(subjectsData?.subjects || []);
    }
  }, [subjectsData]);

  useEffect(() => {
    if (deleteSubjectsData) {
      toast.current.show({
        severity: deleteSubjectsData?.success ? 'success' : 'error',
        summary: 'Класи',
        detail: deleteSubjectsData?.message,
      });
      getSubjects();
    }
  }, [deleteSubjectsData]);

  return (
    <DataTable
      loading={subjectsLoading || saveSubjectsLoading}
      footer={footerDataTable}
      showGridlines
      value={subjects}
      editMode="row"
      dataKey="name"
      onRowEditComplete={onRowEditComplete}
    >
      <Column header="Предмет" field="name" editor={(options) => textEditor(options)} headerClassName="w-full" />
      <Column header="Ред." rowEditor />
      <Column
        header="Видалити"
        body={({ _id, name }) => (
          <Button
            disabled={deleteSubjectsLoading}
            loading={deleteSubjectsLoading && deleteId === _id}
            icon="pi pi-times"
            onClick={(e) => confirmDelete(e, _id, name)}
            severity="danger"
            text
          />
        )}
      />
    </DataTable>
  );
}

export default Subjects;
