import React, {Component, useState} from 'react';
import './navbar.css';
export default function Navbar({onChange}) {
      const handlePress = (country) => {
        onChange(country);
      };
      const [input, setInput] = useState('');
      return (<div  className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="navbar-nav">
        <a className="nav-item nav-link active" href="#">Home <span className="sr-only"></span></a>
        <a className="nav-item nav-link" href="#">Features</a>
        <a className="nav-item nav-link" href="#">Pricing</a>
      </div>
      <div id="input-section">
          <input  className="form-control mr-sm-2" type="text" placeholder="country" onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key=='Enter') handlePress(input)}} />
      </div>
      <button type="button" className="btn btn-primary btn-sm" id='signin'>Sign In</button>
      <button type="button" className="btn btn-primary btn-sm" id='signout'>Sign Out</button>
   </div>);
      }


