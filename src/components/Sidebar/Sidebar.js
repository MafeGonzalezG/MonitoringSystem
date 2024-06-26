import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';  // Importing the CSS file for additional styling
import Card from './Card';

const Sidebar = ({ onChange,mapStyle }) => {
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  useEffect(() => {
    setSelectedDropdown(null);
  }, [mapStyle]);
  const handleDropdownChange = (option, index) => {
    setSelectedDropdown(index);
    onChange(option);
  };

  const dropdownData = [
    { title: "Nature", options: ['Catastro', 'Manglares', 'Hot Spots', 'Carbon Secuestro'],disabledOptions:['Catastro'] },
    { title: "Climate", options: ['Precipitation', 'Pressure', 'Temperature', 'Clouds', 'Wind', 'Temperatura Estaciones IDEAM'] },
    { title: "Communities", options: ['Comunidades Negras', 'Mining', 'Communities', 'Education', 'Military Zones', 'Resguardos', 'Informalidad','Reservas Indigenas'],disabledOptions:['Comunidades Negras','Reservas Indigenas']},
    { title: "Biodiversity", options: ['Agricultura Familiar', 'Acuiferos Cesar'] },
    { title: "Risk map and Impacts", options: ['Deforestation', 'Earthquakes', 'Air Quality', 'Fires', 'Events', 'Fallas'] },
    { title: "Infrastructure", options: ['Roads', 'Railways', 'Ports', 'Airports', 'Energy', 'Telecomunicaciones', 'Pipelines', 'Cables Submarinos'] }
  ];

  return (
    <Container className="sidebar bg-transparent bg-gradient text-dark">
      {dropdownData.map((dropdown, index) => (
        <Row key={index}>
          <Col>
            <Card
              title={dropdown.title}
              options={dropdown.options}
              onChange={(option) => handleDropdownChange(option, index)}
              isSelected={selectedDropdown === index}
              disabledOptions={dropdown.disabledOptions}
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default Sidebar;
