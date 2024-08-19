import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommentCommand } from "../command/createComment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentsEntity } from "../entity/comment.entity";
import { Repository } from "typeorm";

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentRepository: Repository<CommentsEntity>
    ) { }

    async execute(command: CreateCommentCommand) {
        const newComment = await this.commentRepository.create({ ...command.comment, author: command.author })
        await this.commentRepository.save(newComment);
        return newComment;
    }
}