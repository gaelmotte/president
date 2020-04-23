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
    margin-left: -50px;
    margin-top: -50px;
    transform: rotate(-45deg);
    color: RED;
    border: solid red 0.2vmin;
    padding: 0.5vmin;
    font-size: 6vmin;
  }
`;
