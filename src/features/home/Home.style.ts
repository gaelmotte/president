import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .content {
    display: inline-block;
    margin: 0 auto;

    background-color: black;
    filter: drop-shadow(0 0 1vmin gold);
    border-radius: 1vmin;

    button {
      margin: 1vmin;

      background-color: black;
      border: none;
      color: white;

      text-align: center;

      text-decoration: none;

      box-shadow: inset 0.15vmin 0.15vmin 1vmin gold;
      border-radius: 0.5vmin;
      font-size: 3vmin;

      cursor: pointer;
    }
  }
`;
