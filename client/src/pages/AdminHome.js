import React from 'react';
import Transactions from '../components/admin/Transactions';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from '../components/admin/NavBar';

const adminPrefix = '/admin';
export const adminRoutes = [
  {
    path: `${adminPrefix}/transactions`,
    Component: Transactions,
    label: 'Transactions',
  },
];

export default function AdminHome() {
  return (
    <div>
      <NavBar routes={adminRoutes} />
      <Switch>
        {adminRoutes.map((route, index) => (
          <Route key={index} {...route}>
            {<route.Component />}
          </Route>
        ))}
      </Switch>
    </div>
  );
}
