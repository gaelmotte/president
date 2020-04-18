import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import Card from "../card/Card";
import MoveComp from "./components/Move/Move";

import StyledFold from "./Fold.style";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentFold,
  selectIsPlayerTurn,
  setEndFold,
  selectPlayerIds,
} from "../../gameSlice";

import { Move, Fold } from "../../../../services/cardsUtils";

export default () => {
  const fold: Fold | null = useSelector(selectCurrentFold);
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const playerIds = useSelector(selectPlayerIds);
  const dispatch = useDispatch();

  const closed = fold?.closed;
  const moves = fold?.moves;

  const movesSection = useRef(null);

  useEffect(() => {
    if (closed) {
      const timerId = setTimeout(() => dispatch(setEndFold()), 3000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [closed, dispatch]);

  useEffect(() => {
    if (movesSection !== null && movesSection.current !== null) {
      //@ts-ignore  WTF
      movesSection.current.scrollTop = movesSection.current.scrollHeight;
    }
    return () => {};
  }, [movesSection, moves]);

  return (
    <StyledFold>
      {fold && (
        <>
          {closed && <h3>CLOSED</h3>}
          <section className="moves" ref={movesSection}>
            {fold.moves
              .filter((move) => move.cards.length !== 0)
              .map((move: Move, i: number) => (
                <MoveComp key={i} playerId={move.playerId}>
                  {move.cards.map((cardIndex, j) => (
                    <Card
                      key={j}
                      cardIndex={cardIndex}
                      selected={false}
                      handleClick={() => {}}
                    />
                  ))}
                </MoveComp>
              ))}
          </section>
        </>
      )}
      {!fold && !isPlayerTurn && (
        <>Waiting for a player to start the new fold</>
      )}
      {!fold && isPlayerTurn && <>Select some cards and start the new fold</>}
    </StyledFold>
  );
};
