import React, { useState } from 'react';
import ResumeShowcase from './Components/ResumeShowcase';

function ResumeBuilder() {
  const [SelectedResume, setSelectedResume] = useState(null);

  return (
    <div>
      <ResumeShowcase onSelectTemplate={setSelectedResume} />
      <div id="resume-preview">
        {SelectedResume ? <SelectedResume /> : <div>Please select a template above.</div>}
      </div>
    </div>
  );
}

export default ResumeBuilder;