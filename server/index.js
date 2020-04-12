const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Pusher = require("pusher");
const cors = require("cors");

if (
  !process.env.PUSHER_APPID ||
  !process.env.PUSHER_KEY ||
  !process.env.PUSHER_SECRET
)
  throw new Error("Must provide pusher info");

let pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

const PORT = process.env.PORT || 5000;

express()
  .use(cors())
  .use(express.static(path.join(__dirname, "..", "build")))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .post("/pusher/auth", function (req, res) {
    let socketId = req.body.socket_id;
    let channel = req.body.channel_name;
    let pseudo = req.body.pseudo;
    let presenceData = {
      user_id: "unique_user_id" + new Date().getTime(),
      user_info: {
        pseudo: pseudo,
      },
    };
    let auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
  })
  .get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
