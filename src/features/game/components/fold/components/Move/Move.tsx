import React from "react";
import classNames from "classnames";

import StyledMove from "./Move.style";

export default ({
  children,
  playerId,
}: {
  children: JSX.Element[];
  playerId: string;
}) => {
  return (
    <StyledMove>
      <div>
        <header>{playerId}</header>
        <section>{children}</section>
      </div>
    </StyledMove>
  );
};
