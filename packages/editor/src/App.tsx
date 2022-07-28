import React from 'react';
import SimpleEditor from '@components/SimpleEditor';
import DiffEditorComp from '@components/DifferEditor';
const Spinner = () => <div style={{ width: '100%', height: '100%', backgroundColor: 'blue' }}>Loading</div>
function App() {

  return (
    <div className="App">
      <SimpleEditor />
      {/* <DiffEditorComp /> */}
    </div >
  );
}

export default App;
