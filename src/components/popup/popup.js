import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../legend/Gradient.css';
import './popup.css';
import Gradient from '../legend/Gradient';
import XmlParser from './xmlRetrieval';
import JsonParserLegend from './jsonRetrieval';
/**
 * A popup component that displays information when triggered.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {Object} props.popUpSettings - The settings for the popup.
 * @returns {JSX.Element} - The Popup component
 */

function Popup({ onChange, popUpSettings}) {  
    const handleClick = () => {
        onChange(false);
    };

    return (
        <div className="Popup bg-light">
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClick}></button>
            <h1 className='popup-title'>{popUpSettings.title}</h1>
            {/* <p className='popup-content'>Some information goes here...</p> */}
            {popUpSettings.type==='gradient'?<Gradient colors={popUpSettings.legendColors} labels={popUpSettings.legendPositions}/>:
            popUpSettings.type==='jsonsource'?<JsonParserLegend urljson={popUpSettings.legendSource} metadataObj={popUpSettings.legendSourceMetadata}/>:
            popUpSettings.type ==='directInput'?<div dangerouslySetInnerHTML={{ __html: popUpSettings.content }}></div>
            :<XmlParser url={popUpSettings.legendSource} metadataObj={popUpSettings.legendSourceMetadata}/>}
        </div>
    );
  }
  
  export default Popup;