import { useEffect, useState } from 'react';
import Styles from './index.module.css';
function Card(props) {
    const [count, setCount] = useState(0)
    // TODO
    useEffect(() => {
        console.log('Hello hhh', props)
    })
    const handleClick = () => {
        props.onClick?.();
        setCount(count + 1);
    }
    return (
        <div className={Styles.cardContainer}>
            <span>{props?.text + 'xidian'}</span>
            <span id='clickTimes'>{count}</span>
            <button id='clickBtn' onClick={e => handleClick()}> Add</button>
        </div>
    )
}

export default Card