import React from "react";
import { useSelector } from "react-redux";

import StyledScoreDisplayer from "./ScoreDisplayer.style";
import { selectPastGamesScores, selectConnectedMembers } from "../../roomSlice";

export default () => {
  const scores = useSelector(selectPastGamesScores);
  const members = useSelector(selectConnectedMembers);

  return (
    <StyledScoreDisplayer>
      {scores.length === 0 && <>No games were played yet</>}
      {scores.length !== 0 &&
        scores.map((set) => (
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                {set.playerIds.map((playerId, index) => (
                  <th key={index}>
                    {members.find((it) => it.id === playerId)?.info.pseudo ||
                      "<disconnected>"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {set.points.map((row, index) => (
                <tr key={index}>
                  <th>Game N°{index + 1}</th>
                  {row.map((cell, index) => (
                    <td key={index}>{cell}pt</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                {set.playerIds.map((playerId, index) => (
                  <td key={index}>
                    {set.total && set.total[index]}
                    pt {set.emojis && set.emojis[index]}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        ))}
    </StyledScoreDisplayer>
  );
};
