import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouteMatch } from "react-router-dom";

import { Game } from "../game/Game";

import StyledRoom from "./Room.style";
import ScoreDisplayer from "./components/scoreDisplayer/ScoreDisplayer";
import PlayersSelector from "./components/PlayersSelector/PlayerSelector";

import {
  setPseudo,
  connectToRoom,
  selectIsConnected,
  selectConnectedMembers,
  selectCurrentGameId,
  selectCurrentGamePlayerIds,
  selectIsHost,
  selectHostId,
  selectPlayerPseudo,
} from "./roomSlice";

export function Room() {
  const connectedMembers = useSelector(selectConnectedMembers);
  const isConnected = useSelector(selectIsConnected);
  const isHost = useSelector(selectIsHost);
  const currentGameId = useSelector(selectCurrentGameId);
  const currentGamePlayerIds = useSelector(selectCurrentGamePlayerIds);
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
      {isConnected && currentGameId && currentGamePlayerIds && (
        <Game
          gameId={currentGameId}
          isHost={isHost}
          playerIds={currentGamePlayerIds}
        />
      )}
      {isConnected && !currentGameId && isHost && <PlayersSelector />}
      {isConnected && !currentGameId && <ScoreDisplayer />}
    </StyledRoom>
  );
}
