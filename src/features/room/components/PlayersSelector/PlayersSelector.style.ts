import styled from "styled-components";

export default styled.div`
  display: inline-block;
  margin: 0 auto;

  background-color: black;
  filter: drop-shadow(0 0 1vmin gold);
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
`;
