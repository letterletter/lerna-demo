import React, { useState, memo } from 'react';
import './info.css'
interface CountProps {
  initialCount?: number,
  initilalTitle?: string,
  text?: string,
  logFunc?: () => void
}
function Info(props: CountProps) {

  console.log('info')
  return (
    <div className='infoContainer'>
      <h1>Info-title </h1>
      <div>
        <div>letter</div>
        <div>Props from App {props.text}</div>
        <div>Info -Log <button onClick={props.logFunc} >log</button></div>
      </div>
    </div>
  );
}

export default memo(Info);
