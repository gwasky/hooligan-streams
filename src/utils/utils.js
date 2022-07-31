const { reject, result } = require("lodash");
const redis = require("redis");
const request = require("request");

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

const cacheUserSessions = async (user_id, data) => {
  try {
    console.log(`Caching ${user_id} - ${data}`);
    await redisClient.set(user_id, data);
    return true;
  } catch (e) {
    return "error " + e;
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
  activity_timestamp
) => {
  try {
    const sessions = await redisClient.get(user_id);
    sessionsObj = JSON.parse(sessions);
    sessionList = [];
    for (var idx in sessionsObj) {
      console.log(sessionsObj[idx].session_id);
      if (sessionsObj[idx].session_id == session_id) {
        sessionsObj[idx]["last_accessed"] = activity_timestamp;
        sessionList.push(sessionsObj[idx]);
      } else {
        sessionList.push(sessionsObj[idx]);
      }
    }
    console.log(sessionList);
    await redisClient.set(user_id, JSON.stringify(sessionList));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const isNewSession = (session_id, sessions) => {
  const session = sessions.find((session) => session.session_id === session_id);
  if (session) {
    console.log(chalk.inverse(session));
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
  streamStatus: streamStatus,
  requestStreamAccess: requestStreamAccess,
  requestStreamAccessMock: requestStreamAccessMock,
};
