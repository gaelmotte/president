import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouteMatch } from "react-router-dom";

import {
  setPseudo,
  selectPseudo,
  connectToRoom,
  selectIsConnected,
} from "./roomSlice";

export function Room() {
  const pseudo = useSelector(selectPseudo);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();
  const {
    params: { roomId },
  } = useRouteMatch();

  const handleSubmit = useCallback(
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
    <>
      <h1>
        Room {roomId} {isConnected ? "Connected as " + pseudo : "Connecting"}
      </h1>
      {!isConnected && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="pseudo"
            onChange={handlePseudoChange}
          ></input>
          <input type="submit" />
        </form>
      )}
    </>
  );
}
