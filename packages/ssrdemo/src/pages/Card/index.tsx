import React, { useState, useEffect, useMemo, useCallback } from 'react';
interface CountProps {
  data: Array<any>,
  initialCount?: number,
  initilalTitle?: string,
}
function Counter(props: CountProps) {
  const { data = [{ id: 1, text: 'first' }, { id: 2, text: 'second' }], initialCount = 0, initilalTitle = 'Hello Count' } = props;

  const [count, setCount] = useState(initialCount);
  const [title, setTitle] = useState(initilalTitle);
  const memorizedValue = useMemo(() => {

  }, [count])
  const clickFn = () => {
    setCount(count + 1)
    setTitle('Hello' + count);
  }
  useEffect(() => {
    console.log('Counter')
  })
  return (
    <div> 
      <h1>Counter-title {title}</h1>
      <p>Count-data {count}</p>
      <button id='clickBtn' onClick={clickFn}>change</button>
      <div>letterletter</div>
    </div>
  );
}

export default Counter;
