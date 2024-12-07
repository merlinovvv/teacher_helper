import React from 'react';
import { Panel } from 'primereact/panel';
import UploadReport from './components/UploadReport/UploadReport.jsx';
import ReportsList from './components/ReportsList/ReportsList.jsx';
import { useGetReports } from './data/useReports.js';
import { Outlet, useParams } from 'react-router-dom';
import { Divider } from 'primereact/divider';

function GradesByGroupsReports() {
  const { report_id } = useParams();
  const { data: reports, refetch: getReports, isFetching: isLoadingReports } = useGetReports();
  return (
    <Panel header="Звіти">
      {report_id ? (
        <Outlet />
      ) : (
        <div className="flex flex-column gap-4">
          <ReportsList getReports={getReports} isLoadingReports={isLoadingReports} reports={reports?.reports || []} />
          <UploadReport getReports={getReports} />
        </div>
      )}
    </Panel>
  );
}

export default GradesByGroupsReports;
