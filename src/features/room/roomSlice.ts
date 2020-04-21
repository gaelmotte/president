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
  pastGames: PastGame[];
  currentGame: string | null;
  currentGamePlayerIds: string[] | null;
}

const initialState: RoomState = {
  roomId: null,
  pseudo: null,
  pusherId: null,
  members: [],
  pastGames: [],
  currentGame: null,
  currentGamePlayerIds: null,
};

type Member = {
  id: string;
  info: {
    pseudo: string;
    isHost: boolean;
    joinedAt: number;
    avatar: string;
  };
};

type PastGame = {
  id: string;
  playerIds: string[];
  finishOrder: string[];
};

let getChannel: () => PusherTypes.PresenceChannel | null = () => null;
let setChannel: (
  channel: PusherTypes.PresenceChannel | null
) => void = () => {};

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
    setCurrentGame: (
      state,
      action: PayloadAction<{
        gameId: string | null;
        playerIds: string[] | null;
      }>
    ) => {
      state.currentGame = action.payload.gameId;
      state.currentGamePlayerIds = action.payload.playerIds;
    },
    setPastGame: (state, action: PayloadAction<PastGame>) => {
      state.pastGames.push(action.payload);
    },
  },
});

export const {
  setPseudo,
  setConnectedRoom,
  setPusherId,
  addConnectedMember,
  removeConnectedMember,
  setCurrentGame,
  setPastGame,
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
  if (!channel) throw new Error("unable to subscribe");

  setChannel(channel);

  channel.bind("pusher:subscription_succeeded", function (members: any) {
    if (!channel) throw new Error("subscribe to unexistant channels");
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

  channel.bind(
    "client-game-starting",
    ({ gameId, playerIds }: { gameId: string; playerIds: string[] }) => {
      dispatch(setCurrentGame({ gameId, playerIds }));
    }
  );
};

export const startNewGame = (playerIds: string[]): AppThunk => (
  dispatch,
  getState
) => {
  if (!selectIsConnected(getState()))
    throw new Error("Cannot start game on an unconnected room");
  if (!selectIsHost(getState()))
    throw new Error("Cannot start game is not the Host of the room");

  const roomId = selectRoomId(getState());

  let channel = getChannel();
  if (!channel || !roomId) {
    throw new Error("Something isn't initialized" + roomId + channel);
  }

  const gameId = uuidv4();
  dispatch(setCurrentGame({ gameId, playerIds }));

  channel.trigger("client-game-starting", { gameId, playerIds });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPseudo = (state: RootState) => state.room.pseudo;

export const selectIsConnected = (state: RootState) => !!state.room.roomId;

export const selectRoomId = (state: RootState) => state.room.roomId;

export const selectConnectedMembers = (state: RootState) => state.room.members;

export const selectIsHost = (state: RootState) =>
  state.room.members.some(
    (member) => member.id === state.room.pusherId && member.info.isHost
  );

export const selectLastGame = (state: RootState) =>
  state.room.pastGames.slice(-1)[0];

export const selectCurrentGameId = (state: RootState) => state.room.currentGame;

export const selectCurrentGamePlayerIds = (state: RootState) =>
  state.room.currentGamePlayerIds;

export default (gc: any, sc: any) => {
  getChannel = gc;
  setChannel = sc;
  return roomSlice.reducer;
};

export const selectHostId = (state: RootState) => {
  if (state.room.members) {
    const host = state.room.members.find((member) => member.info.isHost);
    return host ? host.id : undefined;
  }
};

export const selectPlayerPseudo = (playerId: string | undefined) => (
  state: RootState
) =>
  playerId
    ? state.room.members.find((member) => member.id === playerId)?.info.pseudo
    : undefined;

export const selectPlayerAvatar = (playerId: string | undefined) => (
  state: RootState
) =>
  playerId
    ? state.room.members.find((member) => member.id === playerId)?.info.avatar
    : undefined;

export const selectPlayersPseudo = (state: RootState) => {
  return state.room.members.reduce<{ [playerId: string]: string }>(
    (acc: { [playerId: string]: string }, member: Member) => {
      acc[member.id] = member.info.pseudo;
      return acc;
    },
    {}
  );
};

export const selectPreviousGamePlayers = (state: RootState) => {
  if (state.room.pastGames.length === 0) return null;
  return state.room.pastGames.slice(-1)[0].playerIds;
};
