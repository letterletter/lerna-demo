import { useEffect } from 'react';
import Styles from './index.module.css';
function Card(props) {
    // TODO
    useEffect(() => {
        console.log('Hello hhh', props)
    })
    return (
        <div className={Styles.cardContainer}>
            <span>{props?.text + 'xidian'}</span>
        </div>
    )
}

export default Card