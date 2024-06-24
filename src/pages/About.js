import CustomNavbar from '../components/navbar/navbar';
import React, { useState } from 'react';
import "./About.css";
export default function About(){


    return (
        <div className="App">
            <div className="app-body">
                <CustomNavbar onpressMap={(map)=>null} onChange={(newdir) =>null}/>
                    <div className="card-body m-2">
                        <h1>About</h1>
                        <p>
                            This is Planet AI's venture space monitoring system app. Though this platform
                            you can monitor the changes in the environment of the planet. Different layers
                            of the planet can be viewed and compared with the data from the past. The data
                            is collected from different sources and is updated at different intervals. 
                        </p>
                        <div>
        <p>Our website hosts a comprehensive map showcasing projects evaluated by Ph.Ds and experts in science, technology, finance, sustainability, and other disciplines. Each project is meticulously assessed using cutting-edge technologies:</p>

        <ul>
            <li><strong>Artificial Intelligence Algorithms and Earth Observation:</strong> These technologies calculate Verified Natural Carbon Units (VNCUs) accurately.</li>
            <li><strong>Continuous Satellite Monitoring:</strong> Projects are monitored constantly via satellite to confirm the state of nature and local communities.</li>
            <li><strong>Retroactive VNCUs and Baseline Adjustment:</strong> Continuous monitoring and historical data access allow for retroactive adjustments to the baseline, ensuring accuracy.</li>
            <li><strong>Blockchain Technology:</strong> We utilize blockchain for issuing Verified Natural Carbon Units (VNCUs), ensuring transparency and traceability.</li>
        </ul>

        <p>Our mission is to provide our clients with complete, detailed, and accurate information on the evolution of greenhouse gas reduction projects. This ensures transparency and traceability throughout the process, helping to uphold our commitment to environmental stewardship and sustainability. For more information, visit our website to explore our interactive map and learn about our projects in detail.</p>
    </div>
                    </div>
            </div>
        </div>
    );
}