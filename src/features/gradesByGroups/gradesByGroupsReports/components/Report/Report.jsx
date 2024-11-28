import { useContext, useEffect, useState } from 'react';
import { useGetReport } from '../../data/useReport.js';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { LayoutContext } from '../../../../../context/LayoutContext.jsx';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import {ukraineDate} from '../../../../../shared/utils/utils.js'
import * as XLSX from 'xlsx';

function Report() {
  const { report_id } = useParams();
  const navigate = useNavigate()
  const [report, setReport] = useState([]);
  const [groups, setGroups] = useState([]);
  const [reportWidth, setReportWidth] = useState();
  const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const { sidebarIsOpen } = useContext(LayoutContext);
  const { data: reportData, isFetching: isLoadingReport } = useGetReport(report_id);

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column headerClassName="bg-blue-700 text-white" header="ПІБ" rowSpan={3} />
        {groups?.map(({ name, control_dates, assigment_dates }, index) => {
          return [
            <Column key={name} header={`${name}`} colSpan={control_dates?.length + assigment_dates?.length} />,
            <Column headerClassName="bg-green-800 text-white" key={name + index} header={`Середнє: ${name}`} rowSpan={3} />,
          ];
        })}
        <Column headerClassName="bg-orange-800 text-white" header="Середнє по групам" rowSpan={3} />
      </Row>
      <Row>
        {groups?.flatMap(({ _id, assigment_dates, control_dates }) => {
          let returnColumns = [];
          if (assigment_dates?.length) {
            returnColumns.push(
              <Column key={`${_id}-assigment`} header="Поточне оцінювання" colSpan={assigment_dates?.length || 1} />
            );
          }
          if (control_dates?.length) {
            returnColumns.push(<Column key={`${_id}-control`} header="Підсумкові" colSpan={control_dates?.length} />);
          }
          return returnColumns;
        })}
      </Row>
      <Row>
        {groups?.flatMap(({ _id, control_dates, assigment_dates }) => [
          ...assigment_dates?.map((date, index) => (
            <Column key={`${_id}-assigment-${index}`} header={ukraineDate(date)} />
          )),
          ...control_dates?.map((date, index) => (
            <Column key={`${_id}-control-${index}`} header={ukraineDate(date)} />
          )),
        ])}
      </Row>
    </ColumnGroup>
  );

  const renderGroupData = (rowData, groupName, date, type) => {
    const group = rowData.groups.find(({ group }) => group === groupName);
    if (!group) return null;

    const ratings =
      type === 'control'
        ? group.controls?.filter(
          ({ date: controlDate }) => {
            return controlDate === ukraineDate(date)
          }
        )
        : group.assigments?.filter(
          ({ date: assigmentDate }) => assigmentDate === ukraineDate(date)
        );

    if (!ratings || ratings.length === 0) return null;
        
        
    return ratings.map((rating, index) => <div key={index}>{rating.rating}</div>);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Пошук по учням" />
        </IconField>
        <Divider layout="vertical" />
        <Button className="h-min" label="Завантажити у Excel" type="button" icon="pi pi-file-excel" onClick={() => downloadExcelReport(report, groups)} data-pr-tooltip="XLS" />
      </div>
    );
  };

  const downloadExcelReport = (report, groups) => {
    if (!report || !groups) return;

    const sheetData = [];

    // Создаем заголовки
    const headerRow1 = ['ПІБ'];
    const headerRow2 = [''];
    const headerRow3 = [''];

    groups.forEach(({ name, control_dates, assigment_dates }) => {
      const groupDates = [...(assigment_dates || []), ...(control_dates || [])];
      headerRow1.push(name, ...Array(groupDates.length).fill(''));
      
      if (assigment_dates?.length !== 0 ) {
        headerRow2.push('Поточне оцінювання', ...Array(Math.max(assigment_dates?.length - 1, 0)).fill(''));
      }

      if (control_dates?.length !== 0) {
        headerRow2.push('Підсумкові', ...Array(Math.max(control_dates?.length - 1, 0)).fill(''));
      }

      headerRow2.push('Середнє за групу');
      headerRow3.push(...groupDates.map((date) => ukraineDate(date)), '');
    });

    headerRow1.push('Середнє по групам');
    headerRow2.push('');
    headerRow3.push('');

    sheetData.push(headerRow1, headerRow2, headerRow3);

    // Добавляем данные
    report.forEach((rowData) => {
      const row = [rowData.name];
      groups.forEach(({ name, control_dates, assigment_dates }) => {
        [...(assigment_dates || []), ...(control_dates || [])].forEach((date) => {
          console.log('date', date);
          
          const value = rowData.groups
            ?.find((group) => group.group === name)
            ?.controls?.concat(rowData.groups?.find((group) => group.group === name)?.assigments || [])
            ?.find((rating) => {
              console.log('rating.date', rating.date);
              
              return rating.date === ukraineDate(date)
            })
            ?.rating || '';
          row.push(value);
        });

        const groupAvg = rowData.groups?.find((group) => group.group === name)?.groupAvg || '';
        row.push(groupAvg);
      });
      row.push(rowData.avg_groups || '');
      sheetData.push(row);
    });

    // Генерация Excel-файла
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  useEffect(() => {
    const updateReportWidth = () => {
      const calculatedWidth = window.innerWidth - 256 - 48 - 40 - 17;
      setReportWidth(calculatedWidth);
    };

    updateReportWidth(); // Первичное обновление при монтировании компонента

    const handleResize = () => {
      updateReportWidth(); // Обновление при изменении размера окна
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarIsOpen]);

  useEffect(() => {
    if (reportData?.report) {
      setReport(reportData?.report);
      setGroups(reportData?.groups);
    }
  }, [reportData]);

  return (
    <div className="flex flex-column gap-4">
      <div className="flex gap-4 align-items-center">
        <Button
          label="Назад"
          icon="pi pi-undo"
          onClick={() => navigate('/')}
          rounded
        />
        <div className="text-xl font-bold">
          {reportData?.subject}, {reportData?.schoolClass}
        </div>
      </div>
      <DataTable
        dataKey="name"
        header={renderHeader}
        filters={filters}
        globalFilterFields={['name']}
        style={sidebarIsOpen && { width: reportWidth }}
        scrollable
        scrollHeight="780px"
        headerColumnGroup={headerGroup}
        showGridlines
        loading={isLoadingReport}
        value={report || []}
      >
        <Column bodyClassName="bg-blue-900 text-white" header="ПІБ" field="name" />
        {groups?.flatMap(({ _id, name, control_dates, assigment_dates }) => [
          ...assigment_dates?.map((date, index) => (
            <Column
              key={`${name}-assigment-${index}`}
              body={(rowData) => renderGroupData(rowData, name, date, 'assigment')}
            />
          )),
          ...control_dates?.map((date, index) => (
            <Column
              key={`${name}-control-${index}`}
              body={(rowData) => renderGroupData(rowData, name, date, 'control')}
            />
          )),
          <Column
            bodyClassName="bg-green-300 text-green-800 font-bold text-center text-lg"
            key={`${name}-avg`}
            body={(rowData) => rowData.groups?.find(({ group }) => name === group)?.groupAvg}
          />,
        ])}
        <Column
          bodyClassName="bg-orange-300 text-orange-800 font-bold text-center text-lg"
          header="Середнє по групам"
          field="avg_groups"
        />
      </DataTable>
    </div>
  );
}

export default Report;
