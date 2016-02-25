import React from 'react';
import classnames from 'classnames';
import {Navbar} from 'react-bootstrap';

const Navbar = (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Home</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">New Post</NavItem>
    </Nav>
  </Navbar>
);

export default Navbar;