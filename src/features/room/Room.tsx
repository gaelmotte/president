import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouteMatch } from "react-router-dom";

import { Game } from "../game/Game";

import StyledRoom from "./Room.style";

import {
  setPseudo,
  selectPseudo,
  connectToRoom,
  selectIsConnected,
  selectConnectedMembers,
  selectCurrentGameId,
  selectCurrentGamePlayerIds,
  selectIsHost,
  startNewGame,
  selectHostId,
  selectPlayerPseudo,
  selectPreviousGamePlayers,
} from "./roomSlice";

export function Room() {
  const pseudo = useSelector(selectPseudo);
  const connectedMembers = useSelector(selectConnectedMembers);
  const isConnected = useSelector(selectIsConnected);
  const isHost = useSelector(selectIsHost);
  const currentGameId = useSelector(selectCurrentGameId);
  const currentGamePlayerIds = useSelector(selectCurrentGamePlayerIds);
  const hostId = useSelector(selectHostId);
  const hostPseudo = useSelector(selectPlayerPseudo(hostId));
  const previousGamePlayers = useSelector(selectPreviousGamePlayers);
  const dispatch = useDispatch();
  const {
    params: { roomId },
  } = useRouteMatch();

  const handleSubmitConnectionForm = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(connectToRoom(roomId));
    },
    [roomId, dispatch]
  );

  const handlePseudoChange = useCallback(
    (e) => {
      dispatch(setPseudo(e.target.value));
    },
    [dispatch]
  );

  console.log(connectedMembers);
  return (
    <StyledRoom>
      {isConnected && <h1>Room created by {hostPseudo}.</h1>}
      {!isConnected && (
        <form onSubmit={handleSubmitConnectionForm}>
          <input
            type="text"
            placeholder="pseudo"
            onChange={handlePseudoChange}
          ></input>
          <input type="submit" />
        </form>
      )}

      {isConnected && (
        <>
          Connected to the room :{" "}
          {connectedMembers.map((member) => member.info.pseudo).join(", ")}
        </>
      )}
      {currentGameId && currentGamePlayerIds && (
        <Game
          gameId={currentGameId}
          isHost={isHost}
          playerIds={currentGamePlayerIds}
        />
      )}
      {!currentGameId && isHost && !previousGamePlayers && (
        <>
          <h2>Start a game</h2>
          Starting a game for all the connected members for that first game.
          <button
            onClick={() =>
              dispatch(
                startNewGame(connectedMembers.map((member) => member.id))
              )
            }
          >
            Start Next Game
          </button>
        </>
      )}
    </StyledRoom>
  );
}
