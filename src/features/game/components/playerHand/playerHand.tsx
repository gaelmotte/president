import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";
import Card, { compareValues } from "../card/Card";

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
