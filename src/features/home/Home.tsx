import React from "react";
import { Link } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import StyledHome from "./Home.style";

export function Home() {
  return (
    <StyledHome>
      <div className="content">
        <Link to={"/" + uuidv4()}>
          <button type="button">Create a new Room</button>
        </Link>
      </div>
    </StyledHome>
  );
}
