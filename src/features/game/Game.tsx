import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeGame,
  selectStatus,
  reset,
  selectAdversaries,
  selectIsGameFinished,
  archiveCurrentGame,
} from "./gameSlice";

import { setCurrentGame, selectConnectedMembers } from "../room/roomSlice";

import { PlayerHand } from "./components/playerHand/playerHand";
import Fold from "./components/fold/Fold";
import CardExchanges from "./components/cardExchanges/cardExchanges";

import StyledGame from "./Game.style";
import PlayerCartouche from "./components/PlayerCartouche/PlayerCartouche";

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
  const connectedMembers = useSelector(selectConnectedMembers);
  const missingPlayer = playerIds.some(
    (id) => !connectedMembers.map((member) => member.id).includes(id)
  );
  const adversaries = useSelector(selectAdversaries);
  const isGameFinished = useSelector(selectIsGameFinished);

  useEffect(() => {
    //init the game
    dispatch(initializeGame(isHost, playerIds));
    return () => {};
  }, [dispatch, isHost, playerIds]);

  useEffect(() => {
    if (missingPlayer) {
      const timerId = setTimeout(() => {
        dispatch(reset());
        dispatch(setCurrentGame({ gameId: null, playerIds: null }));
      }, 3000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [dispatch, missingPlayer]);

  useEffect(() => {
    if (isGameFinished) {
      const timerId = setTimeout(() => {
        dispatch(archiveCurrentGame());
        dispatch(reset());
        dispatch(setCurrentGame({ gameId: null, playerIds: null }));
      }, 3000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isGameFinished, dispatch]);

  return (
    <StyledGame>
      {missingPlayer && <h3>Manche Annulée - Joueur déconnecté</h3>}
      <section className="gameTable">
        {adversaries &&
          adversaries.map((playerId, index) => (
            <PlayerCartouche
              playerId={playerId}
              key={playerId}
              playerIndex={index}
              playerNumber={adversaries.length}
            />
          ))}

        {status === "starting" && <CardExchanges />}
        {status === "running" && <Fold />}
      </section>
      <PlayerHand />
    </StyledGame>
  );
}
