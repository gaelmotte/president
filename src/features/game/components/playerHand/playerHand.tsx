import React, { useState, useCallback } from "react";
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
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const toggleCard = useCallback(
    (cardId: number) => {
      if (selectedCards.includes(cardId)) {
        setSelectedCards(selectedCards.filter((it) => it !== cardId));
      } else {
        setSelectedCards([...selectedCards, cardId]);
      }
    },
    [setSelectedCards, selectedCards]
  );

  return (
    <StyledHand>
      {hand &&
        hand
          .slice()
          .sort(compareValues)
          .map((cardId) => (
            <Card
              cardIndex={cardId}
              key={cardId}
              selected={selectedCards.includes(cardId)}
              handleClick={toggleCard}
            ></Card>
          ))}
      {isPlayerTurn && (
        <button
          onClick={() => {
            dispatch(playCards(selectedCards));
            setSelectedCards([]);
          }}
        >
          Pass
        </button>
      )}
    </StyledHand>
  );
}
