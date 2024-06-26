import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import ColorCycleButton from './buttonChangeMap';
import CustomDropdown from '../Sidebar/dropdown/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import GeocodingForm from './geoCodingForm';
import logoPlanet from '../../assets/images/logo_planet.png';
import greenLife from '../../assets/images/greenlife.png';

/**
 * Navigation bar component.
 *
 * @component
 * @param {Object} props - The component accepts onChange props.
 * @param {function} props.onChange - The change+enter press event handler.
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * // Render a navbar with a search bar that logs the input value on enter press.
 * <Navbar onChange={()=>console.log('value changed');} />
 */
function CustomNavbar({ onpressMap, onChange }) {
  const real_names = [
    'outdoors-v12',
    'light-v11',
    'satellite-v9',
    'navigation-night-v1',
    'standard',
    'streets-v12',
    'dark-v11',
    'satellite-streets-v12',
    'navigation-day-v1',
  ];
  const show_names = [
    'Outdoors',
    'Light',
    'Satellite',
    'Navigation night',
    'Standard',
    'Streets',
    'Dark',
    'Satellite Streets',
    'Navigation day',
  ];

  return (
    <Navbar bg="light" expand="lg" className="bg-light bg-gradient text-dark">
      <Navbar.Brand href="/MonitoringSystem" className="d-flex align-items-center">
        <img src={logoPlanet} alt="" height="65" className="d-inline-block align-middle" />
        <img src={greenLife} alt="" height="65" className="d-inline-block align-middle" />
        <span className="ms-2">Monitoring system</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="ml-auto d-flex align-items-center">
          <Nav.Link href="/MonitoringSystem/About" role="button">About</Nav.Link>
          <Nav.Link href="/MonitoringSystem/Contact" role="button">Contact</Nav.Link>
          <Nav.Item>
            <GeocodingForm handlePress={(ltlng) => onChange(ltlng)} />
          </Nav.Item>
          <CustomDropdown
            options={show_names}
            defaultText="Map style"
            onChange={(option) => onpressMap(real_names[show_names.indexOf(option)])}
          />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
