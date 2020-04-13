import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import { v4 as uuidv4 } from "uuid";

import { AppThunk, RootState } from "../../app/store";

interface RoomState {
  roomId: string | null;
  pseudo: string | null;
  pusherId: string | null;
  members: Member[];
  games: Game[];
}

const initialState: RoomState = {
  roomId: null,
  pseudo: null,
  pusherId: null,
  members: [],
  games: [],
};

type Member = {
  id: string;
  info: {
    pseudo: string;
    isLeader: boolean;
    joinedAt: number;
  };
};

type Game = {
  id: string;
  status: "starting" | "running" | "finished";
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setPseudo: (state, action: PayloadAction<string>) => {
      state.pseudo = action.payload;
    },
    setConnectedRoom: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setPusherId: (state, action: PayloadAction<string>) => {
      state.pusherId = action.payload;
    },
    addConnectedMember: (state, action: PayloadAction<Member>) => {
      state.members.push(action.payload);
      state.members.sort((a, b) =>
        a.info.joinedAt === b.info.joinedAt
          ? 0
          : a.info.joinedAt < b.info.joinedAt
          ? -1
          : 1
      );
    },
    removeConnectedMember: (state, action: PayloadAction<Member>) => {
      state.members.splice(
        state.members.findIndex((member) => member.id === action.payload.id)
      );
      state.members.sort((a, b) =>
        a.info.joinedAt === b.info.joinedAt
          ? 0
          : a.info.joinedAt < b.info.joinedAt
          ? -1
          : 1
      );
    },
    addNewGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload);
    },
  },
});

export const {
  setPseudo,
  setConnectedRoom,
  setPusherId,
  addConnectedMember,
  removeConnectedMember,
  addNewGame,
} = roomSlice.actions;

export const connectToRoom = (roomId: string): AppThunk => (
  dispatch,
  getState
) => {
  if (
    !process.env.REACT_APP_PUSHER_KEY ||
    !process.env.REACT_APP_PUSHER_AUTHENDPOINT
  )
    throw new Error("Pusher conf is necessary");

  const pseudo = selectPseudo(getState());

  let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: "eu",
    forceTLS: true,
    authEndpoint: process.env.REACT_APP_PUSHER_AUTHENDPOINT,
    auth: {
      params: {
        pseudo: pseudo,
      },
      headers: {},
    },
  });

  //@ts-ignore
  let channel: PusherTypes.PresenceChannel = pusher.subscribe(
    "presence-room-" + roomId
  );

  channel.bind("pusher:subscription_succeeded", function (members: any) {
    dispatch(setPusherId(channel.members.me.id));
    members.each(function (member: any) {
      dispatch(addConnectedMember(member));
    });
    dispatch(setConnectedRoom(roomId));
  });

  channel.bind("pusher:member_added", function (member: any) {
    dispatch(addConnectedMember(member));
  });

  channel.bind("pusher:member_removed", function (member: any) {
    dispatch(removeConnectedMember(member));
  });

  channel.bind("test", (data: any) => console.log(data));
};

export const startNewGame = (): AppThunk => (dispatch, getState) => {
  if (!selectIsConnected(getState()))
    throw new Error("Cannot start game on an unconnected room");
  if (!selectIsLeader(getState()))
    throw new Error("Cannot start game is not the leader of the room");

  const roomId = selectRoomId(getState());

  //init game
  const game: Game = {
    id: uuidv4(),
    status: "starting",
  };
  dispatch(addNewGame(game));

  //send events to players

  //ask server to deal cards
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPseudo = (state: RootState) => state.room.pseudo;

export const selectIsConnected = (state: RootState) => !!state.room.roomId;

export const selectRoomId = (state: RootState) => state.room.roomId;

export const selectConnectedMembers = (state: RootState) => state.room.members;

export const selectIsLeader = (state: RootState) =>
  state.room.members.some(
    (member) => member.id === state.room.pusherId && member.info.isLeader
  );

export const selectLastGame = (state: RootState) =>
  state.room.games.slice(-1)[0];

export default roomSlice.reducer;
