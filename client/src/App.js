import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './Main';
import EditFood from './EditFood';

import "./styles/styles.css";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/edit/:id">
            <EditFood />
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default App;