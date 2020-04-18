import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeGame,
  selectStatus,
  selectFinishedPlayers,
  reset,
} from "./gameSlice";

import { setCurrentGame, selectConnectedMembers } from "../room/roomSlice";

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
  const connectedMembers = useSelector(selectConnectedMembers);
  const missingPlayer = playerIds.some(
    (id) => !connectedMembers.map((member) => member.id).includes(id)
  );

  useEffect(() => {
    //init the game
    dispatch(initializeGame(isHost, playerIds));
    return () => {};
  }, [dispatch, isHost, playerIds]);

  useEffect(() => {
    if (missingPlayer) {
      setTimeout(() => {
        dispatch(reset());
        dispatch(setCurrentGame({ gameId: null, playerIds: null }));
      }, 3000);
    }
    return () => {};
  }, [dispatch, missingPlayer]);

  return (
    <StyledGame>
      <header>
        <h2>
          {gameId} - {status}
        </h2>
      </header>
      {missingPlayer && <h3>Manche Annulée - Joueur déconnecté</h3>}
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
