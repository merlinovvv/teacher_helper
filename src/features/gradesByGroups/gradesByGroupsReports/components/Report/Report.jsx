import { Fragment, useContext, useEffect, useState } from 'react';
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
import { ukraineDate } from '../../../../../shared/utils/utils.js'
import * as XLSX from 'xlsx';
import { reportTypes } from '../../../../../shared/utils/constants.js';

function Report() {
  const { report_id } = useParams();
  const navigate = useNavigate()
  const [report, setReport] = useState([]);
  const [groups, setGroups] = useState([]);
  const [reportWidth, setReportWidth] = useState();
  const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const { sidebarIsOpen, toast } = useContext(LayoutContext);
  const { data: reportData, isFetching: isLoadingReport } = useGetReport(report_id);

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column headerClassName="bg-blue-700 text-white text-center" header="ПІБ" rowSpan={3} />
        {groups?.map(({ name, control_dates, assigment_dates }, index) => {
          return [
            <Column key={name} header={`${name}`} colSpan={(control_dates?.length && assigment_dates?.length) ? (control_dates?.length + 1 + assigment_dates?.length + 1) : assigment_dates?.length ? assigment_dates?.length + 1 : control_dates?.length ? control_dates?.length + 1 : 0} />,
            <Column headerClassName="bg-green-800 text-white text-center" key={name + index} header={`Середнє: ${name}`} rowSpan={3} />,
          ];
        })}
        <Column headerClassName="bg-orange-800 text-white text-center" header="Середнє по групам" rowSpan={3} />
      </Row>
      <Row>
        {groups?.flatMap(({ _id, assigment_dates, control_dates }) => {
          let returnColumns = [];
          if (assigment_dates?.length) {
            returnColumns.push(
              <Column key={`${_id}-assigment`} header="Поточне оцінювання" colSpan={assigment_dates?.length || 1} />,
              <Column headerClassName="bg-cyan-600 text-white text-center" key={`avg-control`} header={`Середнє за поточні`} rowSpan={2} />,
            );
          }
          if (control_dates?.length) {
            returnColumns.push(
              <Column key={`${_id}-control`} header="Підсумкові" colSpan={control_dates?.length} />,
              <Column headerClassName="bg-yellow-600 text-white text-center" key={`avg-control`} header={`Середнє за підсумкові`} rowSpan={2} />,
            );
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
            if (!controlDate && !date) {
              return true
            }
            return controlDate === ukraineDate(date)
          }
        )
        : group.assigments?.filter(
          ({ date: assigmentDate }) => {
            if (!assigmentDate && !date) {
              return true
            }
            return assigmentDate === ukraineDate(date)
          }
        );

    if (!ratings || ratings.length === 0) return null;

    return ratings.map((rating, index) => <div key={index}>{rating.rating ? rating.rating : ''}</div>);
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
      let groupDates = [];
      if (assigment_dates?.length) {
        groupDates.push(...assigment_dates, '')
      }
      if (control_dates?.length) {
        groupDates.push(...control_dates, '')
      }
      console.log(groupDates);

      headerRow1.push(name, ...Array(groupDates.length).fill(''));

      if (assigment_dates?.length !== 0) {
        headerRow2.push('Поточне оцінювання', ...Array(Math.max(assigment_dates?.length - 1, 0)).fill(''));
        headerRow2.push('Середнє за поточні');
      }

      if (control_dates?.length !== 0) {
        headerRow2.push('Підсумкові', ...Array(Math.max(control_dates?.length - 1, 0)).fill(''));
        headerRow2.push('Середнє за підсумкові');
      }

      headerRow2.push('Середнє за групу');
      
      headerRow3.push(...groupDates.map((date) => date ? ukraineDate(date) : ''), '');
    });
    
    
    headerRow1.push('Середнє по групам');
    headerRow2.push('');
    headerRow3.push('');
    console.log(headerRow1, headerRow2, headerRow3);
    sheetData.push(headerRow1, headerRow2, headerRow3);

    // Добавляем данные
    report.forEach((rowData) => {
      const row = [rowData.name];
    
      groups.forEach(({ name, control_dates, assigment_dates }) => {
        const groupData = rowData.groups?.find((group) => group.group === name);
    
        // Получаем текущие оценки для assigments
        const assigmentRatings = assigment_dates?.map((date) => {
          return groupData?.assigments?.find((rating) => rating.date === ukraineDate(date))?.rating || '';
        }) || [];
    
        // Получаем итоговые оценки для controls
        const controlRatings = control_dates?.map((date) => {
          return groupData?.controls?.find((rating) => rating.date === ukraineDate(date))?.rating || '';
        }) || [];
    
        // Получаем средние оценки для assigments и controls
        const assigmentAvg = groupData?.assigments?.find((rating) => rating.type === "Середня" && !rating.date)?.rating || '';
        const controlAvg = groupData?.controls?.find((rating) => rating.type === "Середня" && !rating.date)?.rating || '';
    
        // Добавляем текущие и итоговые оценки
        [...assigmentRatings].forEach((value) => {
          row.push(value);
        });

        if (assigmentRatings?.length) {
          row.push(assigmentAvg);
        }
        
        [...controlRatings].forEach((value) => {
          row.push(value);
        });
        
        if (controlRatings?.length) {
          row.push(controlAvg);
        }
        
        // Добавляем среднее по группе
        const groupAvg = groupData?.groupAvg || '';
        row.push(groupAvg);
        console.log(row);
        
      });
    
      // Добавляем среднее по всем группам
      row.push(rowData.avg_groups || '');
      sheetData.push(row);
    });
    
    // Генерация Excel-файла
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, `${reportData?.subject} ${reportData?.schoolClass}.xlsx`);
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
    } else {
      if (!isLoadingReport) {
        toast.current.show({
          severity: 'error',
          summary: 'Звіт',
          detail: reportData?.message || 'Помилка'
        })
      }
    }
  }, [reportData, isLoadingReport]);

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
          {reportTypes?.find(({value}) => value === reportData?.reportType)?.name || ''}, {reportData?.subject}, {reportData?.schoolClass}
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
        {groups?.flatMap(({ _id, name, control_dates, assigment_dates }, i) => [
          ...assigment_dates?.flatMap((date, index) => (
            <Column
              key={`${name}-assigment-${index}`}
              body={(rowData) => renderGroupData(rowData, name, date, 'assigment')}
            />
          )),
          <Column
            hidden={!assigment_dates?.length}
            bodyClassName="bg-cyan-300 text-cyan-800 font-bold text-center text-lg"
            key={`${name}-assigment-avg`}
            body={(rowData) => renderGroupData(rowData, name, '', 'assigment')}
          />,
          ...control_dates?.flatMap((date, index) => (
            <Column
              key={`${name}-control-${index}`}
              body={(rowData) => renderGroupData(rowData, name, date, 'control')}
            />
          )),
          <Column
            hidden={!control_dates?.length}
            bodyClassName="bg-yellow-300 text-yellow-800 font-bold text-center text-lg"
            key={`${name}-control-avg`}
            body={(rowData) => renderGroupData(rowData, name, '', 'control')}
          />,
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
