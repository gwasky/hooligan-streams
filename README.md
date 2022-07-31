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

### NOT DONE

- Improve logging, with Log Levels, format with filename, line number
- Implemented Integration Tests
- Paused job would
- ##### Terraform Script
  - Provision VPC, with 2 Subnets, 1 Public and 1 Private
  - Create necessary roles and policies to be used by the services below eg ECS
  - Create the Cloudwatch groups into which the ECS cluster services will write their logs
  - Provision an ECS Cluster and place it within the Public Subnet covering multiple AZs
  - Provision an Elastic cache (Redis) cluster and place it within the Private Subnet
  - Provision 2 Security groups, one for the ECS Cluster and the other for the Redis cache cluster, allow ingress traffic from the ECS SG into the Redis SG
  - Create an ECR Repository, and Codepipeline which would be used to build the NodeApp docker image and push it into the ECR repository
  - Create a Task Definition, specifying the image pushed to the ECR repository
  - Create an ALB, configure ALB target groups with the NodeApp port as a target port, configure listener rules for both HTTP and HTTPS
    - Configure DNS, add an A record for this service to lb hosted Zone
    - Configure Service discovery on the NodeApp service
  - Things to consider:
    - Auto Scaling groups to scalability
    - Web Application Firewall, log to Cloudwatch
