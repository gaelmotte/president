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
  .closed {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 1vmin;

    transform: translate(-50%, -50%);

    padding: 0.5vmin;
    font-size: 3vmin;
    z-index: 100;
    box-shadow: inset 0 0 1vmin gold;
    filter: drop-shadow(0 0 1vmin black);
    background-color: black;
    border-radius: 1vmin;
  }

  .glows {
    background-color: black;
    filter: drop-shadow(0 0 1vmin gold);
    border-radius: 1vmin;
    font-size: 3vmin;
    margin: 1vmin;
  }
`;
