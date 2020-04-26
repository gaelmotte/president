import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { Counter } from "./features/counter/Counter";
import { Room } from "./features/room/Room";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/counter">
            <Counter />
          </Route>
          <Route path="/newgame">
            <Counter />
          </Route>
          <Route path="/:roomId">
            <Room />
          </Route>
          <Route path="/">
            HOME
            <Link to={"/" + uuidv4()}>GO</Link>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
