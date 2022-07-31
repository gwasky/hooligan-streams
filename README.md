### USER STORIES

- As a user with no current session, i would like to request a 1st session
- As a user with active stream(s)/session(s), particularly streaming a stream Z, i should be allowed to fetch another phase of that stream
- As a user with less than 3 streaming sessions, i would like to request new session
- As a user with 3 streaming sessions, i should not be able to access to a third stream
- As a user with an idle session, the idle sessions should be terminated after X time and hence allowed to another session
- As a user currently streaming, i can use one session for more than one stream; one session = one stream

### ASSUMPTIONS

- Different phases of a vid cover X secs, so a client will fetch different phases of a video after every X secs
- Each client request payload will have a session_id,user_id and stream_id
- If a session doesnt request for the next phase of a video after X secs, It will be considered idle
- Sessions idle for n\*X secs will be expired, and active stream sessions reduced by that number
