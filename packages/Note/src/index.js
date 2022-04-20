'use strict';
import './index.css';
module.exports = Note;

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
