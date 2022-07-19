import React, {  useEffect, useState } from 'react';
import configData from 'configData';
function Card() {
  let [count, setCount] = useState(0)
  useEffect(() => {
    console.log('in Card');
  })

  return (
    <div className="Card">
      <p className='card-title'>This is a Card Display</p>
      <textarea className='card-body' maxLength={1200} value={JSON.stringify(configData)}></textarea>
    </div >
  );
}

export default Card;
