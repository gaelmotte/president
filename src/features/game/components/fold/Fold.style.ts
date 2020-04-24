import styled from "styled-components";

export default styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .moves {
    min-height: 0;
    flex-shrink: 1;
    overflow-y: scroll;
  }
  h3 {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%) rotate(-45deg);
    color: RED;
    border: solid red 0.2vmin;
    padding: 0.5vmin;
    font-size: 6vmin;
  }

  .glows {
    background-color: black;
    filter: drop-shadow(0 0 1vmin gold);
    border-radius: 1vmin;
    font-size: 3vmin;
    margin: 1vmin;
  }
`;
