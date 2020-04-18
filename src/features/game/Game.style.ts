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

  .gameTable {
    flex: 1;
    flex-shrink: 1;
    min-height: 0;
    padding: 100px 70px 0px 70px;
    position: relative;

    .adversaries {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      &.playersNA {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }

      &.players4 {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }

      &.players5 {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }

      &.players6 {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }
    }
  }
`;
