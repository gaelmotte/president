import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import StyledPlayersSelector from "./PlayersSelector.style";
import {
  selectConnectedMembers,
  selectPlayersPseudo,
  startNewGame,
  selectPreviousGamePlayers,
} from "../../roomSlice";
import { selectSamePlayersAsPreviousGame } from "../../../game/gameSlice";

export default () => {
  const dispatch = useDispatch();
  const members = useSelector(selectConnectedMembers);
  const playersPseudo = useSelector(selectPlayersPseudo);
  const previousGamePlayers = useSelector(selectPreviousGamePlayers);

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const handleChangeCheckbox = useCallback(
    (playerId: string) => {
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers(selectedPlayers.filter((it) => it !== playerId));
      } else {
        setSelectedPlayers(
          members
            .filter(
              (it) => selectedPlayers.includes(it.id) || it.id === playerId
            )
            .map((it) => it.id)
        );
      }
    },
    [selectedPlayers, setSelectedPlayers, members]
  );
  const isSamePlayers = useSelector(
    selectSamePlayersAsPreviousGame(selectedPlayers)
  );

  useEffect(() => {
    if (previousGamePlayers && previousGamePlayers.length !== 0) {
      setSelectedPlayers(previousGamePlayers);
    }
  }, [previousGamePlayers, setSelectedPlayers]);

  return (
    <StyledPlayersSelector>
      <div>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(member.id)}
                  onChange={() => handleChangeCheckbox(member.id)}
                />
                {playersPseudo[member.id]}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {!isSamePlayers && (
          <>
            <h2>Start a game</h2>
            Starting a game for all the connected members for that first game.
            (players changed or first game)
            <button
              onClick={() => {
                if (selectedPlayers.length >= 4 && selectedPlayers.length <= 6)
                  dispatch(startNewGame(selectedPlayers));
              }}
              disabled={
                selectedPlayers.length < 4 || selectedPlayers.length > 6
              }
            >
              Start First Game
            </button>
          </>
        )}
        {isSamePlayers && (
          <>
            <h2>Start a game</h2>
            Starting a game with card exchange since players are the same
            <button
              onClick={() => {
                if (selectedPlayers.length >= 4 && selectedPlayers.length <= 6)
                  dispatch(startNewGame(selectedPlayers));
              }}
              disabled={
                selectedPlayers.length < 4 || selectedPlayers.length > 6
              }
            >
              Start Next Game
            </button>
          </>
        )}
      </div>
    </StyledPlayersSelector>
  );
};
