import React from "react";
import classNames from "classnames";

import { getFigure, getColor } from "../../../../services/cardsUtils";
import StyledCard from "./Card.style";

declare global {
  interface Window {
    cardColor1: any;
    cardColor2: any;
  }
}

window.cardColor1 = window.cardColor1 || "goldenrod";
window.cardColor2 = window.cardColor2 || "black";

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
    <StyledCard
      cardColor1={window.cardColor1}
      cardColor2={window.cardColor2}
      className={classNames(getColor(cardIndex), { selected: selected })}
      onClick={() => handleClick(cardIndex)}
      data-figure={getFigure(cardIndex)}
      data-color={getColor(cardIndex)}
    />
  );
};
