import React, { useEffect } from "react";
import classNames from "classnames";

import Card from "../card/Card";

import StyledFold from "./Fold.style";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentFold,
  selectIsPlayerTurn,
  setEndFold,
  selectMembersIds,
} from "../../gameSlice";

import { Move, Fold } from "../../../../services/cardsUtils";

export default () => {
  const fold: Fold | null = useSelector(selectCurrentFold);
  const isPlayerTurn = useSelector(selectIsPlayerTurn);
  const members = useSelector(selectMembersIds);
  const dispatch = useDispatch();

  const closed = fold?.closed;

  useEffect(() => {
    if (closed) {
      const timerId = setTimeout(() => dispatch(setEndFold()), 3000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [closed, dispatch]);

  return (
    <StyledFold>
      {fold && (
        <>
          <h3>This is a fold of {fold.cardsPerPlay} cards.</h3>
          {closed && <h3>CLOSED</h3>}
          <ul>
            {fold.moves.map((move: Move, i: number) => (
              <li key={i}>
                {move.playerId}
                {move.cards.map((cardIndex, j) => (
                  <Card
                    key={j}
                    cardIndex={cardIndex}
                    selected={false}
                    handleClick={() => {}}
                  />
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
      {!fold && !isPlayerTurn && (
        <>Waiting for a player to start the new fold</>
      )}
      {!fold && isPlayerTurn && <>Select some cards and start the new fold</>}
    </StyledFold>
  );
};
