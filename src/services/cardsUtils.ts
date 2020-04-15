// defines card general utils

//cards are from 0 to 51, Hearts, Spades, diamonds, clubs
// because the game orders cards as 3?4?5?6?7?8?9,10,J,Q,K,2, they are ordered that way

export const dealCards = (
  playerIds: string[]
): { [playerId: string]: number[] } => {
  const deck: number[] = [...Array(52).keys()];
  deck.sort(() => Math.random() - 0.5);

  const hands: { [playerId: string]: number[] } = {};
  playerIds.forEach((playerId) => {
    hands[playerId] = [];
  });

  for (let i = 0; i < 52; i++) {
    hands[playerIds[i % playerIds.length]].push(deck[i]);
  }

  return hands;
};

const colors = ["♥️", "♠️", "♦️", "♣️"];
const figures = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
  "2",
];

export const compareValues = (a: number, b: number) => {
  const valA = a % 13;
  const valB = b % 13;
  return valA === valB ? 0 : valA < valB ? -1 : 1;
};

export const getColor = (cardIndex: number) =>
  colors[Math.floor(cardIndex / 13)];
export const getFigure = (cardIndex: number) => figures[cardIndex % 13];
