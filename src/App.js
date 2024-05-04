import React, { Component, useState,useEffect } from 'react';
import logo from './logo.svg';
import Navbar from './components/navbar/navbar';
import MapComponent from './components/map/map';
import './App.css';

export default function App() {
    const [country, setCountry] = useState('');
    return (
      
      <div className="App">
        <Navbar onChange={(newCountry) => setCountry(newCountry)}/>
        <MapComponent country={country} />
      </div>
);
}
