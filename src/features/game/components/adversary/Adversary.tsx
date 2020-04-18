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
} from "../../gameSlice";

export default ({ playerId }: { playerId: string }) => {
  const pseudo = useSelector(selectPlayerPseudo(playerId));
  const isPlaying = useSelector(selectCurrentPlayer) === playerId;
  const handSize = useSelector(selectAdversaryHandSize(playerId));
  const isFinished = useSelector(selectFinishedPlayers)?.includes(playerId);
  const hasPassed = useSelector(selectPassedPlayers)?.includes(playerId);
  return (
    <StyledAdversary className={classNames({ isPlaying })}>
      {pseudo}
      <br />
      {handSize} cards.
      <br />
      {isFinished && <>Finished</>}
      {hasPassed && <>Passed</>}
    </StyledAdversary>
  );
};
