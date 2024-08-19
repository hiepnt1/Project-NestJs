import { Module } from '@nestjs/common';
import { PostModule } from './posts/post.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './category/categories.module';
import { SearchModule } from './search/search.module';
import { CommentModule } from './comments/comments.module';
import { TwoFactorAuthModule } from './two-factor-auth/twoFactorAuth.module';
import { PrismaModule } from './prisma/prisma.module';

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
        JWT_SECRET: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string(),
        ELASTICSEARCH_USERNAME: Joi.string(),
        ELASTICSEARCH_PASSWORD: Joi.string(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SESSION_SECRET: Joi.string().required()
      }), isGlobal: true
    }
  ), DatabaseModule, UserModule, SearchModule, AuthenticationModule, CategoriesModule, CommentModule, TwoFactorAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
