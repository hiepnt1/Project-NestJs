import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entity/post.entity";

/* with repository, we can manage a particular entity
 a repositotry has multiple functions to interact with entities
access it, we use the  TypeOrmModule again
then, in our  PostsService, we can inject the Posts repository.
*/
@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule { }