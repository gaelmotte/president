import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  min-height: 0;
  flex: 1;

  h3 {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%) rotate(-45deg);
    color: RED;
    border: solid red 0.2rem;
    padding: 0.5rem;
    font-size: 6rem;

    z-index: 100;
  }

  .gameTable {
    flex: 1;
    flex-shrink: 1;
    min-height: 0;

    justify-content: center;
    display: flex;
    flex-direction: column;

    .adversaries {
      position: relative;
      width: 100vw;
      height: 1px;
    }
  }
`;
