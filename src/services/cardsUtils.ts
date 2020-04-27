// defines card general utils

//cards are from 0 to 51, Hearts, Spades, diamonds, clubs
// because the game orders cards as 3?4?5?6?7?8?9,10,J,Q,K,2, they are ordered that way

export const dealCards = (
  playerIds: string[],
  startingPlayer: string
): { [playerId: string]: number[] } => {
  const deck: number[] = [...Array(52).keys()];
  deck.sort(() => Math.random() - 0.5);

  const hands: { [playerId: string]: number[] } = {};
  playerIds.forEach((playerId) => {
    hands[playerId] = [];
  });

  while (playerIds[0] !== startingPlayer) {
    const [first, ...rest] = playerIds;
    playerIds = [...rest, first];
  }

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

export const isAllSameFigure = (cards: number[]) =>
  new Set(cards.map((card) => getFigure(card))).size <= 1;

export const isMoveAllowed = (
  fold: Fold | null,
  cards: number[],
  isRevolution: boolean
) => {
  const allSameFigure = isAllSameFigure(cards);

  if (!fold) {
    // validating only that the cards are in right numbers and have same values
    return cards.length > 0 && cards.length < 5 && allSameFigure;
  } else {
    // validating based on previous events in the fold.
    if (
      !allSameFigure ||
      (cards.length !== fold.cardsPerPlay && cards.length !== 0)
    )
      return false;

    if (
      fold.moves.filter((move) => move.cards.length !== 0).length >= 2 &&
      new Set(
        fold.moves
          .filter((move) => move.cards.length !== 0)
          .slice(-2)
          .map((move) => getFigure(move.cards[0]))
      ).size === 1 &&
      fold.moves.slice(-1)[0].cards.length !== 0
    ) {
      return (
        cards.length === 0 ||
        (cards.length === fold.cardsPerPlay &&
          getFigure(cards[0]) ===
            getFigure(
              fold.moves.filter((move) => move.cards.length !== 0).slice(-1)[0]
                .cards[0]
            ))
      );
    }

    return (
      cards.length === fold.cardsPerPlay &&
      (fold.moves.slice(-1)[0].cards.length === 0 ||
        (cards[0] % 13 >= fold.moves.slice(-1)[0].cards[0] % 13 &&
          !isRevolution) ||
        (cards[0] % 13 <= fold.moves.slice(-1)[0].cards[0] % 13 &&
          isRevolution))
    );
  }
};

export type Move = {
  playerId: string;
  cards: number[];
};

export type Fold = {
  moves: Move[];
  cardsPerPlay: number;
  passedPlayers: string[];
  closed: boolean;
  foldWinner: string | null;
};
