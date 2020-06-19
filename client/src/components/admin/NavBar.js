import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar(props) {
  const { routes } = props;
  return (
    <nav style={{ zIndex: 10, margin: 15 }}>
      {routes.map((route, index) => (
        <NavLink key={index} to={route.path}>
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
}
