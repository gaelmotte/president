import styled from "styled-components";

export default styled.div`
  overflow: hidden;
  border-radius: 5px 0 0 5px;
  margin-right: -5px;

  :hover {
    overflow: visible;
    margin-right: 0px;
  }

  :last-child {
    overflow: visible;
    margin-right: 0px;
  }

  div {
    width: 60px;
    height: 90px;
    border: solid 1px black;
    background-color: #ccc;
    border-radius: 5px;
    text-align: left;
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
`;
