<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Content
1. Routing structure
- module.ts
- controller.ts
- service.ts

2. Config evn variable
- Connection database
- Connection elasticsearch

3. jWT token
- what is access token
- what is refresh token

4. Improvement speed by index
a. Introduce
- The job of indexes is to make our queries faster. It requires quite a bit of disk space by holding a copy of the indexed field values and pointing to the record they relate to. This information is stored in a separate data structure. Whenever we query the data, Postgres can use it under the hood to increase the speed
- Postgres needs to keep it synchronized. Every time we insert or update the data, Postgres needs to update the indexes too. When thinking about adding indexes, we need to consider the pros and cons.

b. Type of Scan
Postgres has a concept of index-only scans when the index contains all information required by a query
- sequential scan: sequentially scanning all items of a table
- index scan: uses indexes to increase the performance of the scan. Accesses the data from the index and uses it to fetch the data from the actual table
- index-only scan: also uses indexes but only scans the index data structure
- bitmap scan: a process between an index scan and sequential scan

c. Using
- generate indexes for certain columns using the @Index() decorator.

d. Index types
Postgres has a few index types available under the hood. By default, it uses B-tree indexes that fit most cases. We also have a few other options:

- Generalized Inverted Indexes (GIN): designed to handle cases where the values contain more than one key – for example, arrays
- Hash indexes: can only handle simple equality checks
- Block Range Indexes (BRIN): used for large tables with columns that have a linear sort order
- Generalized Search Try (GIST): useful for indexing geometric data and text search

5. Transaction
- it is the important concepts to understand when dealing with databases is a transaction.
a. The ACID properties
A transaction needs to have four properties:
  - Atomicity: operations in the transaction are a single unit that either succeeds fully or fails
  - Consistency: the transaction brings the database from one valid state to another    
  - Isolation: 
      - transactions can occur concurrently without resulting in the inconsistency of the database state
      - the intermediate state of a transaction should be invisible to other transactions
      - following up on our banking transaction example from above, another transaction should see the funds in one account or the other, but not in both, nor in either
  - Durability: changes made by a transaction that is successfully committed should survive permanently, even in the case of a system failure

b. Using
- To create a transaction block, we need to surround a group of statements with BEGIN  and COMMIT commands.
ex: 
BEGIN;
UPDATE "user"
  SET "avatarId"=NULL
  WHERE id=10;
  
DELETE FROM public_file
  WHERE id=15;
COMMIT;

- Another important command here is ROLLBACK. With it, we can abort the current transaction. It discards all updates made by the transaction.
ex: 
BEGIN;
  DROP TABLE "user";
  ROLLBACK
explain: The above transaction will never drop the user table because we always run a ROLLBACK at the end.

6. Microservice 
a.Using the TCP layer
- using TCP differently allows us to achieve event-based communication if we want. This way, the client does not wait for the response from the microservice.
- reate a dedicated microservice instead of using the ClientProxy directly in the controller. This would give us the possibility to export it from the SubscribersModule and use in other places of our application.

we’ve created the following flow:

- the user calls the  /subscribers endpoint in our monolithic app,
- our application calls the microservice to get the necessary data,
- the microservice retrieves the data from its own database,
- our main application responds with the data.

we break down our API into smaller, independent components. 
Having a separate codebase, and implementing a microservice separately, 
can make our application more scalable. 
Because we implement and deploy each microservice separately, it might be easier to handle feature releases and bug fixes.

7. Rabbit MQ
a. Introduce 
-The RabbitMQ is its fundamentals, a message broker that implements the Advanced Message Queuing Protocol (AMQP).

-One of the most important concepts to understand is the producer (also called a publisher), whose job is to send the messages. The second important thing is the consumer that waits to receive messages.

-Between the producer and the consumer is a queue. When the producer sends the message, it lands in the queue. The producer sends the messages through the exchange, which is a message routing agent.
Finally, the consumer picks up the message from the queue and handles it.
![alt text](image.png)

Summing up the above:

1.the producer sends a message to the exchange,
2.the exchange receives the message and routes it to the desired queue,
3.the consumer takes the message from the queue and consumes it.

8. CQRS Nestjs
- CQRS is command-query responsibility segregation
- Logic in services when use CQRS which use command to update data and queries to read it
-  Therefore, we have a separation between performing actions and extracting data. While this might not be beneficial for simple CRUD applications, CQRS might make it easier to incorporate a complex business logic.
=> Doing the above forces us to avoid mixing domain logic and infrastructural operations. Therefore, it works well with Domain-Driven Design.

Impllement Create comment
entity(relation with schemas) -> execute command -> match handler -> controller
get comment by query
getquery -> match handler -> controller

9.Two-factor
There is an important distinction between two-step authentication and two-factor authentication:
- two-factor: requires both something we have and something we know: atp card and pin code
- two-step: required all thing we know: password and pin code

10. Prisma
- install: npm install prisma
- initialize our configuration: npx prisma init
  - Doing the above creates two files for us:
    - schema.prisma: contains the database schema and specifies the connection with the database
    - .env: contains environment variables
- .env file: 
  - DATABASE_URL="postgresql://admin:admin@localhost:5432/nestjs?schema=public"
- using the Prisma Client: npm install @prisma/client
- diff way create our migration: 
  - npx prisma migrate dev --name post --preview-feature
  - Above we use the --preview-feature flag, because the Prisma Migrate tool is still in preview. It means that the functionality was validated, but there might be small bugs.

- {
  "name": "nestjs-prisma",
  "scripts": {
     // ...
    "generate-schema": "cat src/*/*.prisma > prisma/schema.prisma"
  },
  // ...
}
- Running cat src/*/*.prisma > prisma/schema.prisma merges all .prisma files into the prisma/schema.prisma directory. It traverses through all of the subdirectories of src.

RELATION DATAVASE
1. One to One
- a row from the first table matches just one row from the second table and vice versa.
- migrating and generating a new Prisma Client takes us three commands 
  - npm run generate-schema
  - npx prisma migrate dev --name user --preview-feature
  - npx prisma generate
=> cut off by 
{
  "name": "nestjs-prisma",
  "scripts": {
     // ...
     // cat use for Linux
    // "generate-schema": "cat src/*/*.prisma > prisma/schema.prisma",
     // for window:
    "generate-schema": "type src/*/*.prisma > prisma/schema.prisma"
    // or 
    // "generate-schema": "copy src/*/*.prisma prisma/schema.prisma"
    "migrate": "npm run generate-schema && prisma migrate dev --preview-feature --name $npm_config_name && prisma generate",
  },
  // ...

} => now run: npm run migrate --name=user
*** explain: NPM gets --name=user and gives us the access to it as $npm_config_name. We could do it with any variable name, such as --x=Hello and $npm_config_x.

2. One-to-Many and Many-To-One
- With the One-To-Many relationship, a row from the first table can be related to multiple rows from the second table. The row from the second table can be linked to just one row of the first table
- don’t use the unique indexes in the case of the One-To-Many relationship

3. Many-to-Many
- With the Many-To-Many relationship, a row from the first table can relate to the second table’s multiple rows and vice versa.

11. server-side sessions
- IDEA: we need to implement a mechanism to recognize if a person performing the request is authenticated. we’ve been using JSON Web Tokens for that. We can’t change the JWT token or make it invalid in a straightforward way.
- We create a session for the users with server-side sessions when they log in and keep this information in the memory. We send the session’s id to the user and expect them to send it back when making further requests. When that happens, we can compare the received id of the session with the data stored in memory.

11.1 Disadvantages
- we are storing the information about the session server-side, it might become tricky to scale.
- The more users we have logged in, the more significant strain it puts on our server’s memory
- if we have multiple instances of our web server, they don’t share memory => use load balacing
- when use load balancing, the user authenticates through the first instance and then accesses resources through the second instance, the server won’t recognize the user => this issue of redis
11.2 Advantages
- we have easy access to the session data, we can quickly invalidate it => we can easily remove one session from our memory
-  if we don’t want the user to log in through multiple devices simultaneously, we can easily prevent that
- a user changes a password, we can also remove the old session from memory
===> A significant thing to understand about the above code is that by default, the express-session library stores the session in the memory of our web server

We also need to call the logIn method to initialize the server-side session. When we look under the hood of NestJS, we can see that this method calls request.logIn. It is a function added to the request object by Passport. It creates the session and saves it in memory. Thanks to that, the Passport middleware can attach the session id cookie to the response.
===> We need to specify the exact data we want to keep inside the session. To manage it, we need to create a serializer.
=> create file "local.serializer.ts"
The serializeUser function determines the data stored inside of the session. In our case, we only store the id of the user.

 HttpOnly flag set to true => the browser can’t access it directly through JavaScript

12. Stripe
- Connecting nest-back end to Stripe api
- save credit card
- recurring price billed monthly
- free trial
- Reacting to Stripe events with webhooks


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
