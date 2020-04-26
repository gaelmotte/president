import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouteMatch } from "react-router-dom";

import { Game } from "../game/Game";

import StyledRoom from "./Room.style";

import {
  setPseudo,
  connectToRoom,
  selectIsConnected,
  selectConnectedMembers,
  selectCurrentGameId,
  selectCurrentGamePlayerIds,
  selectIsHost,
  startNewGame,
  selectHostId,
  selectPlayerPseudo,
} from "./roomSlice";
import { selectSamePlayersAsPreviousGame } from "../game/gameSlice";

export function Room() {
  const connectedMembers = useSelector(selectConnectedMembers);
  const isConnected = useSelector(selectIsConnected);
  const isHost = useSelector(selectIsHost);
  const currentGameId = useSelector(selectCurrentGameId);
  const currentGamePlayerIds = useSelector(selectCurrentGamePlayerIds);
  const hostId = useSelector(selectHostId);
  const hostPseudo = useSelector(selectPlayerPseudo(hostId));
  const isSamePlayers = useSelector(
    selectSamePlayersAsPreviousGame(connectedMembers.map((member) => member.id))
  );
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

  return (
    <StyledRoom>
      <header>
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
      </header>
      {currentGameId && currentGamePlayerIds && (
        <Game
          gameId={currentGameId}
          isHost={isHost}
          playerIds={currentGamePlayerIds}
        />
      )}
      {!currentGameId && isHost && !isSamePlayers && (
        <>
          <h2>Start a game</h2>
          Starting a game for all the connected members for that first game.
          (players changed or first game)
          <button
            onClick={() =>
              dispatch(
                startNewGame(connectedMembers.map((member) => member.id))
              )
            }
          >
            Start First Game
          </button>
        </>
      )}

      {!currentGameId && isHost && isSamePlayers && (
        <>
          <h2>Start a game</h2>
          Starting a game with card exchange since players are the same
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
