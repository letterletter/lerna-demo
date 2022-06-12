import React, { useEffect, useState, useTransition } from 'react';
interface ShowProps {
  value: number,
  initilalTitle?: string,
}
const SlowUI = ({ value }: ShowProps) => (
  <>
    {Array(value)
      .fill(1)
      .map((_, index) => (
        <span key={index}>{value - index} </span>
      ))}
  </>
);

export default SlowUI