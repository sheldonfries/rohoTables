import React, { useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/Header';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes from './routes';
import { ThemeContext } from './contexts/ThemeContext';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const theme = useMemo(() => createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          a: {
            color: darkMode ? '#90caf9' : '#1976d2',
          },
          'a:visited': {
            color: darkMode ? '#ce93d8' : '#7b1fa2',
          },
        },
      },
    },
  }), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <Header />
          <Switch>
            {routes.map((route, index) => (
              <Route key={index} {...route}>
                {<route.Component />}
              </Route>
            ))}
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
