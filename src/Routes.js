import React from 'react'
import {Route, Routes, HashRouter} from 'react-router-dom'
import Mapview from './pages/Mapview';
import About from './pages/About';
import Contact from './pages/Contact';
/**
 * The routing component.
 * @component
 * @returns {JSX.Element} The rendered Routing component.
 */
export const Routing = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Mapview />} />
                <Route path="/About" element={<About />} />
                <Route path="/Contact" element={<Contact />} />
            </Routes>
        </HashRouter>
    );
}