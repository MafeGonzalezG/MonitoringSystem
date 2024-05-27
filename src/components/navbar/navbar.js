import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import ColorCycleButton from './buttonChangeMap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

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
function CustomNavbar({ onpressMap,onChange }) {
  const handlePress = (country) => {
    onChange(country);
    console.log(country);
  };
  const [input, setInput] = useState('');

  return (
    <Navbar bg="light" expand="lg" className="bg-transparent.bg-gradient text-dark">
      <Navbar.Brand href="#" role="button">Monitoring</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent" className="justify-content-around">
        <Nav className="mr-auto">
          <Nav.Link href="#" role="button">Home</Nav.Link>
          <Nav.Link href="#" role="button">Pricing</Nav.Link>
          <Nav.Link href="#" role="button">Contact</Nav.Link>
          <Nav.Item>
            <Form  className="my-1 my-lg-0">
              <FormControl
                type="text"
                placeholder="country"
                className="mr-sm-2"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {if (e.key === 'Enter') {handlePress(input);
                  e.preventDefault(); }}}/>
            </Form>
          </Nav.Item>
        </Nav>
        <div>
          <ColorCycleButton onpressMap={onpressMap} />
          <Button variant="primary" size="sm" className="m-3" id="signin">Sign In</Button>
          <Button variant="primary" size="sm" className="m-3" id="signin">Sign In</Button>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
