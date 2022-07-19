import React, {  useEffect, useState } from 'react';
import { logInfo } from './utils';
import Card from './components/Card';

function App() {
  let [count, setCount] = useState(0)
  useEffect(() => {
    console.log('in App');
    logInfo('In esbuild demo')
  })
  const handleAdd = () => {
    setCount(++count)
  }
  return (
    <div className="App">
      App.js  count --- {count}
      <button onClick={handleAdd}>Add </button>
      <Card />
    </div >
  );
}

export default App;
