import styled from "styled-components";

export default styled.div`
  overflow: hidden;
  max-height: 30px;
  padding-left: 10%;
  padding-right: 10%;

  :last-of-type {
    overflow: visible;
    max-height: unset;
  }

  div {
    display: flex;
    flex-direction: row;

    header {
      flex: 1;
    }
    section {
      flex: 1;
      flex-direction: row;
      display: flex;
    }
  }
`;
