import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Paper,
  Box,
  Button,
} from "@material-ui/core";

export default function NavBar(props) {
  const { routes } = props;
  return (
    <Paper elevation={2} style={{ margin: 16 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={1}
        style={{ gap: 8 }}
      >
        {routes.map((route, index) => (
          <Button
            key={index}
            component={NavLink}
            to={route.path}
            exact
            color="primary"
            activeClassName="active-subnav"
          >
            {route.label}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}
