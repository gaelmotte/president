import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as PusherTypes from "pusher-js";
import { cloneDeep } from "lodash";

import { AppThunk, RootState } from "../../app/store";

import {
  dealCards,
  Fold,
  Move,
  isAllSameFigure,
  getFigure,
} from "../../services/cardsUtils";

import { setPastGame, selectCurrentGameId } from "../room/roomSlice";

export type CardExchangeOrder = {
  from: string;
  to: string;
  number: number;
  type: "best" | "any";
  cards: number[];
};

interface GameState {
  gameId: string | null;
  status: "starting" | "running" | "finished" | undefined;
  playersHands: { [playerId: string]: number[] };
  currentPlayer: string | null;
  currentFold: Fold | null;
  finishedPlayers: string[] | null;
  playerIds: string[] | null;
  disqualifiedPlayers: string[] | null;
  isRevolution: boolean;
  cardExchangeOrders: CardExchangeOrder[] | null;
}
const initialState: GameState = {
  gameId: null,
  status: undefined,
  playersHands: {},
  currentPlayer: null,
  currentFold: null,
  finishedPlayers: null,
  playerIds: null,
  disqualifiedPlayers: null,
  isRevolution: false,
  cardExchangeOrders: null,
};

let getChannel: () => PusherTypes.PresenceChannel | null = () => null;
let setChannel: (
  channel: PusherTypes.PresenceChannel | null
) => void = () => {};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setStatus: (
      state,
      action: PayloadAction<"starting" | "running" | "finished" | undefined>
    ) => {
      state.status = action.payload;
      if (action.payload === "starting") {
        state.finishedPlayers = [];
        state.disqualifiedPlayers = [];
      }
    },
    setPlayerIds: (state, action: PayloadAction<string[]>) => {
      state.playerIds = action.payload;
    },
    setPlayersHands: (
      state,
      action: PayloadAction<{ [playerId: string]: number[] }>
    ) => {
      state.playersHands = action.payload;
    },
    setCurrentPlayer: (state, action: PayloadAction<string>) => {
      state.currentPlayer = action.payload;
    },
    setNewFold: (state, action: PayloadAction<number[]>) => {
      state.currentFold = {
        moves: [],
        passedPlayers: [],
        cardsPerPlay: action.payload.length,
        closed: false,
        foldWinner: null,
      };
    },
    setFoldClosed: (state, action: PayloadAction<string>) => {
      if (state.currentFold) {
        state.currentFold.closed = true;
        state.currentFold.foldWinner = action.payload;
      }
    },
    setEndFold: (state) => {
      state.currentFold = null;
    },
    setPlayedMove: (state, action: PayloadAction<Move>) => {
      const {
        payload: { playerId, cards },
      } = action;
      state.playersHands[playerId] = state.playersHands[playerId].filter(
        (card) => !cards.includes(card)
      );
      if (state.playersHands[playerId].length === 0) {
        state.finishedPlayers?.push(playerId);
      }
      if (state.currentFold) {
        state.currentFold.moves.push(action.payload);
      }
    },
    setDisqualifiedPlayer: (state, action: PayloadAction<string>) => {
      state.disqualifiedPlayers?.push(action.payload);
    },
    setPlayerPassed: (state, action: PayloadAction<string>) => {
      state.currentFold?.passedPlayers.push(action.payload);
    },
    setPlayersPassed: (state, action: PayloadAction<string[]>) => {
      if (state.currentFold) state.currentFold.passedPlayers = action.payload;
    },
    setToggleRevolution: (state) => {
      state.isRevolution = !state.isRevolution;
    },
    setCardExchangeOrders: (
      state,
      action: PayloadAction<CardExchangeOrder[]>
    ) => {
      state.cardExchangeOrders = action.payload;
    },
    setUpdateCardExchangeOrder: (
      state,
      action: PayloadAction<CardExchangeOrder>
    ) => {
      if (!state.cardExchangeOrders)
        throw new Error("cannot update order if there aren't any");

      const orderIndex = state.cardExchangeOrders.findIndex(
        (order) => order.from === action.payload.from
      );
      if (orderIndex !== -1) {
        state.cardExchangeOrders[orderIndex].cards = action.payload.cards;
      }
    },
  },
});

export const {
  setStatus,
  setPlayerIds,
  setPlayersHands,
  setCurrentPlayer,
  setNewFold,
  setFoldClosed,
  setEndFold,
  setPlayedMove,
  setPlayerPassed,
  setPlayersPassed,
  reset,
  setDisqualifiedPlayer,
  setToggleRevolution,
  setCardExchangeOrders,
  setUpdateCardExchangeOrder,
} = gameSlice.actions;

export const initializeGame = (
  isHost: boolean,
  playerIds: string[]
): AppThunk => (dispatch, getState) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  dispatch(setStatus("starting"));

  dispatch(setPlayerIds(playerIds));
  const startingPlayer = selectComputeStartingPlayer(playerIds)(getState());

  // ask server to deal cards if Host
  if (isHost) {
    const hands = dealCards(playerIds, startingPlayer);
    const cardEchangeOrders = selectComputedCardExchangeOrdersFromPreviousGame(
      playerIds
    )(getState());
    const pusherId = selectPusherId(getState());
    if (pusherId) {
      setTimeout(() => {
        channel.trigger("client-game-cards-dealt", hands);
        dispatch(setPlayersHands(hands));
        dispatch(setCurrentPlayer(startingPlayer));
        if (cardEchangeOrders) {
          channel.trigger(
            "client-game-cards-to-be-exchanged",
            cardEchangeOrders
          );
          dispatch(setCardExchangeOrders(cardEchangeOrders));
        } else {
          channel.trigger("client-game-started", hands);
          dispatch(setStatus("running"));
        }
      }, 1000);
    }
  } else {
    // set up event sto watch
    channel.bind(
      "client-game-cards-dealt",
      (
        data: { [playerId: string]: number[] },
        metadata: { user_id: string }
      ) => {
        dispatch(setPlayersHands(data));
        dispatch(setCurrentPlayer(startingPlayer));
      }
    );

    channel.bind(
      "client-game-cards-to-be-exchanged",
      (data: CardExchangeOrder[], metadata: { user_id: string }) => {
        dispatch(setCardExchangeOrders(data));
      }
    );

    channel.bind(
      "client-game-started",
      (
        data: { [playerId: string]: number[] },
        metadata: { user_id: string }
      ) => {
        dispatch(setPlayersHands(data));
        dispatch(setStatus("running"));
      }
    );
  }

  channel.bind(
    "client-game-cards-exchanged",
    (data: CardExchangeOrder, metadata: { user_id: string }) => {
      const orders = selectCardExchangeOrders(getState());

      if (orders) {
        const orderIndex = orders.findIndex(
          (order) => order.from === metadata.user_id
        );

        if (orderIndex !== -1) {
          const order = orders[orderIndex];
          const updatedOrder: CardExchangeOrder = {
            from: order.from,
            to: order.to,
            number: order.number,
            type: order.type,
            cards: data.cards,
          };

          dispatch(setUpdateCardExchangeOrder(updatedOrder));
        }
      }
    }
  );

  // set up event sto watch
  channel.bind(
    "client-game-cards-played",
    (data: any, metadata: { user_id: string }) => {
      dispatch(setPlayedMove({ playerId: metadata.user_id, cards: data }));
      dispatch(checkClosedFold());
      if (data.length === 4) dispatch(setToggleRevolution());

      dispatch(setCurrentPlayer(selectNextPlayer(getState())));
    }
  );

  channel.bind(
    "client-game-player-passed",
    (data: any, metadata: { user_id: string }) => {
      dispatch(setPlayerPassed(metadata.user_id));
      dispatch(checkClosedFold());

      dispatch(setCurrentPlayer(selectNextPlayer(getState())));
    }
  );

  channel.bind(
    "client-game-fold-started",
    (data: number[], metadata: { user_id: string }) => {
      dispatch(setNewFold(data));

      const currentPlayer = selectCurrentPlayer(getState());
      if (!currentPlayer) throw "No current PLayer";

      if (data.length === 4) dispatch(setToggleRevolution());
      dispatch(setPlayedMove({ playerId: currentPlayer, cards: data }));
      dispatch(checkClosedFold());

      dispatch(setCurrentPlayer(selectNextPlayer(getState())));
    }
  );
};

export const startGame = (): AppThunk => (dispatch, getState) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  // if orders are ready, merge orders and players hands,
  const hands = getState().game.playersHands;
  const orders = getState().game.cardExchangeOrders;

  if (!orders || orders.some((order) => order.cards.length !== order.number))
    throw new Error("Cannot Start Game if orders are not set");

  const mutableHands = cloneDeep(hands);
  orders.forEach((order) => {
    // find impacted hands and modify them.
    mutableHands[order.from] = mutableHands[order.from].filter(
      (cardId) => !order.cards.includes(cardId)
    );
    mutableHands[order.to].push(...order.cards);
  });

  channel.trigger("client-game-started", mutableHands);
  dispatch(setPlayersHands(mutableHands));
  dispatch(setStatus("running"));
};

export const playCards = (cards: number[]): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  channel.trigger("client-game-cards-played", cards);

  const currentPlayer = selectCurrentPlayer(getState());
  if (!currentPlayer) throw "No current PLayer";

  if (cards.length === 4) dispatch(setToggleRevolution());
  dispatch(setPlayedMove({ playerId: currentPlayer, cards }));
  dispatch(checkClosedFold());

  dispatch(setCurrentPlayer(selectNextPlayer(getState())));
};

export const giveCards = (cards: number[]): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  const orders = selectCardExchangeOrders(getState());
  const playerId = selectPusherId(getState());
  if (orders) {
    const orderIndex = orders.findIndex((order) => order.from === playerId);
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      const updatedOrder: CardExchangeOrder = {
        from: order.from,
        to: order.to,
        number: order.number,
        type: order.type,
        cards: cards,
      };
      channel.trigger("client-game-cards-exchanged", updatedOrder);

      dispatch(setUpdateCardExchangeOrder(updatedOrder));
    }
  }
};

export const pass = (): AppThunk => (dispatch, getState) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  channel.trigger("client-game-player-passed", {});

  const currentPlayer = selectCurrentPlayer(getState());
  if (!currentPlayer) throw "No current PLayer";

  dispatch(setPlayerPassed(currentPlayer));
  dispatch(checkClosedFold());

  dispatch(setCurrentPlayer(selectNextPlayer(getState())));
};

export const startNewFold = (cards: number[]): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  channel.trigger("client-game-fold-started", cards);

  dispatch(setNewFold(cards));

  const currentPlayer = selectCurrentPlayer(getState());
  if (!currentPlayer) throw "No current PLayer";

  if (cards.length === 4) dispatch(setToggleRevolution());
  dispatch(setPlayedMove({ playerId: currentPlayer, cards }));

  dispatch(checkClosedFold());

  dispatch(setCurrentPlayer(selectNextPlayer(getState())));
};

export const archiveCurrentGame = (): AppThunk => (dispatch, getState) => {
  const currentGame = selectCurrentGameId(getState());
  const playerIds = selectPlayerIds(getState());
  const finishedPlayers = selectFinishedPlayers(getState());
  const disqualifiedPlayers = selectDisqualifiedPlauers(getState());

  if (!currentGame || !playerIds || !finishedPlayers || !disqualifiedPlayers)
    throw new Error("how did we get there ?");

  const lastPlayerNotFinished = playerIds.find(
    (player) => !finishedPlayers.includes(player)
  );
  if (!lastPlayerNotFinished) throw new Error("how did we get there ?");

  const finishedNotDisqualified = finishedPlayers.filter(
    (player) => !disqualifiedPlayers.includes(player)
  );
  const finishOrder = [
    ...finishedNotDisqualified,
    lastPlayerNotFinished,
    ...disqualifiedPlayers.slice().reverse(),
  ];

  if (playerIds.length !== finishOrder.length)
    throw new Error("WE FORGOT TO FLAG SOMEONE AS FINISHED");

  dispatch(setPastGame({ id: currentGame, playerIds, finishOrder }));

  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");
  [
    "client-game-cards-dealt",
    "client-game-cards-to-be-exchanged",
    "client-game-started",
    "client-game-cards-exchanged",
    "client-game-cards-played",
    "client-game-player-passed",
    "client-game-fold-started",
  ].map((message) => channel.unbind(message));
};

export const checkClosedFold = (): AppThunk => (dispatch, getState) => {
  const fold = selectCurrentFold(getState());
  const currentPlayer = selectCurrentPlayer(getState());
  const isRevolution = selectIsRevolution(getState());

  if (fold && currentPlayer) {
    const playerIds = selectPlayerIds(getState());
    if (!playerIds) return false;

    if (
      fold.moves.length !== 0 &&
      ((!isRevolution && fold.moves.slice(-1)[0].cards[0] % 13 === 12) ||
        (isRevolution && fold.moves.slice(-1)[0].cards[0] % 13 === 0))
    ) {
      dispatch(
        setFoldClosed(
          fold.moves.filter((move) => move.cards.length > 0).slice(-1)[0]
            .playerId
        )
      );
      const handsize = selectAdversaryHandSize(
        fold.moves.slice(-1)[0].playerId
      )(getState());

      if (handsize !== undefined && handsize === 0) {
        dispatch(setDisqualifiedPlayer(fold.moves.slice(-1)[0].playerId));
      }
    } // Closed if all those that have cards left in their hands have passed.
    else if (
      !playerIds.some((playerId) => {
        const handSize = selectAdversaryHandSize(playerId)(getState());
        return (
          handSize && handSize > 0 && !fold.passedPlayers.includes(playerId)
        );
      })
    ) {
      dispatch(
        setFoldClosed(
          fold.moves.filter((move) => move.cards.length > 0).slice(-1)[0]
            .playerId
        )
      );
    } else {
      const playedCardsInFold = fold.moves.map((move) => move.cards).flat();
      if (
        playedCardsInFold.length >= 4 &&
        isAllSameFigure(playedCardsInFold.slice(-4))
      ) {
        dispatch(
          setFoldClosed(
            fold.moves.filter((move) => move.cards.length > 0).slice(-1)[0]
              .playerId
          )
        );
      }
    }
  }
};

export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;
export const selectPlayerIds = (state: RootState) => state.game.playerIds;

export const selectPlayerHand = (state: RootState) =>
  state.room.pusherId ? state.game.playersHands[state.room.pusherId] : null;

export const selectIsPlayerTurn = (state: RootState) =>
  state.game.currentPlayer === state.room.pusherId;
export const selectHasPlayerPassed = (state: RootState) =>
  state.room.pusherId &&
  state.game.currentFold?.passedPlayers.includes(state.room.pusherId);

export const selectCurrentPlayer = (state: RootState) =>
  state.game.currentPlayer;

export const selectPusherId = (state: RootState) => state.room.pusherId;

export const selectNextPlayer = (state: RootState) => {
  if (
    !state.game.playerIds ||
    !state.game.currentPlayer ||
    !state.game.currentFold
  )
    throw new Error("No players or current player or current fold");

  if (state.game.currentFold.closed && state.game.currentFold.foldWinner) {
    const foldWinnerPlayerIndex = state.game.playerIds.indexOf(
      state.game.currentFold.foldWinner
    );

    for (let i = 0; i < state.game.playerIds.length; i++) {
      const consideredPlayerIndex =
        (foldWinnerPlayerIndex + i) % state.game.playerIds.length;
      const consideredPlayerId = state.game.playerIds[consideredPlayerIndex];

      if (state.game.playersHands[consideredPlayerId].length > 0) {
        // has still cards in hand
        return consideredPlayerId;
      }
    }
  } else {
    const currentPLayerIndex = state.game.playerIds.indexOf(
      state.game.currentPlayer
    );

    for (let i = 0; i < state.game.playerIds.length; i++) {
      const consideredPlayerIndex =
        (currentPLayerIndex + 1 + i) % state.game.playerIds.length;
      const consideredPlayerId = state.game.playerIds[consideredPlayerIndex];

      if (
        state.game.playersHands[consideredPlayerId].length > 0 &&
        !state.game.currentFold.passedPlayers.includes(consideredPlayerId)
      ) {
        // has still cards in hand and hasn't passed
        return consideredPlayerId;
      }
    }
  }

  throw new Error("Couldn't find a suitable next player");
};

export const selectAdversaries = (state: RootState) => {
  if (!state.game.playerIds || !state.room.pusherId) return undefined;
  const playerIndex = state.game.playerIds.indexOf(state.room.pusherId);
  if (playerIndex === -1) return state.game.playerIds;

  let adversaries: string[] = [];

  for (let i = 1; i < state.game.playerIds.length; i++) {
    const consideredPlayerIndex =
      (playerIndex + i) % state.game.playerIds.length;
    adversaries.push(state.game.playerIds[consideredPlayerIndex]);
  }

  return adversaries;
};

export const selectAdversaryHandSize = (playerId: string) => (
  state: RootState
) => {
  const hand = state.game.playersHands[playerId];
  if (hand) return hand.length;
  return undefined;
};

export const selectCurrentFold = (state: RootState) => state.game.currentFold;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};

export const selectIsFoldClosed = (state: RootState) =>
  state.game?.currentFold?.closed;

export const selectFinishedPlayers = (state: RootState) =>
  state.game?.finishedPlayers;

export const selectPassedPlayers = (state: RootState) =>
  state.game?.currentFold?.passedPlayers;

export const selectIsGameFinished = (state: RootState) =>
  state.game.playerIds &&
  state.game.finishedPlayers &&
  state.game.finishedPlayers?.length === state.game.playerIds?.length - 1;

export const selectDisqualifiedPlauers = (state: RootState) =>
  state.game.disqualifiedPlayers;

export const selectIsSameOrNothingPlay = (state: RootState) => {
  return (
    state.game.currentFold &&
    state.game.currentFold.moves.length >= 2 &&
    new Set(
      state.game.currentFold.moves
        .filter((move) => move.cards.length !== 0)
        .slice(-2)
        .map((move) => getFigure(move.cards[0]))
    ).size === 1 &&
    state.game.currentFold.moves.slice(-1)[0].cards.length !== 0 &&
    state.game.currentPlayer !==
      state.game.currentFold.moves.slice(-1)[0].playerId
  );
};

export const selectIsRevolution = (state: RootState) => state.game.isRevolution;

export const selectCardExchangeOrders = (state: RootState) =>
  state.game.cardExchangeOrders;

export const selectSamePlayersAsPreviousGame = (playerIds: string[]) => (
  state: RootState
) => {
  if (state.room.pastGames.length === 0) return false;
  const previousGame = state.room.pastGames.slice(-1)[0];

  if (
    previousGame.playerIds.length !== playerIds.length ||
    previousGame.playerIds.some((playerId) => !playerIds.includes(playerId))
  )
    return false;

  return true;
};

export const selectComputedCardExchangeOrdersFromPreviousGame = (
  playerIds: string[]
) => (state: RootState): CardExchangeOrder[] | null => {
  if (
    state.room.pastGames.length === 0 ||
    !selectSamePlayersAsPreviousGame(playerIds)(state)
  )
    return null;

  const { finishOrder } = state.room.pastGames.slice(-1)[0];

  const orders: CardExchangeOrder[] = [];

  orders.push({
    from: finishOrder[0],
    to: finishOrder[finishOrder.length - 1],
    number: 2,
    type: "any",
    cards: [],
  });
  orders.push({
    from: finishOrder[finishOrder.length - 1],
    to: finishOrder[0],
    number: 2,
    type: "best",
    cards: [],
  });

  if (finishOrder.length >= 4) {
    orders.push({
      from: finishOrder[1],
      to: finishOrder[finishOrder.length - 2],
      number: 1,
      type: "any",
      cards: [],
    });
    orders.push({
      from: finishOrder[finishOrder.length - 2],
      to: finishOrder[1],
      number: 1,
      type: "best",
      cards: [],
    });
  }

  return orders;
};

export const selectComputeStartingPlayer = (playerIds: string[]) => (
  state: RootState
): string => {
  if (
    state.room.pastGames.length === 0 ||
    !selectSamePlayersAsPreviousGame(playerIds)(state)
  ) {
    if (state.room.members) {
      const host = state.room.members.find((member) => member.info.isHost);
      if (host) {
        return host.id;
      }
      throw new Error("No HOST ?!");
    }
    throw new Error("No Members ?!");
  }

  const { finishOrder } = state.room.pastGames.slice(-1)[0];

  return finishOrder.slice(-1)[0];
};

export const finishEmoji = Object.freeze({
  2: ["🎖", "💩"],
  3: ["🎖", "👐", "💩"],
  4: ["🎖", "🥈", "🖕", "💩"],
  5: ["🎖", "🥈", "👐", "🖕", "💩"],
  6: ["🎖", "🥈", "👐", "👐", "🖕", "💩"],
});
export const selectComputeFinishEmoji = (playerId: string) => (
  state: RootState
) => {
  if (!state.game || !state.game.playerIds) return;
  const disqualifiedIndex = state.game.disqualifiedPlayers?.findIndex(
    (disqualifiedPlayer) => disqualifiedPlayer === playerId
  );
  const finishedIndex = state.game.finishedPlayers
    ?.filter(
      (finishedPlayer) =>
        !state.game.disqualifiedPlayers?.includes(finishedPlayer)
    )
    .findIndex((finisheddPlayer) => finisheddPlayer === playerId);

  const nbPlayers = state.game.playerIds.length;
  if (
    nbPlayers === 2 ||
    nbPlayers === 3 ||
    nbPlayers === 4 ||
    nbPlayers === 5 ||
    nbPlayers === 6
  ) {
    if (disqualifiedIndex !== undefined && disqualifiedIndex !== -1) {
      return finishEmoji[nbPlayers].slice().reverse()[disqualifiedIndex];
    } else if (finishedIndex !== undefined && finishedIndex !== -1) {
      return finishEmoji[nbPlayers].slice()[finishedIndex];
    }
  }
};

export const selectComputePreviousFinishEmoji = (playerId: string) => (
  state: RootState
) => {
  if (
    !state.room ||
    !state.room.pastGames ||
    !state.game.playerIds ||
    !state.room.pastGames ||
    state.room.pastGames.length === 0 ||
    !selectSamePlayersAsPreviousGame(state.game.playerIds)
  )
    return;

  const previousFinishIndex = state.room.pastGames
    .slice(-1)[0]
    .finishOrder?.findIndex((p) => p === playerId);
  const nbPlayers = state.game.playerIds.length;
  if (
    nbPlayers === 2 ||
    nbPlayers === 3 ||
    nbPlayers === 4 ||
    nbPlayers === 5 ||
    nbPlayers === 6
  ) {
    if (previousFinishIndex !== undefined && previousFinishIndex !== -1) {
      return finishEmoji[nbPlayers].slice()[previousFinishIndex];
    }
  }
};
