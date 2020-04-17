import React from "react";
import classNames from "classnames";

import { getFigure, getColor } from "../../../../services/cardsUtils";
import StyledCard from "./Card.style";

export default ({
  cardIndex,
  selected,
  handleClick,
}: {
  cardIndex: number;
  selected: boolean;
  handleClick: (cardId: number) => void;
}) => {
  return (
    <StyledCard>
      <div
        className={classNames(getColor(cardIndex), { selected: selected })}
        onClick={() => handleClick(cardIndex)}
      >
        {getFigure(cardIndex)}
        {getColor(cardIndex)}
      </div>
    </StyledCard>
  );
};
