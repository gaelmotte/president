import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";

import { getFigure, getColor } from "../../../../services/cardsUtils";
import StyledCard from "./Card.style";

export default ({ cardIndex }: { cardIndex: number }) => {
  return (
    <StyledCard>
      <div className={getColor(cardIndex)}>
        {getFigure(cardIndex)}
        {getColor(cardIndex)}
      </div>
    </StyledCard>
  );
};
