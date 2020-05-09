import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  table {
    background-color: black;
    filter: drop-shadow(0 0 1vmin goldenrod);
    margin-bottom: 2vmin;
    border-radius: 1vmin;
    font-size: 1.5vmin;

    tfoot,
    thead {
      font-weight: bold;
    }
  }
`;
