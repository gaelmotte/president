import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import StyledAdversary from "./Adversary.style";
import { selectPlayerPseudo } from "../../../room/roomSlice";
import {
  selectCurrentPlayer,
  selectAdversaryHandSize,
  selectFinishedPlayers,
  selectPassedPlayers,
  selectComputeFinishEmoji,
} from "../../gameSlice";

export default ({ playerId }: { playerId: string }) => {
  const pseudo = useSelector(selectPlayerPseudo(playerId));
  const isPlaying = useSelector(selectCurrentPlayer) === playerId;
  const handSize = useSelector(selectAdversaryHandSize(playerId));
  const isFinished = useSelector(selectFinishedPlayers)?.includes(playerId);
  const hasPassed = useSelector(selectPassedPlayers)?.includes(playerId);
  const finishEmoji = useSelector(selectComputeFinishEmoji(playerId));
  return (
    <StyledAdversary className={classNames({ isPlaying })}>
      {pseudo}
      <br />
      {handSize} cards.
      <br />
      {finishEmoji && <>{finishEmoji}</>}
      {hasPassed && <>🙅‍♂️</>}
    </StyledAdversary>
  );
};
