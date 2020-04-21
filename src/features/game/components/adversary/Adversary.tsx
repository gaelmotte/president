import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import StyledAdversary from "./Adversary.style";
import {
  selectPlayerPseudo,
  selectPlayerAvatar,
} from "../../../room/roomSlice";
import {
  selectCurrentPlayer,
  selectAdversaryHandSize,
  selectFinishedPlayers,
  selectPassedPlayers,
  selectComputeFinishEmoji,
  selectComputePreviousFinishEmoji,
} from "../../gameSlice";

export default ({ playerId }: { playerId: string }) => {
  const pseudo = useSelector(selectPlayerPseudo(playerId));
  const avatar = useSelector(selectPlayerAvatar(playerId));
  const isPlaying = useSelector(selectCurrentPlayer) === playerId;
  const handSize = useSelector(selectAdversaryHandSize(playerId));
  const isFinished = useSelector(selectFinishedPlayers)?.includes(playerId);
  const hasPassed = useSelector(selectPassedPlayers)?.includes(playerId);
  const finishEmoji = useSelector(selectComputeFinishEmoji(playerId));
  const previousFinishEmoji = useSelector(
    selectComputePreviousFinishEmoji(playerId)
  );
  return (
    <StyledAdversary className={classNames({ isPlaying })}>
      {avatar}
      {pseudo}
      <br />
      {handSize} cards.
      <br />
      {previousFinishEmoji && <>{previousFinishEmoji}</>}
      {finishEmoji && previousFinishEmoji && <> ➡ {finishEmoji}</>}
      {finishEmoji && !previousFinishEmoji && <>{finishEmoji}</>}
      {hasPassed && <>🙅‍♂️</>}
    </StyledAdversary>
  );
};
