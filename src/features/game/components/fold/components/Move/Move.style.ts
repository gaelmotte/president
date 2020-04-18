import styled from "styled-components";

export default styled.div`
  overflow: hidden;
  max-height: 30px;

  :last-of-type {
    overflow: visible;
    max-height: unset;
  }

  section {
    flex: 1;
    flex-direction: row;
    display: flex;
    justify-content: center;
  }
`;
