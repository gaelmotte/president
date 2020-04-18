import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeGame,
  selectStatus,
  selectFinishedPlayers,
} from "./gameSlice";
import { PlayerHand } from "./components/playerHand/playerHand";
import Fold from "./components/fold/Fold";

import StyledGame from "./Game.style";

export function Game({
  gameId,
  isHost,
  playerIds,
}: {
  gameId: string;
  isHost: boolean;
  playerIds: string[];
}) {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const finishedPlayers = useSelector(selectFinishedPlayers);

  useEffect(() => {
    //init the game
    dispatch(initializeGame(isHost, playerIds));
    return () => {};
  }, [dispatch, isHost, playerIds]);

  return (
    <StyledGame>
      <header>
        <h2>
          {gameId} - {status}
        </h2>
      </header>
      <section>
        {finishedPlayers && finishedPlayers.length > 0 && (
          <ul>
            {finishedPlayers.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        )}
      </section>

      <Fold />
      <PlayerHand />
    </StyledGame>
  );
}
