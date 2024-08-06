import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { navigateTo } from '../utils/navigation';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {

  const { logout } = useAuth();
  const [userLogin, setUserLogin] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const encryptedUser = localStorage.getItem('py_pos_user');
    if (encryptedUser) {
      const decryptedUser= JSON.parse(CryptoJS.AES.decrypt(encryptedUser, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8));
      setUserLogin(decryptedUser);
      setEmail(decryptedUser.email);;
    }
    // console.log(email)
  }, [email]);
  

  const handleLogout = () => {
    logout();
    navigateTo('/auth/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/frontend/dashboard">My POS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/frontend/dashboard">Dashboard</Nav.Link> */}
            <Nav.Link as={Link} to="/content/orders">Orders</Nav.Link>

            <NavDropdown title="Product">
              <NavDropdown.Item as ={Link} to="/content/products">Add New Product</NavDropdown.Item>
              <NavDropdown.Item as ={Link} to="/content/products/restock">Restock</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/frontend/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
            <Nav className="ms-2">
              <Navbar.Text>{email}</Navbar.Text>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};



export default NavigationBar;
