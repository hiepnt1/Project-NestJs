import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, RawBody, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';
import { runInCluster } from './redisdd/runInCluster';
import * as session from 'express-session';
import * as passport from 'passport'
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import { Redis } from 'ioredis';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

  // use for patch  
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))) // ClassSerializerInterceptor needs the Reflector when initializing for hide-show properties data.
  // for two package validator, class-transformer

  const configService = app.use(ConfigService)
  // middleware for server-side session
  const client = new Redis.Cluster([{ host: "localhost", port: 6379 }]);
  client.on("error", (e) => console.error(e));

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({ client }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session())

  //To be able to read cookies easily we need the  cookie - parser
  app.use(cookieParser())
  await app.listen(3000);
}
runInCluster(bootstrap);
