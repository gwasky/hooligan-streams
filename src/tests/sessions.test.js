const utils = require("./../utils/utils.js");

var activeSessions = {
  user_1: [
    { stream_id: "EPL_1", session_id: 1, last_accessed: 20220730080000 },
    { stream_id: "EPL_2", session_id: 2, last_accessed: 20220730080001 },
  ],
  user_2: [
    { stream_id: "EPL_1", session_id: 3, last_accessed: 20220730080000 },
    { stream_id: "EPL_2", session_id: 4, last_accessed: 20220730080001 },
  ],
  user_3: [
    { stream_id: "EPL_1", session_id: 5, last_accessed: 20220730080000 },
    { stream_id: "EPL_2", session_id: 6, last_accessed: 20220730080001 },
    { stream_id: "BUNDES_1", session_id: 7, last_accessed: 20220730080002 },
  ],
};

beforeAll(async () => {
  const status = await utils.cacheUserSessions(
    "user_3",
    JSON.stringify(activeSessions["user_3"])
  );
  if (status) {
    console.log("Test data loaded");
  }
});

test("Should cache session for user_1", async () => {
  //   console.log(activeSessions["user_1"]);
  const status = await utils.cacheUserSessions(
    "user_1",
    JSON.stringify(activeSessions["user_1"])
  );
  expect(status).toBe(true);
});

test("Should return list of session object from cache", async () => {
  const streams = await utils.getUserSessions("user_3");
  deserializedStreams = JSON.parse(streams);
  expect(deserializedStreams).toEqual(activeSessions["user_3"]);
});

test("Should update session object in redis", async () => {
  const activity_timestamp = utils.getCurrentTimestamp();
  const status = await utils.updateSessionActivity(
    "user_1",
    1,
    activity_timestamp
  );
  console.log(status);
  expect(status).toBe(true);
});

test("return false for new stream for users with 3 streams", async () => {});

test("return false for users with 3 streams", async () => {
  const status = await utils.cacheUserSessions("user_3", {
    stream_id: "LIGUE_1",
    session_id: 8,
    last_accessed: 20220730080001,
  });
  expect(status).toBe(false);
});
