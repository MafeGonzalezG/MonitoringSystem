import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';  // Importing the CSS file for additional styling
import Card from './Card';
import CustomDropdown from './dropdown/Dropdown';

/**
 * Sidebar component using react-bootstrap.
 *
 * @component
 * @param {Object} props - The component accepts onChange props.
 * @param {function} props.onChange - The change event handler.
 * @returns {JSX.Element} The rendered Sidebar component.
 *
 * @example
 * // Render a sidebar with multiple dropdowns.
 * <Sidebar onChange={(option) => console.log(option)} />
 */
function Sidebar({ onChange }) {
  const optionChange = (option) => {
    onChange(option);
  };

  return (
    <Container className="sidebar bg-transparent bg-gradient text-dark">
      <Row>
        <Col>
          <Card title="Nature" options={['Reservas indigenas', 'Catastro', 'Manglares','Hot Spots','Carbon Secuestro']} onChange={optionChange} />
        </Col>
      </Row>
      <Row>
        <Col>
        <Card title="Climate" options={['Precipitation', 'Pressure', 'Temperature', 'Clouds', 'Wind','Temperatura Estaciones IDEAM']} onChange={optionChange} />
        </Col>
      </Row>
      <Row>
        <Col>
        <Card title="Communities" options={['Comunidades Negras', 'Mining', 'Communities', 'Education', 'Military Zones','Resguardos','Informalidad']} onChange={optionChange} />
        </Col>
      </Row>
      <Row>
        <Col>
        <Card title="Biodiversity" options={['Agricultura Familiar','Acuiferos Cesar']} onChange={optionChange} />
        </Col>
      </Row>
      <Row>
        <Col>
        <Card title="Risk map and Impacts" options={['Deforestation', 'Earthquakes', 'Air Quality', 'Fires','Events','Fallas']} onChange={optionChange} />
        </Col>
      </Row>
      <Row>
        <Col>
        <Card title="Infrastructure" options={['Roads', 'Railways', 'Ports', 'Airports','Energy','Telecomunicaciones','Pipelines','Cables Submarinos']} onChange={optionChange} />
        </Col>
      </Row>
    </Container>
  );
}

export default Sidebar;
