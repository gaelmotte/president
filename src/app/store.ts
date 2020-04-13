import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import * as PusherTypes from "pusher-js";

import counterReducer from "../features/counter/counterSlice";
import roomReducer from "../features/room/roomSlice";

let channel: PusherTypes.PresenceChannel | null = null;
const getChannel = () => channel;
const setChannel = (c: PusherTypes.PresenceChannel) => (channel = c);

console.log("LOADED STORE");
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    room: roomReducer(getChannel, setChannel),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
