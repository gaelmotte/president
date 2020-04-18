import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  min-height: 0;
  flex: 1;

  h3 {
    position: absolute;
    top: 20%;
    left: 20%;
    transform: rotate(-45deg);
    color: RED;
    border: solid red 3px;
    padding: 5px;
    font-size: 6em;
  }
`;
