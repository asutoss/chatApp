import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router , Route, Switch } from 'react-router-dom';

import HomePage from './components/home-page';
import LoginPage from './components/loginPage';

const App = () => (
    <Router>
      <div>
        <Switch>
          <Route exact path='/'>
              <LoginPage />
          </Route>
          <Route path="/hp">
              <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
);

ReactDOM.render(<App />, document.getElementById("app"));
