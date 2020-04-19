import styled from "styled-components";

export default styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .exchanges {
    margin-top: 20px;
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
`;
