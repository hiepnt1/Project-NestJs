import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, RawBody, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

  // use for patch  
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))) // ClassSerializerInterceptor needs the Reflector when initializing.
  //To be able to read cookies easily we need the  cookie - parser
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
