import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entity/post.entity";
import PostSearchService from "./postsSearch.service";
import { SearchModule } from "../search/search.module";
import { UserModule } from "../user/user.module";
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from "cache-manager-redis-store";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";

/* with repository, we can manage a particular entity
 a repositotry has multiple functions to interact with entities
access it, we use the  TypeOrmModule again
then, in our  PostsService, we can inject the Posts repository.
*/
@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), SearchModule, UserModule, CacheModule.register({
        store: redisStore,
        host: process.env.REDIS_HOST
        , port: process.env.REDIS_PORT,
        ttl: 120
    }), PrismaModule],
    controllers: [PostController],
    providers: [PostService, PostSearchService]
})
export class PostModule { }