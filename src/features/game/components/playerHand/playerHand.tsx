import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPlayerHand,
  selectIsPlayerTurn,
  playCards,
  giveCards,
  pass,
  selectIsSameOrNothingPlay,
  selectCurrentFold,
  startNewFold,
  selectPusherId,
  selectIsRevolution,
  selectStatus,
  selectCardExchangeOrders,
} from "../../gameSlice";
import Card from "../card/Card";
import { compareValues, isMoveAllowed } from "../../../../services/cardsUtils";
import Adversary from "../PlayerCartouche/PlayerCartouche";

import StyledHand, { StyledSlotInHand } from "./playerHand.style";

export function PlayerHand() {
  const hand = useSelector(selectPlayerHand);
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const dispatch = useDispatch();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const fold = useSelector(selectCurrentFold);
  const playerId = useSelector(selectPusherId);
  const isSameOrNothingPlay = useSelector(selectIsSameOrNothingPlay);
  const isRevolution = useSelector(selectIsRevolution);
  const status = useSelector(selectStatus);
  const orders = useSelector(selectCardExchangeOrders);
  const order = orders?.find((order) => order.from === playerId);

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

  useEffect(() => {
    if (hand && order && order.type === "best" && order.cards.length === 0) {
      const bestCards = hand.slice().sort(compareValues).slice(-order.number);
      dispatch(giveCards(bestCards));
    }

    return () => {};
  }, [order, dispatch, hand]);

  const sortedHand = hand?.slice().sort(compareValues);
  if (isRevolution) sortedHand?.reverse();

  return (
    <StyledHand>
      <div className="buttons">
        {status === "starting" &&
          order &&
          order.cards.length === 0 &&
          order.type === "any" && (
            <button
              onClick={() => {
                if (order.number === selectedCards.length) {
                  dispatch(giveCards(selectedCards));
                  setSelectedCards([]);
                } else {
                  alert("Illegal Gift");
                }
              }}
            >
              {selectedCards.length < 2
                ? `Give ${selectedCards.length} Card`
                : `Give ${selectedCards.length} Cards`}
            </button>
          )}

        {status === "running" && isPlayerTurn && !fold && (
          <button
            onClick={() => {
              if (isMoveAllowed(null, selectedCards, isRevolution)) {
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
        {status === "running" && isPlayerTurn && fold && !fold.closed && (
          <>
            <button
              onClick={() => {
                if (isMoveAllowed(fold, selectedCards, isRevolution)) {
                  dispatch(playCards(selectedCards));
                  setSelectedCards([]);
                } else {
                  alert("Illegal Move");
                }
              }}
            >
              {selectedCards.length < 2
                ? `Play ${selectedCards.length} Card. ${
                    isSameOrNothingPlay ? "(Same Figure or Nothing !)" : ""
                  }`
                : `Play ${selectedCards.length} Cards. ${
                    isSameOrNothingPlay ? "(Same Figure or Nothing !)" : ""
                  }`}
            </button>
            {!isSameOrNothingPlay && (
              <button
                onClick={() => {
                  dispatch(pass());
                  setSelectedCards([]);
                }}
              >
                Pass
              </button>
            )}
          </>
        )}
      </div>

      <section className="cards">
        {sortedHand &&
          sortedHand.map((cardId, index) => (
            <StyledSlotInHand slotIndex={index} slotNumber={sortedHand.length}>
              <Card
                cardIndex={cardId}
                key={cardId}
                selected={selectedCards.includes(cardId)}
                handleClick={toggleCard}
              ></Card>
            </StyledSlotInHand>
          ))}
      </section>
      <div className="playerInfo">
        {playerId && <Adversary playerId={playerId} />}
      </div>
    </StyledHand>
  );
}
