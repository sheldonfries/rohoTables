import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import routes from '../routes';
import { withRouter, matchPath } from 'react-router';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {routes
                .filter((route) => route.mainNav)
                .map((route, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleRouteChange(route.path)}
                  >
                    {route.label}
                  </MenuItem>
                ))}
            </Menu>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Header);
