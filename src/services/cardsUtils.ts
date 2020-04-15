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
