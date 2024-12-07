import React from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import Groups from './tabs/Groups/Groups.jsx';
import Subjects from './tabs/Subjects/Subjects.jsx';
import Classes from './tabs/Classes/Classes.jsx';
import ReportType from './tabs/ReportType/ReportType.jsx';

function GradesByGroupsSettings() {
  return (
    <TabView scrollable>
      <TabPanel header="Тип звіту">
        <ReportType />
      </TabPanel>
      <TabPanel header="Класи">
        <Classes />
      </TabPanel>
      <TabPanel header="Предмети">
        <Subjects />
      </TabPanel>
      <TabPanel header="Групи оцінок">
        <Groups />
      </TabPanel>
    </TabView>
  );
}

export default GradesByGroupsSettings;
