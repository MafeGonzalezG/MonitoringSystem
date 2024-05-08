import React from 'react';
import Dropdown from './dropdown/Dropdown';
import './Sidebar.css';  // Importing the CSS file for styling

function Sidebar({onChange}) {
  const optionChange = (option) => {
    onChange(option);
  };
  return (
    <div className="sidebar navbar-expand-lg navbar-light bg-light">
      Carbon Units
      <Dropdown options={['Especie','Parameter','Diameter','Evolution']} defaultText="Select an option" onChange={optionChange}/>
      Climate 
      <Dropdown options={['Meteorology','Satellites','Fires','Water quality','Air quality']} defaultText="Select an option" onChange={optionChange}/>
      Communities
      <Dropdown options={['Agriculture','Transport','Mining','Health','Education','Fishing']} defaultText="Select an option" onChange={optionChange}/>
      Biodiversity
      <Dropdown options={['Biodiversity','Ecosystems']} defaultText="Select an option" onChange={optionChange}/>
      Risk map and Impacts
      <Dropdown options={['Deforestation','Indicators','People','Fires','Floods','Methane']} defaultText="Select an option" onChange={optionChange}/>
      ESG
      <Dropdown options={['Form']} defaultText="Select an option" onChange={optionChange}/>
    </div>
  );
}

export default Sidebar;
