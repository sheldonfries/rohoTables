import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Hidden, IconButton, MenuItem, Menu, AppBar, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import routes from '../routes';
import { withRouter, matchPath } from 'react-router';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      position: 'sticky',
      top: 0,
      zIndex: 99,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function Header(props) {
  const { location, history } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRouteChange = (path) => {
    history.push(path);
    handleClose();
  };

  let match = null;
  let route = null;
  routes.forEach((r) => {
    const m = matchPath(location.pathname, {
      path: r.path,
      exact: true,
      strict: false,
    });
    if (m) {
      match = m;
      route = r;
    }
  });
  let title = 'RGMG';
  if (match && match.params && match.params.name) {
    title = match.params.name;
  } else if (route) {
    title = route.label;
  }
  // set title
  let t = document.querySelector('title');
  t.innerHTML = `RGMG - ${title}`;
  // console.log(match.params.name);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar style={{ position: "relative" }}>
          {/* LEFT SIDE — DESKTOP NAV */}
          <Hidden smDown>
            <div style={{ display: "flex", gap: 20 }}>
              {routes
                .filter(r => r.mainNav)
                .map(route => (
                  <Typography
                    key={route.path}
                    variant="button"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRouteChange(route.path)}
                  >
                    {route.label}
                  </Typography>
                ))}
            </div>
          </Hidden>

          {/* LEFT SIDE — MOBILE HAMBURGER */}
          <Hidden mdUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {routes
                .filter(r => r.mainNav)
                .map(route => (
                  <MenuItem
                    key={route.path}
                    onClick={() => handleRouteChange(route.path)}
                  >
                    {route.label}
                  </MenuItem>
                ))}
            </Menu>
          </Hidden>

          {/* CENTER TITLE */}
          <Typography
            variant="h6"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Header);
