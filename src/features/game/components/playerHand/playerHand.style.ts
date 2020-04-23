import styled from "styled-components";

export default styled.div`
  position: relative;

  .playerInfo {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .buttons {
    height: 5vmin;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

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
