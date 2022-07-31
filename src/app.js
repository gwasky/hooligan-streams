const express = require("express");
const request = require("request");
var _ = require("lodash");

const utils = require("./utils/utils.js");
const { result } = require("lodash");

var port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.post("/fetch-phase", async (req, res) => {
  var body = _.pick(req.body, ["user_id", "session_id", "stream_id"]);
  //   console.log(body);
  // Get Number of Active sessions
  const sessions = await utils.getUserSessions(body.user_id);
  if (sessions == null) {
    // First session
    try {
      const result = await utils.requestStreamAccess(
        "http://" + req.headers.host + "/allow-stream-access",
        body
      );
      console.log(result);
      if (result !== null) {
        const status = await utils.cacheUserSessions(body.user_id, body);
        if (status) {
          res.status(200).send({ status: "success!" });
        }
      } else {
        // res.status(400).send({ status: "failed!" });
        res.send({ key: "testingsdfsdfdsfd" });
      }
    } catch (e) {
      console.log(e);
      //   res.status(400).send({ status: "failed!" });
    }

    // console.log(result);
    // const status = await utils.cacheUserSessions(body.user_id, body);
    // if (status) {
    //   res.status(200).send({});
    // }
  } else if (sessions.length < 3) {
    // Is it a new session
    if (utils.isNewSession(body.session_id, sessions)) {
      const status = await utils.cacheUserSessions(body.user_id, body);
    }
  }
  //   console.log(sessions);
  res.send({ key: "testing" });
});

app.post("/allow-stream-access", async (req, res) => {
  var body = _.pick(req.body, ["user_id", "session_id", "stream_id"]);
  var codes = [200, 300, 400, 500];
  statusCode = codes[Math.floor(Math.random() * codes.length)];
  console.log(body);
  res.json({});
  //   if (statusCode == 200) {
  //     res.status(statusCode).json({ status: "success!!!" });
  //   } else {
  //     res.status(statusCode).json({ status: "failed!!!" });
  //   }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
