import React from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import Groups from './tabs/Groups/Groups.jsx';
import Subjects from './tabs/Subjects/Subjects.jsx';
import Classes from './tabs/Classes/Classes.jsx';

function GradesByGroupsSettings() {
  return (
    <TabView>
      <TabPanel header="Групи оцінок">
        <Groups />
      </TabPanel>
      <TabPanel header="Предмети">
        <Subjects />
      </TabPanel>
      <TabPanel header="Класи">
        <Classes />
      </TabPanel>
    </TabView>
  );
}

export default GradesByGroupsSettings;
