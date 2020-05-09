import styled from "styled-components";

export default styled.div<{ cardColor1: string; cardColor2: string }>`
  width: 15vmin;
  width: 15vmin;
  height: 23vmin;
  background-color: ${(props) => props.cardColor2};
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
    background-image: linear-gradient(
      -45deg,
      ${(props) => props.cardColor2},
      ${(props) => props.cardColor1},
      ${(props) => props.cardColor2}
    );
    background-color: ${(props) => props.cardColor2};
  }

  &.♣️,
  &.♠️ {
    background-image: linear-gradient(
      -45deg,
      ${(props) => props.cardColor1},
      ${(props) => props.cardColor2},
      ${(props) => props.cardColor1}
    );
    background-color: ${(props) => props.cardColor2};
  }

  &.♥️::after,
  &.♥️::before,
  &.♦️::after,
  &.♦️::before {
    filter: drop-shadow(0 0 1vmin ${(props) => props.cardColor2});
    background: ${(props) => props.cardColor1};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  &.♣️::after,
  &.♣️::before,
  &.♠️::after,
  &.♠️::before {
    filter: drop-shadow(0 0 1vmin ${(props) => props.cardColor1});
    background: ${(props) => props.cardColor2};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &::before {
    content: attr(data-figure) attr(data-color);
    font-size: 3vmin;
  }

  &::after {
    content: attr(data-figure) attr(data-color);
    font-size: 15vmin;
  }
`;
