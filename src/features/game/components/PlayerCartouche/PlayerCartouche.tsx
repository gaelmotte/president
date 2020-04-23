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
  isSelf = false,
}: {
  playerId: string;
  playerIndex?: number;
  playerNumber?: number;
  isSelf?: boolean;
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
      isSelf={isSelf}
    >
      <div className="avatar">
        <span role="img" aria-label="player avatar">
          😀
        </span>
      </div>
      <span className="details">
        {hasPassed && <>🙅‍♂️</>}
        {pseudo}
        {previousFinishEmoji && <>{previousFinishEmoji}</>}
        {finishEmoji && previousFinishEmoji && <> ➡ {finishEmoji}</>}
        {finishEmoji && !previousFinishEmoji && <>{finishEmoji}</>}
      </span>
      <span className="handsize"> {handSize} </span>
    </StyledPlayerCartouche>
  );
};
