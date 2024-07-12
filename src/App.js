import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/umd/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import React from 'react';
import {Routing} from './Routes';
import './App.css';

export default function App() {
    return (
        <div className="App">
            <Routing />
        </div>
    );
}
