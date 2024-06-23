import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Mapview from './pages/Mapview';
import About from './pages/About';

export const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/MonitoringSystem" element={<Mapview />} />
                <Route path="MonitoringSystem/About" element={<About />} />
            </Routes>
        </Router>
    );
}