import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { AppThunk, RootState } from "../../app/store";

if (!process.env.REACT_APP_API_ENDPOINT)
  throw new Error("Missing REACT_APP_API_ENDPOINT env");

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
  name: "game",
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
    axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}${getRoomId(getState())}/dealcards`,
      {
        pusherId: getPusherId(getState()),
      }
    );
  }
};

export const selectGameId = (state: RootState) => state.game.gameId;
export const selectStatus = (state: RootState) => state.game.status;

export const getRoomId = (state: RootState) => state.room.roomId;
export const getPusherId = (state: RootState) => state.room.pusherId;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};
