import { useEffect } from 'react';
// import './index.css';
function Card(props) {
    // TODO
    useEffect(() => {
        console.log('Hello hhh', props)
    })
    return (
        <div className='cardContainer'>
            <span>{props?.text + 'xidian'}</span>
        </div>
    )
}

export default Card