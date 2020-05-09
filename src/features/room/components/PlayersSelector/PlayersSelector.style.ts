import styled from "styled-components";

export default styled.div`
  display: inline-block;
  margin: 0 auto;

  background-color: black;
  filter: drop-shadow(0 0 1vmin goldenrod);
  border-radius: 2vmin;
  padding: 1vmin;

  .wrap {
    display: flex;
    flex-direction: column;

    div {
      display: inline-block;
    }
    ul {
      list-style-type: none;
      display: inline-block;
      margin: 0 auto;
      padding-inline-start: 0;

      li {
        font-size: 2vmin;
        text-align: left;

        input[type="checkbox"] {
          display: none;
        }
        input[type="checkbox"] + label:before {
          content: "☐";
        }
        input:checked + label:before {
          content: "☑";
        }
      }
    }
  }
  button {
    text-decoration: none;
    background-color: black;
    border: 0;
    font-size: 2vmin;
    color: white;
    box-shadow: inset 0 0 1vmin goldenrod;
    border-radius: 1vmin;
  }
  button:disabled {
    box-shadow: inset 0 0 1vmin red;
  }
`;
