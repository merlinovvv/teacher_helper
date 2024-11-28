import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDeleteReport } from '../../data/useReport.js';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { confirmPopup } from 'primereact/confirmpopup';
import { useNavigate } from 'react-router-dom';

function ReportsList({ reports, isLoadingReports, getReports }) {
  const navigate = useNavigate();
  const { toast } = useContext(LayoutContext);
  const [deleteId, setDeleteId] = useState();
  const {
    data: deleteReportData,
    mutate: getDeleteReport,
    isSuccess: deleteReportSuccess,
    isPending: isLoadingDeleteReport,
  } = useDeleteReport(deleteId);

  async function handleDeleteReport(e, id) {
    await confirmPopup({
      target: e.currentTarget,
      message: `Ви впевнені, що хочете видалити звіт?`,
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await setDeleteId(id);
        await getDeleteReport();
      },
      acceptLabel: 'Так',
      rejectLabel: 'Ні',
    });
  }

  function handleOpenReport(e) {
    navigate(e.data._id);
  }

  useEffect(() => {
    if (deleteReportSuccess && deleteReportData) {
      toast.current.show({
        severity: deleteReportData?.success ? 'success' : 'error',
        summary: 'Звіт',
        detail: deleteReportData?.message,
      });
      getReports();
    }
  }, [deleteReportSuccess, deleteReportData]);

  return (
    <div>
      <Accordion activeIndex={0}>
        <AccordionTab header="Звіти">
          <DataTable
            selectionMode="single"
            onRowSelect={handleOpenReport}
            stripedRows
            loading={isLoadingReports}
            value={reports || []}
          >
            <Column className="w-6" header="Предмет" body={({ subject }) => subject.name} />
            <Column className="w-6" header="Клас" body={({ schoolClass }) => schoolClass.name} />
            <Column
              header="Видалити"
              body={({ _id }) => (
                <Button
                  icon="pi pi-times"
                  text
                  severity="danger"
                  disabled={isLoadingDeleteReport}
                  loading={isLoadingDeleteReport && deleteId === _id}
                  onClick={(e) => handleDeleteReport(e, _id)}
                />
              )}
            />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
}

export default ReportsList;
