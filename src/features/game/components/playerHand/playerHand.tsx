import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPlayerHand,
  selectIsPlayerTurn,
  playCards,
  pass,
  selectHasPlayerPassed,
  selectCurrentFold,
  startNewFold,
  selectPusherId,
} from "../../gameSlice";
import Card from "../card/Card";
import { compareValues, isMoveAllowed } from "../../../../services/cardsUtils";
import Adversary from "../adversary/Adversary";

import StyledHand from "./playerHand.style";

export function PlayerHand() {
  const hand = useSelector(selectPlayerHand);
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const dispatch = useDispatch();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const fold = useSelector(selectCurrentFold);
  const playerId = useSelector(selectPusherId);

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
      <div className="playerInfo">
        {playerId && <Adversary playerId={playerId} />}
      </div>
      <div className="buttons">
        {isPlayerTurn && !fold && (
          <button
            onClick={() => {
              if (isMoveAllowed(null, selectedCards)) {
                dispatch(startNewFold(selectedCards));
                setSelectedCards([]);
              } else {
                alert("Illegal Move");
              }
            }}
          >
            Start New Fold
          </button>
        )}
        {isPlayerTurn && fold && !fold.closed && (
          <>
            <button
              onClick={() => {
                if (isMoveAllowed(fold, selectedCards)) {
                  dispatch(playCards(selectedCards));
                  setSelectedCards([]);
                } else {
                  alert("Illegal Move");
                }
              }}
            >
              {selectedCards.length < 2
                ? `Play ${selectedCards.length} Card`
                : `Play ${selectedCards.length} Cards`}
            </button>
            <button
              onClick={() => {
                dispatch(pass());
                setSelectedCards([]);
              }}
            >
              Pass
            </button>
          </>
        )}
      </div>

      <section className="cards">
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
      </section>
    </StyledHand>
  );
}
