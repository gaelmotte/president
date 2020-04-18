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
`;
