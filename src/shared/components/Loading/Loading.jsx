import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

function Loading(props) {
  return (
    <div className="flex flex-column justify-content-center align-items-center">
      <ProgressSpinner />
    </div>
  );
}

export default Loading;
