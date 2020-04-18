import styled from "styled-components";

export default styled.div`
  flex: 1;
  flex-shrink: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  .moves {
    min-height: 0;
    flex-shrink: 1;
    overflow-y: scroll;
  }
  h3 {
    position: absolute;
    top: 35%;
    left: 35%;
    transform: rotate(-45deg);
    color: RED;
    border: solid red 3px;
    padding: 5px;
    font-size: 6em;
  }
`;
