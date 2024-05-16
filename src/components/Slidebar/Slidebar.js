import React, { useState } from 'react';
import './Slidebar.css';
const years =[2002,2007,2012,2014,2016,2018,2020,2021,2022]
function Slidebar({onChange}){
    const [value, setValue] = useState(0);
    const barMoves = (value) => {
        // console.log('value changed', value);
        onChange(years[value]);
        setValue(years[value]);

    };
    return (
        <div className='slidebar'>
            {/* <label for="customRange3" class="form-label">Timeline</label> */}
            <input type="range" className="form-range" min="0" max="8" step="1" id="customRange3" onChange={(e) => barMoves(e.target.value)} />
            Value: {value}
        </div>
    );
};

export default Slidebar;