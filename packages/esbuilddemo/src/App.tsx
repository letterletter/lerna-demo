import {  Children, ReactElement, useEffect, useState } from 'react';
import { logInfo } from './utils';
import Card from './components/Card';

interface AppProps {
  Children?: ReactElement
}
function App(props: AppProps) {
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
      <div>
        {props.Children}
      </div>
    </div >
  );
}

export default App;
