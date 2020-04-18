import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as PusherTypes from "pusher-js";

import { AppThunk, RootState } from "../../app/store";

import {
  dealCards,
  Fold,
  Move,
  isAllSameFigure,
} from "../../services/cardsUtils";
import FoldStyle from "./components/fold/Fold.style";

interface GameState {
  gameId: string | null;
  status: "starting" | "running" | "finished" | undefined;
  playersHands: { [playerId: string]: number[] };
  currentPlayer: string | null;
  currentFold: Fold | null;
}
const initialState: GameState = {
  gameId: null,
  status: undefined,
  playersHands: {},
  currentPlayer: null,
  currentFold: null,
};

let getChannel: () => PusherTypes.PresenceChannel | null = () => null;
let setChannel: (
  channel: PusherTypes.PresenceChannel | null
) => void = () => {};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<"starting" | "running" | "finished" | undefined>
    ) => {
      state.status = action.payload;
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
      // TODO determine how many cards should be played in this fold
      state.currentFold = {
        moves: [],
        passedPlayers: [],
        cardsPerPlay: action.payload.length,
        closed: false,
      };
    },
    setFoldClosed: (state) => {
      if (state.currentFold) state.currentFold.closed = true;
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
      if (state.currentFold) {
        state.currentFold.moves.push(action.payload);
      }
    },
    setPlayerPassed: (state, action: PayloadAction<string>) => {
      state.currentFold?.passedPlayers.push(action.payload);
    },
    setPlayersPassed: (state, action: PayloadAction<string[]>) => {
      if (state.currentFold) state.currentFold.passedPlayers = action.payload;
    },
  },
});

export const {
  setStatus,
  setPlayersHands,
  setCurrentPlayer,
  setNewFold,
  setFoldClosed,
  setEndFold,
  setPlayedMove,
  setPlayerPassed,
  setPlayersPassed,
} = gameSlice.actions;

export const initializeGame = (isLeader: boolean): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  console.log("setting up game");
  dispatch(setStatus("starting"));

  // ask server to deal cards if leader
  if (isLeader) {
    console.log("Deal cards");
    const memberIds = selectMembersIds(getState());
    const hands = dealCards(memberIds);
    const pusherId = selectPusherId(getState());
    console.log("dealing cards as ", pusherId);
    if (pusherId) {
      setTimeout(() => {
        channel.trigger("client-game-cards-dealt", hands);
        dispatch(setPlayersHands(hands));
        dispatch(setCurrentPlayer(pusherId));
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
        console.log("Received cards", data);
        dispatch(setPlayersHands(data));
        dispatch(setCurrentPlayer(metadata.user_id));
      }
    );
  }

  // set up event sto watch
  channel.bind(
    "client-game-cards-played",
    (data: any, metadata: { user_id: string }) => {
      dispatch(setPlayedMove({ playerId: metadata.user_id, cards: data }));
      dispatch(checkClosedFold());
      const nextPLayer = selectNextPLayer(getState());
      if (nextPLayer) {
        dispatch(setCurrentPlayer(nextPLayer));
      }
    }
  );

  channel.bind(
    "client-game-player-passed",
    (data: any, metadata: { user_id: string }) => {
      console.log("player passed", metadata.user_id);
      dispatch(setPlayerPassed(metadata.user_id));
      dispatch(checkClosedFold());
      const nextPLayer = selectNextPLayer(getState());
      if (nextPLayer) {
        dispatch(setCurrentPlayer(nextPLayer));
      }
    }
  );

  channel.bind(
    "client-game-fold-started",
    (data: number[], metadata: { user_id: string }) => {
      console.log("fold started", metadata.user_id);
      dispatch(setNewFold(data));

      const currentPlayer = selectCurrentPlayer(getState());
      if (!currentPlayer) throw "No current PLayer";

      dispatch(setPlayedMove({ playerId: currentPlayer, cards: data }));

      const nextPLayer = selectNextPLayer(getState());
      if (nextPLayer) {
        dispatch(setCurrentPlayer(nextPLayer));
      }
    }
  );
};

export const playCards = (cards: number[]): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  channel.trigger("client-game-cards-played", cards);
  console.log("playing cards");

  const currentPlayer = selectCurrentPlayer(getState());
  if (!currentPlayer) throw "No current PLayer";

  dispatch(setPlayedMove({ playerId: currentPlayer, cards }));
  dispatch(checkClosedFold());

  const nextPLayer = selectNextPLayer(getState());
  if (nextPLayer) {
    dispatch(setCurrentPlayer(nextPLayer));
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

  const nextPLayer = selectNextPLayer(getState());
  if (nextPLayer) {
    dispatch(setCurrentPlayer(nextPLayer));
  }
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

  dispatch(setPlayedMove({ playerId: currentPlayer, cards }));

  const nextPLayer = selectNextPLayer(getState());
  if (nextPLayer) {
    dispatch(setCurrentPlayer(nextPLayer));
  }
};

export const checkClosedFold = (): AppThunk => (dispatch, getState) => {
  const fold = selectCurrentFold(getState());
  if (fold) {
    console.log("Checking if fold is closed", fold.moves.slice(-1));
    const memberIds = selectMembersIds(getState());
    if (fold.passedPlayers.length === memberIds.length) {
      dispatch(setFoldClosed());
      dispatch(setPlayersPassed(memberIds));
      dispatch(setCurrentPlayer(fold.moves.slice(-1)[0].playerId));
    } else if (
      fold.moves.length !== 0 &&
      fold.moves.slice(-1)[0].cards[0] % 13 === 12
    ) {
      dispatch(setPlayersPassed(memberIds));
      dispatch(setFoldClosed());
      dispatch(setCurrentPlayer(fold.moves.slice(-1)[0].playerId));
    } else if (fold.cardsPerPlay !== 4) {
      const playedCardsInFold = fold.moves.map((move) => move.cards).flat();
      if (
        playedCardsInFold.length >= 4 &&
        isAllSameFigure(playedCardsInFold.slice(-4))
      ) {
        dispatch(setFoldClosed());
        dispatch(setPlayersPassed(memberIds));
        dispatch(setCurrentPlayer(fold.moves.slice(-1)[0].playerId));
      }
    }
  }
};

export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;
export const selectMembersIds = (state: RootState) =>
  state.room.members.map((member) => member.id);

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

export const selectNextPLayer = (state: RootState) => {
  const currentPLayerIndex = state.room.members.findIndex(
    (member) => member.id === state.game.currentPlayer
  );
  if (currentPLayerIndex === -1) throw new Error("NO CURRENT PLAYER");

  for (let i = 0; i < state.room.members.length; i++) {
    const consideredPlayerIndex =
      (currentPLayerIndex + 1 + i) % state.room.members.length;
    const consideredPlayerId = state.room.members[consideredPlayerIndex].id;
    console.log(currentPLayerIndex, consideredPlayerIndex, consideredPlayerId);
    if (
      state.game.playersHands[consideredPlayerId].length > 0 &&
      !state.game.currentFold?.passedPlayers.includes(consideredPlayerId)
    ) {
      // has still cards in hand and has not passed
      return consideredPlayerId;
    }
  }
  // no player available, return null
  return null;
};

export const selectCurrentFold = (state: RootState) => state.game.currentFold;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};

export const selectIsFoldClosed = (state: RootState) =>
  state.game?.currentFold?.closed;
