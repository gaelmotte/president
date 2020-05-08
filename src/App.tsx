import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import useIsMobile from "./hooks/useIsMobile";

import { Room } from "./features/room/Room";
import { Home } from "./features/home/Home";

import "./App.css";

function App() {
  const isMobile = useIsMobile();
  return (
    <div className="App">
      {isMobile && (
        <div className="force-landscape">
          <img
            className="rotate"
            src="/rotate.gif"
            alt="Please Use Landscape Orientation"
          />
        </div>
      )}
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
