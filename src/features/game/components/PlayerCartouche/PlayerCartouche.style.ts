import styled from "styled-components";

export default styled.div<{
  playerId: string;
  playerIndex?: number;
  playerNumber?: number;
  isSelf?: boolean;
}>`
  position: absolute;

  &.isPlaying {
    color: red;
  }

  filter: drop-shadow(0 0 1vmin goldenrod);

  ${(props) => {
    if (props.isSelf) {
      return `top:2vmin;
      left:1vmin;`;
    } else {
      return `top:0;
      transform: translate(-50%, 0);`;
    }
  }}

  ${(props) => {
    if (props.playerIndex !== undefined)
      switch (props.playerNumber) {
        case 1:
          return `
        left:50%;
        
        `;
        case 2:
          return `
        left:${(props.playerIndex + 1) * 33}%;
        
        `;
        case 3:
          return `
        left:${(props.playerIndex + 1) * 25}%;
        
        `;
        case 4:
          return `
        left:${(props.playerIndex + 1) * 20}%;
        
        `;
        case 5:
          return `
        left:${(props.playerIndex + 1) * 17}%;
        
        `;
      }
  }}

  @media (max-aspect-ratio: 3/2) {
    top: ${(props) =>
      props.playerIndex && !props.isSelf ? props.playerIndex * 3 : 0}vmin;
  }

  .avatar {
    width: 8vmin;
    height: 8vmin;
    top: 0;

    line-height: 8vmin;

    background-color: black;

    border-radius: 50%;
    font-size: 6vmin;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: absolute;

    z-index: 3;
  }

  .handsize {
    position: absolute;
    position: absolute;
    top: 7.2vmin;
    left: 2.5vmin;
    z-index: 4;
    background-color: black;
    font-size: 2vmin;
    border-radius: 50%;
    width: 3vmin;
    height: 3vmin;
    line-height: 3vmin;
    box-shadow: inset 0 0 0.5vmin goldenrod;
  }

  .details {
    font-size: 2vmin;
    padding-right: 2.5vmin;

    background-color: black;

    border-radius: 10vmin;

    padding-left: 5vmin;
    position: relative;
    top: 0;
    margin-left: 3.5vmin;
    display: inline-block;
    white-space: nowrap;
  }
`;
