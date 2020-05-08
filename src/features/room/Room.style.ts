import styled from "styled-components";

export default styled.div<{ valid: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  justify-content: space-evenly;

  header {
    margin-bottom: 1rem;
    background-color: black;
    filter: drop-shadow(0 0 1vmin ${(props) => (props.valid ? "gold" : "red")});
    border-radius: 2vmin;
    padding: 1vmin;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;

    input {
      text-decoration: none;
      background-color: black;
      border: 0;
      font-size: 2vmin;
      color: white;
    }

    input[type="submit"] {
      box-shadow: inset 0 0 1vmin ${(props) => (props.valid ? "gold" : "red")};
      border-radius: 1vmin;
    }
  }
`;
