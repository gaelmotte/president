import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";

import { getFigure, getColor } from "../../../../services/cardsUtils";

export default ({ cardIndex }: { cardIndex: number }) => {
  return (
    <div>
      {getFigure(cardIndex)}
      {getColor(cardIndex)}
    </div>
  );
};
