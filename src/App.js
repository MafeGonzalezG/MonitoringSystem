import React, { Component, useState,useEffect } from 'react';
import CustomNavbar from './components/navbar/navbar';
import MapComponent from './components/map/map';
import Sidebar from './components/Sidebar/Sidebar';
import Slidebar from './components/Slidebar/Slidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
    const [mapStyle, setMapStyle] = useState('light-v11');
    const [country, setCountry] = useState('');
    const [mapType, setMapType] = useState('');
    const [year, setYear] = useState(2002);
    const [showBar, setShowBar] = React.useState(false)
    const [lnglatclick, setLnglatclick] = useState([]);
    const [lnglat, setLnglat] = useState([]);

    const [max, setMax] = useState(2022);
    const [min, setMin] = useState(2002);
    const [step, setStep] = useState(1);
    return (
      
      <div className="App">
        <MapComponent mapStyle={mapStyle} setMax={(max)=>setMax(max)} setMin={(min)=>setMin(min)} setStep={(step)=>setStep(step)}
        lnglat={lnglat} lnglatclick={lnglatclick} setlnglat={(newcoord)=>setLnglat(newcoord)} setlnglatclick={(newcoord)=>setLnglatclick(newcoord)}  setShowBar = {(bar)=> setShowBar(bar)} country={country} mapType={mapType} year={year}/>
        <div className="app-body">
          <CustomNavbar onpressMap={(map)=>setMapStyle(map)} onChange={(newdir) => setLnglat(newdir)}/>
          <Sidebar onChange={(newMapType)=> setMapType(newMapType)}/>
          { showBar ?<Slidebar max ={max} min={min} step={step} onChange={(newYear)=>setYear(newYear)}/> : null}
        </div>
      </div>
);
}
