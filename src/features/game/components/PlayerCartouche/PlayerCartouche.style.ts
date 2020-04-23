import styled from "styled-components";

export default styled.div<{
  playerId: string;
  playerIndex?: number;
  playerNumber?: number;
}>`
  position: absolute;

  border-radius: 10vmin;

  &.isPlaying {
    color: red;
  }

  display: flex;
  flex-direction: row;

  box-shadow: inset 0 0 0.5vmin gold;
  box-shadow: 0 0 1vmin gold;

  ${(props) => {
    if (props.playerIndex)
      switch (props.playerNumber) {
        case 1:
          return `top:1vmin;
        left:50%;
        
        `;
        case 2:
          return `top:1vmin;
        left:${props.playerIndex * 50}px;
        
        `;
        case 3:
          return `top:1vmin;
        left:${props.playerIndex * 50}px;
        
        `;
        case 4:
          return `top:1vmin;
        left:${props.playerIndex * 50}px;
        
        `;
        case 5:
          return `top:1vmin;
        left:${props.playerIndex * 50}px;
        
        `;
      }
  }}

  .avatar {
    background-color: black;
    width: 6vmin;
    height: 6vmin;

    border-radius: 50%;
    font-size: 4.5vmin;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;

    .handsize {
      font-size: 2vmin;
      margin-top: -25%;
      background-color: black;
    }
  }

  .details {
    font-size: 2vmin;
    padding-right: 2vmin;

    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 5vmin;
  }
`;
