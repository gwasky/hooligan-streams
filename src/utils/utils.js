const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

const cacheUserStream = async (user_id, data) => {
  try {
    await redisClient.set(user_id, data);
    return true;
  } catch (e) {
    return false;
  }
};

const getActiveStreams = async (user_id) => {
  try {
    const sessions = await redisClient.get(user_id);
    return sessions;
  } catch (e) {
    return False;
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

module.exports = {
  cacheUserStream: cacheUserStream,
  getActiveStreams: getActiveStreams,
};
