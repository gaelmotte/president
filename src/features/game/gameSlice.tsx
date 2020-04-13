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
  reducers: {},
});

export const {} = gameSlice.actions;

export const selectGameId = (state: RootState) => state.game.gameId;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return gameSlice.reducer;
};
