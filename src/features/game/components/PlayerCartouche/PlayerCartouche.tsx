import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import StyledPlayerCartouche from "./PlayerCartouche.style";
import { selectPlayerPseudo } from "../../../room/roomSlice";
import {
  selectCurrentPlayer,
  selectAdversaryHandSize,
  selectFinishedPlayers,
  selectPassedPlayers,
  selectComputeFinishEmoji,
  selectComputePreviousFinishEmoji,
} from "../../gameSlice";

export default ({
  playerId,
  playerIndex,
  playerNumber,
}: {
  playerId: string;
  playerIndex?: number;
  playerNumber?: number;
}) => {
  const pseudo = useSelector(selectPlayerPseudo(playerId));
  const isPlaying = useSelector(selectCurrentPlayer) === playerId;
  const handSize = useSelector(selectAdversaryHandSize(playerId));
  const isFinished = useSelector(selectFinishedPlayers)?.includes(playerId);
  const hasPassed = useSelector(selectPassedPlayers)?.includes(playerId);
  const finishEmoji = useSelector(selectComputeFinishEmoji(playerId));
  const previousFinishEmoji = useSelector(
    selectComputePreviousFinishEmoji(playerId)
  );
  return (
    <StyledPlayerCartouche
      className={classNames({ isPlaying })}
      playerId={playerId}
      playerIndex={playerIndex}
      playerNumber={playerNumber}
    >
      <div className="avatar">
        <span role="img" aria-label="player avatar">
          😀
        </span>
        <span className="handsize"> {handSize} </span>
      </div>
      <div className="details">
        <div className="pseudo">
          {pseudo}
          {previousFinishEmoji && <>{previousFinishEmoji}</>}
        </div>
        <div className="finishpass">
          {finishEmoji && previousFinishEmoji && <> ➡ {finishEmoji}</>}{" "}
          {finishEmoji && !previousFinishEmoji && <>{finishEmoji}</>}
          {hasPassed && <>🙅‍♂️</>}
        </div>
      </div>
    </StyledPlayerCartouche>
  );
};
