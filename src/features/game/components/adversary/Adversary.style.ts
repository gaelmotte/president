import styled from "styled-components";

export default styled.div`
  width: 90px;
  height: 90px;
  border: solid 1px black;
  border-radius: 10px;

  &.isPlaying {
    color: red;
  }
`;
