var activeSessions = {
  user_1: [
    { stream_id: "epl_1", last_accessed: new Date() },
    { stream_id: "epl_2", last_accessed: new Date() },
  ],
  user_2: [
    { stream_id: "epl_1", last_accessed: new Date() },
    { stream_id: "epl_2", last_accessed: new Date() },
  ],
  user_3: [
    { stream_id: "epl_1", last_accessed: new Date() },
    { stream_id: "epl_2", last_accessed: new Date() },
    { stream_id: "bundesliga_1", last_accessed: new Date() },
  ],
};

beforeAll(() => {});

test("Should add session object to redis", () => {
  console.log(activeSessions);
});

test("Should return list of session object from redis", () => {});

test("Should update session object in redis", () => {});
