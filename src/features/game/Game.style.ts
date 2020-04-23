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
    border: solid red 0.2rem;
    padding: 0.5rem;
    font-size: 6rem;
  }

  .gameTable {
    flex: 1;
    flex-shrink: 1;
    min-height: 0;
    padding: 10rem 7rem 0rem 7rem;
    position: relative;
  }
`;
