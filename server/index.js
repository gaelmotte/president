const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");
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

    pusher.get({ path: `/channels/${channel}/users`, params: {} }, function (
      error,
      request,
      response
    ) {
      try {
        if (response.statusCode === 200) {
          var result = JSON.parse(response.body);
          var users = result.users;

          let presenceData = {
            user_id: uuid.v4(),
            user_info: {
              pseudo: pseudo,
              isLeader: users.length === 0,
            },
          };
          let auth = pusher.authenticate(socketId, channel, presenceData);
          res.send(auth);
        } else {
          console.log("NOT 200 ON PUSHER API GET");
        }
      } catch (e) {
        console.error(e);
      }
    });
  })
  .get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
