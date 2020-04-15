import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectPlayerHand } from "../../gameSlice";

const colors = ["♥️", "♠️", "♦️", "♣️"];
const figures = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
  "2",
];

export const compareValues = (a: number, b: number) => {
  const valA = a % 13;
  const valB = b % 13;
  return valA === valB ? 0 : valA < valB ? -1 : 1;
};

export default ({ cardIndex }: { cardIndex: number }) => {
  const color = Math.floor(cardIndex / 13);
  const value = cardIndex % 13;
  return (
    <div>
      {figures[value]}
      {colors[color]}
    </div>
  );
};
