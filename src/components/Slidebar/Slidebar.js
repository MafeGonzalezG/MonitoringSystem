import React, { useState } from 'react';
import './Slidebar.css';

const Slidebar = () => {
    const [value, setValue] = useState(0);
    const onChange = (value) => {
        // console.log('value changed', value);
        setValue(value);
    };
    return (
        <div className='slidebar'>
            {/* <label for="customRange3" class="form-label">Timeline</label> */}
            <input type="range" class="form-range" min="0" max="5" step="0.05" id="customRange3" onChange={(e) => onChange(e.target.value)} />
            Value: {value}
        </div>
    );
};

export default Slidebar;