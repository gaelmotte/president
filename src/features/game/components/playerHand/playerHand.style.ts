import styled from "styled-components";

export default styled.div`
  position: relative;

  .playerInfo {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: -10vmin;
    left: 50%;
    transform: translate(-50%, 0);

    background-color: black;
    filter: drop-shadow(0 0 1vmin gold);
    border-radius: 1vmin;
    font-size: 3vmin;
    margin: 1vmin;

    &::after {
      content: " ";
      position: absolute;
      background-color: black;
      width: 2vmin;
      height: 2vmin;
      transform: rotate(45deg);
      bottom: -12%;
      z-index: -1;
    }

    button {
      height: 3vmin;
      margin: 1vmin;
    }
  }
  .cards {
    position: relative;
    height: 23vmin;
    filter: drop-shadow(0 0 1vmin gold);
  }
`;

export const StyledSlotInHand = styled.div<{
  slotIndex: number;
  slotNumber: number;
}>`
  transform-origin: 25% 200%;
  position: absolute;
  left: 50%;
  margin-left: -50px;
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
  );
`;
