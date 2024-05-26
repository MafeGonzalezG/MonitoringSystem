import React, { Component, useState,useEffect } from 'react';
import Navbar from './components/navbar/navbar';
import MapComponent from './components/map/map';
import Sidebar from './components/Sidebar/Sidebar';
import Slidebar from './components/Slidebar/Slidebar';
import './App.css';

export default function App() {
    const [country, setCountry] = useState('');
    const [mapType, setMapType] = useState('');
    const [year, setYear] = useState(2002);
    const [showBar, setShowBar] = React.useState(false)
    const [lnglat, setLnglat] = useState([]);
    const [max, setMax] = useState(2022);
    const [min, setMin] = useState(2002);
    const [step, setStep] = useState(1);
    useEffect(() => {
      console.log('mapType:', mapType);
    }, [mapType]);
    useEffect(() => {
      console.log('Show bar:',showBar);
    }, [showBar]);
    return (
      
      <div className="App">
        <MapComponent setMax={(max)=>setMax(max)} setMin={(min)=>setMax(min)} setStep={(step)=>setStep(step)}
        lnglat={lnglat} setlnglat={(newcoord)=>setLnglat(newcoord)} setShowBar = {(bar)=> setShowBar(bar)} country={country} mapType={mapType} year={year}/>
        <div className="app-body">
          <Navbar onChange={(newCountry) => setCountry(newCountry)}/>
          <Sidebar onChange={(newMapType)=> setMapType(newMapType)}/>
          { showBar ?<Slidebar max ={max} min={min} step={step} onChange={(newYear)=>setYear(newYear)}/> : null}
        </div>
      </div>
);
}
