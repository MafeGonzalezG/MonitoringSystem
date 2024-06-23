import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../legend/Gradient.css';
import './popup.css';
import Gradient from '../legend/Gradient';
import XmlParser from './xmlRetrieval';
function Popup({ onChange, popUpSettings}) {  
    const handleClick = () => {
        onChange(false);
    };

    return (
        <div className="Popup bg-light">
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClick}></button>
            <h1 className='popup-title'>{popUpSettings.title}</h1>
            {/* <p className='popup-content'>Some information goes here...</p> */}
            {popUpSettings.legendType==='gradient'?<Gradient colors={popUpSettings.legendColors} labels={popUpSettings.legendPositions}/>:<XmlParser url={popUpSettings.legendSource}/>}
        </div>
    );
  }
  
  export default Popup;