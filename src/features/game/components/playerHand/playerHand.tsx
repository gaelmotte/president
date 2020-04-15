import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";
import Card from "../card/Card";
import { compareValues } from "../../../../services/cardsUtils";
import StyledHand from "./playerHand.style";

export function PlayerHand() {
  let hand = useSelector(selectPlayerHand);
  return (
    <StyledHand>
      {hand &&
        hand
          .slice()
          .sort(compareValues)
          .map((cardId) => <Card cardIndex={cardId} key={cardId}></Card>)}
    </StyledHand>
  );
}
