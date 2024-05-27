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
          Carbon Units
          <CustomDropdown
            options={['Especie', 'Parameter', 'Diameter', 'Evolution']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Climate
          <CustomDropdown
            options={['Precipitation', 'Pressure', 'Temperature', 'Clouds', 'Wind']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Communities
          <CustomDropdown
            options={['Agriculture', 'Transport', 'Mining', 'Health', 'Education', 'Fishing']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Biodiversity
          <CustomDropdown
            options={['Biodiversity', 'Ecosystems']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Risk map and Impacts
          <CustomDropdown
            options={['Deforestation', 'Earthquakes', 'Air Quality', 'Fires', 'Floods', 'Methane', 'Ocean']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          Thematic Maps
          <CustomDropdown
            options={['Cuencas']}
            defaultText="Select an option"
            onChange={optionChange}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Sidebar;
