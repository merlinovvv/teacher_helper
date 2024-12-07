import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { useDeleteClasses, useGetClasses, useSaveClasses } from '../../../data/useClasses.js';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Classes() {
  const { toast } = useContext(LayoutContext);
  const [classes, setClasses] = useState([]);
  const [payload, setPayload] = useState();
  const {
    data: saveClassesData,
    mutate: saveClasses,
    isSuccess: saveClassesSuccess,
    isPending: saveClassesLoading,
  } = useSaveClasses(payload);
  const { data: classesData, refetch: getClasses, isFetching: classesLoading } = useGetClasses();
  const [deleteId, setDeleteId] = useState();
  const {
    data: deleteClassesData,
    mutate: deleteClasses,
    isPending: deleteClassesLoading,
  } = useDeleteClasses(deleteId);

  const handleAddNewClass = () => {
    setClasses([
      ...classes,
      {
        name: 'Змініть назву класу',
      },
    ]);
  };

  const handleDeleteClass = async (id) => {
    await setDeleteId(id);
    await deleteClasses();
  };

  const onRowEditComplete = async (e) => {
    let _classes = [...classes];
    let { newData, index } = e;

    _classes[index] = newData;

    await setClasses(_classes);
    await setPayload(newData);
    await saveClasses();
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const footerDataTable = () => {
    return (
      <div className="flex">
        <Button label="Додати новий клас" icon="pi pi-plus" onClick={handleAddNewClass} />
      </div>
    );
  };

  const confirmDelete = (e, id, name, rowIndex) => {
    confirmPopup({
      target: e.currentTarget,
      message: `Ви впевнені, що хочете видалити "${name}"?`,
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => {
        if (id) {
          handleDeleteClass(id)
        } else {
          setClasses(classes?.filter((_, i) => i !== rowIndex))
        }
      },
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
    });
  };

  useEffect(() => {
    if (saveClassesSuccess) {
      toast.current.show({
        severity: saveClassesData?.success ? 'success' : 'error',
        summary: 'Класи',
        detail: saveClassesData?.message,
      });
      getClasses();
    }
  }, [saveClassesSuccess]);

  useEffect(() => {
    if (deleteClassesData) {
      toast.current.show({
        severity: deleteClassesData?.success ? 'success' : 'error',
        summary: 'Класи',
        detail: deleteClassesData?.message,
      });
      getClasses();
    }
  }, [deleteClassesData]);

  useEffect(() => {
    if (classesData) {
      setClasses(classesData?.classes || []);
    }
  }, [classesData]);

  return (
    <DataTable
      loading={classesLoading || saveClassesLoading}
      footer={footerDataTable}
      showGridlines
      value={classes}
      editMode="row"
      dataKey="name"
      onRowEditComplete={onRowEditComplete}
    >
      <Column header="Клас" field="name" editor={(options) => textEditor(options)} headerClassName="w-full" />
      <Column header="Ред." rowEditor />
      <Column
        header="Видалити"
        body={({ name, _id }, { rowIndex }) => (
          <Button
            disabled={deleteClassesLoading}
            loading={deleteClassesLoading && deleteId === _id}
            icon="pi pi-times"
            onClick={(e) => confirmDelete(e, _id, name, rowIndex)}
            severity="danger"
            text
          />
        )}
      />
    </DataTable>
  );
}

export default Classes;
