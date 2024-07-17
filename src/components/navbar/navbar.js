import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import CustomDropdown from '../Sidebar/dropdown/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import GeocodingForm from './geoCodingForm';
import logoPlanet from '../../assets/images/logo_planet.png';
import InputFile from '../input/InputData';
/**
 * Navigation bar component.
 *
 * @component
 * @param {Object} props - The component accepts onChange props.
 * @param {function} props.onChange - The change+enter press event handler.
 * @param {function} props.onpressMap - The map style change event handler.
 * @param {function} props.SetinputFile - The input file event handler.
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * // Render a navbar with a search bar that logs the input value on enter press.
 * <Navbar onChange={()=>console.log('value changed');} onpressMap={()=>console.log('map style changed');} SetinputFile={()=>console.log('input file added');}/>
 */
function CustomNavbar({ onpressMap, onChange, SetinputFile }) {
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
        <img src={logoPlanet} alt="" height="65vh" className="d-inline-block align-middle" />
        <span className="ms-2">Monitoring system</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="ml-auto d-flex align-items-center">
          <Nav.Link href="/MonitoringSystem/About" role="button">About</Nav.Link>
          <Nav.Link href="/MonitoringSystem/Contact" role="button">Contact</Nav.Link>
          <CustomDropdown
            options={show_names}
            defaultText="Map style"
            onChange={(option) => onpressMap(real_names[show_names.indexOf(option)])}
          />
           <Nav.Item>
            <GeocodingForm handlePress={(ltlng) => onChange(ltlng)} />
          </Nav.Item>
          <Nav.Item>
          <InputFile SetinputFile={SetinputFile}/>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
