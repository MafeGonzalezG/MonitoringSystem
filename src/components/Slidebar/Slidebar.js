import React, { useState } from 'react';
import './Slidebar.css';
const years_longer =[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022]
const years =[2002,2007,2012,2014,2016,2018,2020,2021,2022];
function Slidebar({onChange,max,min,step}){
    const [value, setValue] = useState(0);
    const barMoves = (value) => {
        // console.log('value changed', value);
        if(min === 2002){
        onChange(years[value]);
        setValue(years[value]);
        }
        else{
            onChange(years_longer[value]);
            setValue(years_longer[value]);
        }

    };
    return (
        <div className='slidebar'>
            {/* <label for="customRange3" class="form-label">Timeline</label> */}
            <input type="range" className="form-range" min={min} max={max} step={step} id="customRange3" onChange={(e) => barMoves(e.target.value)} />
            Value: {value}
        </div>
    );
};

export default Slidebar;