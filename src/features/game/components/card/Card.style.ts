import styled from "styled-components";

export default styled.div`
  width: 15vmin;
  width: 15vmin;
  height: 23vmin;
  background-color: black;
  border-radius: 1vmin;
  text-align: left;

  padding: 0.5vmin;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  overflow: hidden;
  box-shadow: inset 0 0 1vmin white;

  &.selected {
    transform: translateY(-10%);
  }

  &.♥️,
  &.♦️ {
    background-image: linear-gradient(-45deg, black, gold, black);
    background-color: black;
  }

  &.♣️,
  &.♠️ {
    background-image: linear-gradient(-45deg, gold, black, gold);
    background-color: black;
  }

  &.♥️::after,
  &.♥️::before,
  &.♦️::after,
  &.♦️::before {
    color: gold;
    filter: drop-shadow(0 0 1vmin black);
  }
  &.♣️::after,
  &.♣️::before,
  &.♠️::after,
  &.♠️::before {
    color: black;
    filter: drop-shadow(0 0 1vmin gold);
  }

  &::before {
    content: attr(data-figure) attr(data-color);
    font-size: 3vmin;
  }

  &::after {
    content: attr(data-figure) attr(data-color);
    font-size: 15vmin;
    color: white;
    filter: drop-shadow(0 0 1vmin white);
  }
`;
