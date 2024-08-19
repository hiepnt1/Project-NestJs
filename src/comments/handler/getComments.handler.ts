import { ICommandHandler, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentQuery } from "../query/getComments.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentsEntity } from "../entity/comment.entity";

@QueryHandler(CommentQuery)
export class GetCommentsHandler implements IQueryHandler<CommentQuery, CommentsEntity[]> {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentsRepository: Repository<CommentsEntity>,
    ) { }

    async execute(query: CommentQuery) {
        if (query.postId) {
            return this.commentsRepository.find({
                where: {
                    post: {
                        id: query.postId
                    }
                }
            });
        }
        return this.commentsRepository.find();
    }
}