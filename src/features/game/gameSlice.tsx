import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { v4 as uuidv4 } from "uuid";

import { AppThunk, RootState } from "../../app/store";

interface GameState {
  gameId: string | null;
  status: "starting" | "running" | "finished" | undefined;
}
const initialState: GameState = {
  gameId: null,
  status: undefined,
};

let getChannel: () => PusherTypes.PresenceChannel | null = () => null;
let setChannel: (
  channel: PusherTypes.PresenceChannel | null
) => void = () => {};

export const gameSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<"starting" | "running" | "finished" | undefined>
    ) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = gameSlice.actions;

export const initializeGame = (isLeader: boolean): AppThunk => (
  dispatch,
  getState
) => {
  const channel: PusherTypes.PresenceChannel | null = getChannel();
  if (!channel) throw new Error("Channel not initialized");

  console.log("setting up game");
  dispatch(setStatus("starting"));

  // set up event sto watch
  channel.bind("client-game-cards-dealt", (data: any) => {
    console.log("Received cards", data);
  });

  // ask server to deal cards if leader
  if (isLeader) {
    console.log("ask server to deal cards");
  }
};

export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};
