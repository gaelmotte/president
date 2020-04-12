import React, { useEffect } from "react";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";

function App() {
  useEffect(() => {
    if (
      !process.env.REACT_APP_PUSHER_KEY ||
      !process.env.REACT_APP_PUSHER_AUTHENDPOINT
    )
      throw new Error("Pusher conf is necessary");

    console.log(process.env.REACT_APP_PUSHER_KEY);

    let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      forceTLS: true,
      authEndpoint: process.env.REACT_APP_PUSHER_AUTHENDPOINT,
      auth: {
        params: {
          pseudo: prompt("Your pseudo"),
        },
        headers: {},
      },
    });

    //@ts-ignore
    let channel: PusherTypes.PresenceChannel = pusher.subscribe(
      "presence-test"
    );

    channel.bind("pusher:subscription_succeeded", function (members: any) {
      // for example
      console.log(members.count);

      members.each(function (member: any) {
        // for example:
        console.log(member.id, member.info);
      });
    });

    channel.bind("pusher:member_added", function (member: any) {
      // for example:
      console.log(member.id, member.info);
    });

    channel.bind("test", (data: any) => console.log(data));

    return () => {
      //clean up pusher
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
