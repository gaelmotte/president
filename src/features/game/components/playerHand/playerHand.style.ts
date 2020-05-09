import styled from "styled-components";

export default styled.div<{
  isMobile: boolean;
  isPlayerTurn: boolean;
  isViewingFold: boolean;
}>`
  position: relative;
  ${(props) =>
    !props.isMobile
      ? `width: 100vmin;
  align-self: center;`
      : ""}

  .playerInfo {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    filter: drop-shadow(0 0 1vmin goldenrod);
    border-radius: 1vmin;

    ${(props) => {
      if (!props.isMobile) {
        return `
          font-size: 3vmin;
          flex-direction: row;
          position: absolute;
          top: -10vmin;
          left: 50%;
          transform: translate(-50%, 0);
          &::after {
            content: " ";
            position: absolute;
            background-color: black;
            width: 2vmin;
            height: 2vmin;
            transform: rotate(45deg);
            bottom: -12%;
            z-index: -1;
          }`;
      } else {
        return ` 
          font-size: 4vmin;
          top: 50vmin;
          position:fixed;
          right:3vmin;
          transform: translate(0,-50%);
          flex-direction: column;

  
         `;
      }
    }}

    background-color: black;

    button {
      margin: ${(props) => (props.isMobile ? "5vmin" : "1vmin")};

      background-color: black;
      border: none;
      color: white;

      text-align: center;

      text-decoration: none;

      box-shadow: inset 0.15vmin 0.15vmin 1vmin goldenrod;
      border-radius: 0.5vmin;

      cursor: pointer;

      :disabled {
        box-shadow: inset 0.15vmin 0.15vmin 1vmin red;
      }
    }
  }
  .cards {
    position: relative;
    height: 23vmin;
    filter: drop-shadow(0 0 1vmin goldenrod);
    opacity: ${(props) => (props.isViewingFold ? 0 : 1)};

    transform: ${(props) =>
      props.isMobile && props.isPlayerTurn
        ? "scale(2) translate(0px, -25%)"
        : ""};
  }
`;

export const StyledSlotInHand = styled.div<{
  slotIndex: number;
  slotNumber: number;
}>`
  transform-origin: 0 200%;
  position: absolute;
  left: 50%;
  z-index: ${(props) => props.slotIndex};
  transform: rotate(
      ${(props) => {
        const anglePerCard = Math.min(100 / props.slotNumber, 15);
        return (
          (100 - anglePerCard * props.slotNumber) / 2 -
          50 +
          +anglePerCard / 2 +
          props.slotIndex * anglePerCard
        );
      }}deg
    )
    translate(-7.5vmin, 0);
`;
