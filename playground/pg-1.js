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

console.log(activeSessions["user_1"]);

session_id = 2;

lst = [];
z = activeSessions["user_1"];
for (var idx in z) {
  console.log(z[idx].session_id);
  if (z[idx].session_id == session_id) {
    z[idx]["last_accessed"] = 20220730080002;
    lst.push(z[idx]);
  } else {
    lst.push(z[idx]);
  }
}

console.log(lst);
