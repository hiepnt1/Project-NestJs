import { Module } from '@nestjs/common';
import { PostModule } from './posts/post.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './user/authentication/authentication.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './category/categories.module';

// @hapi/joi use to define a validation schema
@Module({
  imports: [PostModule, ConfigModule.forRoot(
    {
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_SECRET: Joi.string().required()

      }), isGlobal: true
    }
  ), DatabaseModule, UserModule, AuthenticationModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
