import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsEntity } from "./entity/comment.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateCommentHandler } from "./handler/createComment.handler";

@Module({
    imports: [TypeOrmModule.forFeature([CommentsEntity]), CqrsModule],
    controllers: [CommentsController],
    providers: [CreateCommentHandler]
})
export class CommentModule { }