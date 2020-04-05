import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/Header';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes from './routes';
function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Header />
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
