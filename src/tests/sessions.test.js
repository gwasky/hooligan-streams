const utils = require("./../utils/utils.js");

var activeSessions = {
  user_1: [
    { stream_id: "EPL_1", last_accessed: 20220730080000 },
    { stream_id: "EPL_2", last_accessed: 20220730080001 },
  ],
  user_2: [
    { stream_id: "EPL_1", last_accessed: 20220730080000 },
    { stream_id: "EPL_2", last_accessed: 20220730080001 },
  ],
  user_3: [
    { stream_id: "EPL_1", last_accessed: 20220730080000 },
    { stream_id: "EPL_2", last_accessed: 20220730080001 },
    { stream_id: "BUNDES_1", last_accessed: 20220730080002 },
  ],
};

// beforeAll(() => {});

test("Should cache session for user_1", async () => {
  //   console.log(activeSessions["user_1"]);
  const status = await utils.cacheUserStream(
    "user_1",
    JSON.stringify(activeSessions["user_1"])
  );
  expect(status).toBe(true);
});

test("Should return list of session object from redis", async () => {
  const streams = await utils.getActiveStreams("user_1");
  deserializedStreams = JSON.parse(streams);
  expect(deserializedStreams).toEqual(activeSessions["user_1"]);
});

test("Should update session object in redis", async () => {});
