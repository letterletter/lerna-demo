'use strict';
import './index.css';
import { useEffect } from 'react'
function Note() {
    // TODO
    useEffect(() => {
        console.log('Note')
    }, []);
    return (
        <div className='noteMain'>
            Note
        </div>
    )
}

module.exports = Note;
