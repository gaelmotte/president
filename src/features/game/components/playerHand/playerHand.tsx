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
  selectTimerDuration,
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
  const timerDuration = useSelector(selectTimerDuration);
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

  useEffect(() => {
    if (status === "running" && isPlayerTurn && fold) {
      if (!isSameOrNothingPlay) {
        const timerId = setTimeout(() => {
          dispatch(pass());
          setSelectedCards([]);
        }, timerDuration);
        return () => {
          clearTimeout(timerId);
        };
      } else {
        const timerId = setTimeout(() => {
          dispatch(playCards([]));
          setSelectedCards([]);
        }, timerDuration);
        return () => {
          clearTimeout(timerId);
        };
      }
    }
  }, [
    status,
    isPlayerTurn,
    fold,
    isSameOrNothingPlay,
    dispatch,
    setSelectedCards,
    timerDuration,
  ]);

  const sortedHand = hand?.slice().sort(compareValues);
  if (isRevolution) sortedHand?.reverse();

  return (
    <StyledHand>
      {status === "starting" &&
        order &&
        order.cards.length === 0 &&
        order.type === "any" && (
          <div className="actions">
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
          </div>
        )}

      {status === "running" && isPlayerTurn && !fold && (
        <div className="actions">
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
        </div>
      )}
      {status === "running" && isPlayerTurn && fold && !fold.closed && (
        <div className="actions">
          <button
            onClick={() => {
              if (isMoveAllowed(fold, selectedCards, isRevolution)) {
                dispatch(playCards(selectedCards));
                setSelectedCards([]);
              } else {
                alert("Illegal Move");
              }
            }}
            disabled={
              !(
                selectedCards.length === fold.cardsPerPlay ||
                (selectedCards.length === 0 && isSameOrNothingPlay)
              )
            }
          >
            {fold.cardsPerPlay < 2
              ? `Play 1 Card. ${
                  isSameOrNothingPlay ? "(Same Figure or Nothing !)" : ""
                }`
              : `Play ${fold.cardsPerPlay} Cards. ${
                  isSameOrNothingPlay ? "(Same Figure or Nothing !)" : ""
                }`}
          </button>
          {!isSameOrNothingPlay && (
            <button
              onClick={() => {
                dispatch(pass());
                setSelectedCards([]);
              }}
              disabled={selectedCards.length !== 0}
            >
              Pass
            </button>
          )}
        </div>
      )}

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

      {playerId && <Adversary playerId={playerId} isSelf={true} />}
    </StyledHand>
  );
}
