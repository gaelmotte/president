import React from "react";
import classNames from "classnames";

import Card from "../card/Card";

import StyledFold from "./Fold.style";
import { useSelector } from "react-redux";
import { selectCurrentFold } from "../../gameSlice";

export default () => {
  const fold: number[][] | null = useSelector(selectCurrentFold);
  return (
    <StyledFold>
      {fold && (
        <ul>
          {fold.map((cardsTuple: number[], i: number) => (
            <li key={i}>
              {cardsTuple.map((cardIndex, j) => (
                <Card
                  key={j}
                  cardIndex={cardIndex}
                  selected={false}
                  handleClick={() => {}}
                />
              ))}
            </li>
          ))}
        </ul>
      )}
      {!fold && <>No fold currently</>}
    </StyledFold>
  );
};
