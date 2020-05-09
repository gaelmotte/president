import styled from "styled-components";

export default styled.div`
  height: 100%;
  width: 70vmin;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .exchanges {
    margin-top: 1.5vmin;
    display: flex;
    flex-direction: row;

    & > div {
      flex: 1;
    }

    .cards {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }

  .glows {
    background-color: black;
    filter: drop-shadow(0 0 1vmin goldenrod);
    border-radius: 1vmin;
    font-size: 3vmin;
    margin: 1vmin;
  }
`;
