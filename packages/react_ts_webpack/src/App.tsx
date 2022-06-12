import React, { Suspense, lazy, useEffect, useState, useMemo, useCallback, useTransition, useDeferredValue } from 'react';
import Counter from './pages/Card';
import Title from './components/Title';
import Info from './components/Info';

const Spinner = () => <div style={{ width: '100%', height: '100%', backgroundColor: 'blue' }}>Loading</div>
function App() {

  const [randomStr, setRandomStr] = useState('ggyysds');
  const [update, setUpdate] = useState(true);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    console.log('in App')
  })
  const handleClick = () => {
    startTransition(() => {
      setUpdate(!update)
      update && setRandomStr(Math.random().toString(32))
    })
  }
  const memorizedValue = useMemo(() => {
    console.log('calculate')
    return randomStr.slice(0, 4)
  }, [randomStr])

  const logFunc = useCallback(() => {
    console.log('in App', randomStr)
  }, [])
  return (
    <div className="App">
      {isPending && <Spinner />}
      {
        !isPending && (<div>
          <button onClick={() => handleClick()}>change</button>
          <div>memorizedValue --- {memorizedValue}</div>
          <hr />
          <Info text={randomStr} logFunc={logFunc} />
          <Title />
          <Counter data={[{ id: 1, text: 'first' }, { id: 2, text: 'second' }]} />
        </div>)
      }
    </div >
  );
}

export default App;
