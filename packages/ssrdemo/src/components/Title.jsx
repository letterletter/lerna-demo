import React, { useEffect, useState, memo } from 'react';
function Title(props) {
    const [count, setCount] = useState(0)
    // TODO
    useEffect(() => {
        console.log('Hello Title', props)
    })
    const handleClick = () => {
        props.onClick?.();
        setCount(count + 1);
    }
    return (
        <div >
            <span>{props?.text + 'xidian'}</span>
            <span id='clickTimes'>{count}</span>
            <button id='clickBtn' onClick={e => handleClick()}> Add</button>
        </div>
    )
}

export default memo(Title, (prevProps, nextProps) => {
    if(prevProps.text === nextProps.text) {
        return true;
    }
    return false;
})