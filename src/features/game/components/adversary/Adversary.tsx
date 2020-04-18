import React from "react";
import classNames from "classnames";

import StyledAdversary from "./Adversary.style";

export default ({ playerId }: { playerId: string }) => {
  return <StyledAdversary>{playerId}</StyledAdversary>;
};
