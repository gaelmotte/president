import React from "react";
import classNames from "classnames";

import StyledMove from "./Move.style";
import { useSelector } from "react-redux";

import { selectPlayerPseudo } from "../../../../../room/roomSlice";

export default ({
  children,
  playerId,
}: {
  children: JSX.Element[];
  playerId: string;
}) => {
  const pseudo = useSelector(selectPlayerPseudo(playerId));
  return (
    <StyledMove>
      <section>{children}</section>
    </StyledMove>
  );
};
