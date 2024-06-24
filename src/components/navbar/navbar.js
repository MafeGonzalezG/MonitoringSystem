import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import ColorCycleButton from './buttonChangeMap';
import CustomDropdown from '../Sidebar/dropdown/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import GeocodingForm from './geoCodingForm';

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
  const real_names  =['outdoors-v12','light-v11', 'satellite-v9', 'navigation-night-v1','standard','streets-v12','dark-v11','satellite-streets-v12','navigation-day-v1'];
  const show_names  =['Outdoors','Light', 'Satellite', 'Navigation night','Standard','Streets','Dark','Satellite Streets','Navigation day'];
  return (
    <Navbar bg="light" expand="lg" className="bg-transparent.bg-gradient text-dark">
      <Navbar.Brand href="/MonitoringSystem" role="button">Monitoring</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="ml-auto">
          <Nav.Link href="/MonitoringSystem/About" role="button">About</Nav.Link>
          <Nav.Link href="/MonitoringSystem/Contact" role="button">Contact</Nav.Link>
          <CustomDropdown options={show_names} defaultText="Map style" onChange={(option) => onpressMap(real_names[show_names.indexOf(option)])} />
          <Nav.Item>
            <GeocodingForm handlePress={(ltlng) => onChange(ltlng)} />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
