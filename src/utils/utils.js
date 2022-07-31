const { reject, result } = require("lodash");
const redis = require("redis");
const request = require("request");
const chalk = require("chalk");

let redisClient;
let MAX_STREAMS = 3;

var redis_host = process.env.REDIS_HOST || "localhost";
var redis_port = process.env.REDIS_PORT || 6379;

(async () => {
  redisClient = redis.createClient({
    host: redis_host,
    port: redis_port,
  });
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

const cacheUserSessions = async (user_id, data) => {
  try {
    console.log(`Caching ${user_id} - ${data}`);
    const sessions = await redisClient.get(user_id);
    if (JSON.parse(sessions).length < MAX_STREAMS) {
      await redisClient.set(user_id, data);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

const getUserSessions = async (user_id) => {
  try {
    const sessions = await redisClient.get(user_id);
    return sessions;
  } catch (e) {
    return "error " + e;
  }
};

const updateSessionActivity = async (
  user_id,
  session_id,
  stream_id,
  activity_timestamp
) => {
  try {
    const sessions = await redisClient.get(user_id);
    sessionsObj = JSON.parse(sessions);
    sessionList = [];
    for (var idx in sessionsObj) {
      if (
        sessionsObj[idx].session_id == session_id &&
        sessionsObj[idx].stream_id == stream_id
      ) {
        sessionsObj[idx]["last_accessed"] = activity_timestamp;
        sessionList.push(sessionsObj[idx]);
      } else {
        sessionList.push(sessionsObj[idx]);
      }
    }
    // console.log(sessionList);
    await redisClient.set(user_id, JSON.stringify(sessionList));
    return true;
  } catch (e) {
    // console.log(e);
    return false;
  }
};

const isNewSessionAndStream = (session_id, stream_id, sessions) => {
  const session = sessions.find(
    (session) =>
      session.session_id === session_id && session.stream_id == stream_id
  );
  if (session) {
    console.log(
      `${session.user_id} - session_id[${session.session_id}] with stream[${session.stream_id}] exists - `
    );
    return false;
  } else {
    return true;
  }
};

const isNewSession = (session_id, sessions) => {
  const session = sessions.find((session) => session.session_id === session_id);
  if (session) {
    console.log(`${session.user_id} - session_id exists - `);
    return false;
  } else {
    return true;
  }
};

const isNewStream = (stream_id, sessions) => {
  const session = sessions.find((session) => session.stream_id === stream_id);
  if (session) {
    console.log(chalk.inverse(JSON.stringify(session)));
    return false;
  } else {
    return true;
  }
};

const getCurrentTimestamp = () => {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
};

const streamStatus = (uri, callback) => {
  request(uri, (err, resp, body) => {
    if (!err && resp.statusCode == 200) {
      result = JSON.stringify(JSON.parse(body));
      callback(null, result);
    } else {
      callback(err, null);
    }
  });
};

const requestStreamAccess = async (uri, payload) => {
  console.log(uri);
  return await new Promise((resolve, reject) => {
    request.post(uri, payload, (err, resp) => {
      console.log(resp.statusCode);
      if (resp.statusCode == 200) {
        resolve(payload);
      } else {
        reject(err);
      }
    });
  });
};

const requestStreamAccessMock = async () => {
  //   var codes = [200, 300, 400, 500];
  var codes = [200];
  statusCode = codes[Math.floor(Math.random() * codes.length)];
  return await new Promise((resolve, reject) => {
    // console.log(statusCode);
    if (statusCode == 200) {
      resolve(statusCode);
    } else {
      reject(statusCode);
    }
  });
};

module.exports = {
  cacheUserSessions: cacheUserSessions,
  getUserSessions: getUserSessions,
  updateSessionActivity: updateSessionActivity,
  getCurrentTimestamp: getCurrentTimestamp,
  isNewSession: isNewSession,
  isNewStream: isNewStream,
  streamStatus: streamStatus,
  requestStreamAccess: requestStreamAccess,
  requestStreamAccessMock: requestStreamAccessMock,
  isNewSessionAndStream: isNewSessionAndStream,
};
