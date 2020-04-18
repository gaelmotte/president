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

export default () => {
  const fold: {
    cards: number[][];
    passedPlayers: string[];
    cardsPerPlay: number;
    closed: boolean;
  } | null = useSelector(selectCurrentFold);
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
            {fold.cards.map((cardsTuple: number[], i: number) => (
              <li key={i}>
                {cardsTuple.map((cardIndex, j) => (
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
