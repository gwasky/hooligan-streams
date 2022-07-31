const express = require("express");
const request = require("request");
var _ = require("lodash");
const utils = require("./utils/utils.js");

var port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.post("/fetch-phase", async (req, res) => {
  var body = _.pick(req.body, [
    "user_id",
    "session_id",
    "stream_id",
    "last_accessed",
  ]);
  // Get Number of Active sessions
  var sessions = await utils.getUserSessions(body.user_id);
  console.log(`${body.user_id} - sessions  -  ${sessions}`);
  if (sessions == null) {
    // First Session
    try {
      //   const result = await utils.requestStreamAccess(
      //     "http://" + req.headers.host + "/allow-stream-access",
      //     body
      //   );

      const statusCode = await utils.requestStreamAccessMock();
      console.log(`${body.user_id} - ${statusCode} -  first session !!`);
      body.last_accessed = utils.getCurrentTimestamp();
      //   console.log(body);
      const status = await utils.cacheUserSessions(
        body.user_id,
        JSON.stringify([body])
      );
      if (status) {
        res.status(200).send({ status: "success!" });
      } else {
        console.log("cancelling stream");
        res.status(400).send({ status: "failed!" });
      }
    } catch (e) {
      console.log(e);
      console.log("stream not started successfully. Try again");
      msg = {
        status: "failed!",
        reason: "stream not started successfully. Try again",
      };
      res.status(statusCode).send(msg);
    }
  } else if (JSON.parse(sessions).length < 3) {
    sessions = JSON.parse(sessions);
    console.log(`${body.user_id} - session count [${sessions.length}] `);
    try {
      const statusCode = await utils.requestStreamAccessMock();
      console.log(`${body.user_id} - ${statusCode} -  stream success !!`);
      body.last_accessed = utils.getCurrentTimestamp();
      //   console.log(body);
      if (
        utils.isNewSession(body.session_id, sessions) ||
        utils.isNewStream(body.stream_id, sessions)
      ) {
        if (utils.isNewSession(body.session_id, sessions))
          console.log(`${body.user_id} - new session`);
        if (utils.isNewStream(body.session_id, sessions))
          console.log(`${body.user_id} - new stream`);
        if (
          utils.isNewSession(body.session_id, sessions) &&
          utils.isNewStream(body.session_id, sessions)
        )
          console.log(`${body.user_id} - new stream && new session`);
        var sessionList = sessions;
        sessionList.push(body);
        // console.log(sessionList);
        const status = await utils.cacheUserSessions(
          body.user_id,
          JSON.stringify(sessionList)
        );
        if (status) {
          res.status(200).send({ status: "success!" });
        } else {
          console.log(`${body.user_id} - cancelling stream`);
          res.status(400).send({ status: "failed!" });
        }
      }
      //   // new stream request
      //   if (utils.isNewSession(body.session_id, sessions)) {
      //     console.log(`${body.user_id} - new session`);
      //     const status = await utils.cacheUserSessions(
      //       body.user_id,
      //       JSON.stringify([body])
      //     );
      //     if (status) {
      //       res.status(200).send({ status: "success!" });
      //     } else {
      //       console.log(`${body.user_id} - cancelling stream`);
      //       res.status(400).send({ status: "failed!" });
      //     }
      //   } else if (utils.isNewStream(body.stream_id, sessions)) {
      //     console.log(`${body.user_id} - new stream`);
      //     var sessionList = sessions;
      //     sessionList.push(body);
      //     console.log(sessionList);
      //     const status = await utils.cacheUserSessions(
      //       body.user_id,
      //       JSON.stringify(sessionList)
      //     );
      //     if (status) {
      //       res.status(200).send({ status: "success!" });
      //     } else {
      //       console.log(`${body.user_id} - cancelling stream`);
      //       res.status(400).send({ status: "failed!" });
      //     }
      //   }
      else {
        // fetching next phase of video
        console.log(
          `${body.user_id} - fetching next phase of stream - ${body.stream_id} - will update activity date`
        );
        const status = await utils.updateSessionActivity(
          body.user_id,
          body.session_id,
          body.stream_id,
          body.last_accessed
        );
        if (status) {
          res.status(200).send({ status: "success!" });
        } else {
          console.log(`${body.user_id} - cancelling stream`);
          res.status(400).send({ status: "failed!" });
        }
      }
    } catch (e) {
      console.log(e);
      console.log("stream not started successfully. Try again");
      msg = {
        status: "failed!",
        reason: "stream not started successfully. Try again",
      };
      res.status(statusCode).send(msg);
    }
  } else {
    res
      .status(403)
      .send({ status: "Forbidden!", reason: "Already have 3 active streams" });
  }
});

app.post("/allow-stream-access", async (req, res) => {
  var body = _.pick(req.body, ["user_id", "session_id", "stream_id"]);
  var codes = [200, 300, 400, 500];
  statusCode = codes[Math.floor(Math.random() * codes.length)];
  console.log(body);
  res.json({});
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
