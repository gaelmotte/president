import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";
import Card from "../card/Card";

export function PlayerHand() {
  const hand = useSelector(selectPlayerHand);
  return (
    <>
      {hand &&
        hand.map((cardId) => <Card cardIndex={cardId} key={cardId}></Card>)}
    </>
  );
}
