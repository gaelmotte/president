import React from "react";
import { Link } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import StyledHome from "./Home.style";

export function Home() {
  return (
    <StyledHome>
      HOME
      <Link to={"/" + uuidv4()}>GO</Link>
    </StyledHome>
  );
}
