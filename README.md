### USER STORIES

- As a user with no current session, i would like to request a 1st session
- As a user with active stream(s)/session(s), particularly streaming a stream Z, i should be allowed to fetch another phase of that stream
- As a user with less than 3 streaming sessions, i would like to request new session
- As a user with 3 streaming sessions, i should not be able to access to a third stream
- As a user with an idle session, the idle sessions should be terminated after X time and hence allowed to another session
- As a user currently streaming, i can use one session for more than one stream; one session = one stream

### ASSUMPTIONS

- Session will send requests for new streams every X Secs, different phases/parts of a vid cover X secs, so a client will fetch different phases/parts of a video after every X secs
- Each client request payload will have a session_id,user_id and stream_id
- If a session doesnt request for the next phase of a video after X secs, It will be considered idle
- Sessions idle for n\*X secs will be expired, and active stream sessions reduced by that number

## PSUEDO

End Point 1 | Triggered by Client

1.  payload => user_id, session_id, stream_id
    Query cache for session by user_id
    if user has active sessions:
    sessions < 3:
    Is it a new session or existing session
    if new session
    Allow service to issue the next phase of the stream
    if client has received the phases:
    add the new session to cache, details stream_id, user_id, last last_activity_date
    if existing session:
    Allow service to issue the next phase of the stream
    if client has received the phases:
    Update the last_activity_timestamp for that session in cache
    if user has no active session:
    Allow service to issue the next phase of the stream
    if client has received the phases:
    add the new session to cache, details stream_id, user_id, last last_activity_date

    Properties being:
    session_id
    user_id
    last_activity_date/time

End Point 2: (Triggered by a lambda function) - to Expire Inactive sessions:
Fetch all sessions with last_activity_date_time <= n\*X
expire all of them (call back)
