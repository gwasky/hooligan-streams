const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

const cacheUserSessions = async (user_id, data) => {
  try {
    await redisClient.set(user_id, data);
    return true;
  } catch (e) {
    return false;
  }
};

const getUserSessions = async (user_id) => {
  try {
    const sessions = await redisClient.get(user_id);
    return sessions;
  } catch (e) {
    return False;
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

// const getActiveStreams = (user_id) => {
//   return new Promise((resolve, reject) => {
//     redisClient
//       .get(user_id)
//       .then((sessions) => {
//         // console.log(sessions);
//         resolve(sessions);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

const getCurrentDate = () => {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
};

module.exports = {
  cacheUserSessions: cacheUserSessions,
  getUserSessions: getUserSessions,
  updateSessionActivity: updateSessionActivity,
  getCurrentDate: getCurrentDate,
};
