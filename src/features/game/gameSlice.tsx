import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { v4 as uuidv4 } from "uuid";

import { AppThunk, RootState } from "../../app/store";

import { dealCards } from "../../services/cardsUtils";
import { stat } from "fs";
import CardStyle from "./components/card/Card.style";

interface GameState {
  gameId: string | null;
  status: "starting" | "running" | "finished" | undefined;
  playersHands: { [playerId: string]: number[] };
  currentPlayer: string | null;
  currentFold: number[][] | null;
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
    setNewFold: (state) => {
      state.currentFold = [];
    },
    setCardsToCurrentFold: (state, action: PayloadAction<number[]>) => {
      if (state.currentFold) state.currentFold.push(action.payload);
    },
    setCardsPlayedByPlayer: (
      state,
      action: PayloadAction<{ playerId: string; cards: number[] }>
    ) => {
      state.playersHands[action.payload.playerId] = state.playersHands[
        action.payload.playerId
      ].filter((card) => !action.payload.cards.includes(card));
    },
  },
});

export const {
  setStatus,
  setPlayersHands,
  setCurrentPlayer,
  setNewFold,
  setCardsToCurrentFold,
  setCardsPlayedByPlayer,
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
        dispatch(setNewFold());
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
        dispatch(setNewFold());
      }
    );
  }

  // set up event sto watch
  channel.bind(
    "client-game-cards-played",
    (data: any, metadata: { user_id: string }) => {
      console.log(data);
      const nextPLayer = selectNextPLayer(getState());
      if (nextPLayer) dispatch(setCurrentPlayer(nextPLayer));
      dispatch(setCardsToCurrentFold(data));
      dispatch(
        setCardsPlayedByPlayer({ playerId: metadata.user_id, cards: data })
      );
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

  dispatch(setCardsToCurrentFold(cards));
  dispatch(setCardsPlayedByPlayer({ playerId: currentPlayer, cards }));

  const nextPLayer = selectNextPLayer(getState());
  if (nextPLayer) dispatch(setCurrentPlayer(nextPLayer));
};

export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;
export const selectMembersIds = (state: RootState) =>
  state.room.members.map((member) => member.id);

export const selectPlayerHand = (state: RootState) =>
  state.room.pusherId ? state.game.playersHands[state.room.pusherId] : null;

export const selectIsPlayerTurn = (state: RootState) =>
  state.game.currentPlayer === state.room.pusherId;
export const selectCurrentPlayer = (state: RootState) =>
  state.game.currentPlayer;

export const selectPusherId = (state: RootState) => state.room.pusherId;

export const selectNextPLayer = (state: RootState) => {
  const currentPLayerIndex = state.room.members.findIndex(
    (member) => member.id === state.game.currentPlayer
  );
  if (currentPLayerIndex !== -1) {
    return state.room.members[
      (currentPLayerIndex + 1) % state.room.members.length
    ].id;
  }
  return null;
};

export const selectCurrentFold = (state: RootState) => state.game.currentFold;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};
