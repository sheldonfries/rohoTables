import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar(props) {
  const { routes } = props;
  return (
    <nav>
      {routes.map((route, index) => (
        <NavLink key={index} to={route.path}>
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
}
