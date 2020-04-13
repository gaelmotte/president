import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { initializeGame, selectStatus } from "./gameSlice";

export function Game({
  gameId,
  isLeader,
}: {
  gameId: string;
  isLeader: boolean;
}) {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  useEffect(() => {
    //init the game
    dispatch(initializeGame(isLeader));
    return () => {};
  }, [dispatch, isLeader]);

  return (
    <h2>
      {gameId} - {status}
    </h2>
  );
}
