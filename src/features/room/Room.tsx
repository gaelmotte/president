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
  selectIsHost,
  startNewGame,
  selectHostId,
  selectPlayerPseudo,
} from "./roomSlice";

export function Room() {
  const pseudo = useSelector(selectPseudo);
  const connectedMembers = useSelector(selectConnectedMembers);
  const isConnected = useSelector(selectIsConnected);
  const isHost = useSelector(selectIsHost);
  const currentGameId = useSelector(selectCurrentGameId);
  const hostId = useSelector(selectHostId);
  const hostPseudo = useSelector(selectPlayerPseudo(hostId));
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
      {currentGameId && <Game gameId={currentGameId} isHost={isHost} />}
      {!currentGameId && isHost && (
        <>
          <h2>
            <button onClick={() => dispatch(startNewGame())}>
              Start Next Game
            </button>
          </h2>
        </>
      )}
    </StyledRoom>
  );
}
