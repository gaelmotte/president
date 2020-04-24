import styled from "styled-components";

export default styled.div`
  overflow: hidden;
  max-height: 3vmin;

  filter: drop-shadow(0 0 1vmin gold);

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
