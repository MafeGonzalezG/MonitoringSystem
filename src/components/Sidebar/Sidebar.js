import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomDropdown from './dropdown/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';  // Importing the CSS file for additional styling

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
          Nature
          <CustomDropdown
            options={['Reservas indigenas', 'Catastro', 'Manglares','Hot Spots','Carbon Secuestro']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Climate
          <CustomDropdown
            options={['Precipitation', 'Pressure', 'Temperature', 'Clouds', 'Wind','Temperatura Estaciones IDEAM']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Communities
          <CustomDropdown
            options={['Comunidades Negras', 'Mining', 'Communities', 'Education', 'Military Zones','Resguardos','Informalidad']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Biodiversity
          <CustomDropdown
            options={['Agricultura Familiar','Acuiferos Cesar']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Risk map and Impacts
          <CustomDropdown
            options={['Deforestation', 'Earthquakes', 'Air Quality', 'Fires','Events','Fallas']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Water
          <CustomDropdown
            options={['Cuencas','Water Quality']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Sidebar;
