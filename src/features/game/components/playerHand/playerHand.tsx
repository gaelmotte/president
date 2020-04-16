import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPlayerHand,
  selectIsPlayerTurn,
  playCards,
} from "../../gameSlice";
import Card from "../card/Card";
import { compareValues } from "../../../../services/cardsUtils";
import StyledHand from "./playerHand.style";

export function PlayerHand() {
  const hand = useSelector(selectPlayerHand);
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const dispatch = useDispatch();

  return (
    <StyledHand>
      {hand &&
        hand
          .slice()
          .sort(compareValues)
          .map((cardId) => <Card cardIndex={cardId} key={cardId}></Card>)}
      {isPlayerTurn && (
        <button
          onClick={() => {
            dispatch(playCards());
          }}
        >
          Pass
        </button>
      )}
    </StyledHand>
  );
}
