import styled from "styled-components";

export default styled.div`
  overflow: hidden;
  border-radius: 0.5vmin 0 0 0.5vmin;
  margin-right: -0.5vmin;

  :hover {
    overflow: visible;
    margin-right: 0px;
  }

  :last-of-type {
    overflow: visible;
    margin-right: 0px;
  }

  div {
    width: 15vmin;
    width: 15vmin;
    height: 23vmin;
    border: solid 1px black;
    background-color: #ccc;
    border-radius: 1vmin;
    text-align: left;
    font-size: 3vmin;
    padding-left: 0.5vmin;
  }
  .♥️ {
    color: red;
  }
  .♦️ {
    color: red;
  }
  .♠️ {
    color: black;
  }
  .♣️ {
    color: black;
  }
  .selected {
    transform: translateY(-10%);
  }
`;
