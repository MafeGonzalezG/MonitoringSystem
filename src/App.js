import React, { Component, useState,useEffect } from 'react';
import logo from './logo.svg';
import Navbar from './components/navbar/navbar';
import MapComponent from './components/map/map';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

export default function App() {
    const [country, setCountry] = useState('');
    const [mapType, setMapType] = useState('');
    useEffect(() => {
      console.log('mapType:', mapType);
    }, [mapType]);
    return (
      
      <div className="App">
        <div className="app-body">
         <Navbar onChange={(newCountry) => setCountry(newCountry)}/>
         <Sidebar onChange={(newMapType)=> setMapType(newMapType)}/>
        </div>
        <MapComponent country={country} mapType={mapType}/>
      </div>
);
}
