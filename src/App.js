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

    useEffect(() => {
      console.log('mapType:', mapType);
    }, [mapType]);
    return (
      
      <div className="App">
        <MapComponent country={country} mapType={mapType} year={year}/>
        <div className="app-body">
          <Navbar onChange={(newCountry) => setCountry(newCountry)}/>
          <Sidebar onChange={(newMapType)=> setMapType(newMapType)}/>
          <Slidebar onChange={(newYear)=>setYear(newYear)}/> 
        </div>
      </div>
);
}
