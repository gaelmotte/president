import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Room } from "./features/room/Room";
import { Home } from "./features/home/Home";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/:roomId">
            <Room />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
