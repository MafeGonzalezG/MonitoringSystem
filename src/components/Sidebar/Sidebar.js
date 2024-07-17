import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';  // Importing the CSS file for additional styling
import Card from './Card';
/**
 * Sidebar component using react-bootstrap.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {string} props.mapStyle - The current map style.
 * @returns {JSX.Element} The rendered Sidebar component.
 */

const Sidebar = ({ onChange, mapStyle }) => {
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    setSelectedDropdown(null);
  }, [mapStyle]);

  const handleDropdownChange = (option, index) => {
    setSelectedDropdown(index);
    onChange(option);
  };

  const dropdownData = [
    { title: "Nature", options: ['Cadastre', 'Mangroves', 'Hot Spots', 'Carbon Sequestration'], disabledOptions: ['Cadastre'] },
    { title: "Climate", options: ['Precipitation', 'Pressure', 'Temperature', 'Clouds', 'Wind', 'IDEAM Station Temperatures'] },
    { title: "Communities", options: ['Black Communities', 'Mining', 'Communities', 'Education', 'Military Zones', 'Reserves', 'Informality', 'Indigenous Reserves'], disabledOptions: ['Black Communities', 'Indigenous Reserves'] },
    { title: "Biodiversity", options: ['Family Agriculture', 'Cesar Aquifers', 'Test'] },
    { title: "Risk Map and Impacts", options: ['Deforestation', 'Earthquakes', 'Air Quality', 'Fires', 'Events', 'Faults'] },
  ];
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className='main-side-container'>
      <Button variant="secondary" onClick={toggleSidebar} className="sidebar-toggle-button bg-transparent mb-0 p-0">
        {isSidebarVisible ? <i className="bi bi-list h3"></i> :<i className="bi bi-list h3"></i>}
      </Button>
      {isSidebarVisible && (
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
      )}
    </div>
  );
};

export default Sidebar;
