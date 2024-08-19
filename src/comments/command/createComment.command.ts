// With CQRS, we perform actions by executing commands
import User from "src/user/entity/user.entity";
import CreateCommentDto from "../dto/createComment.dto";

export class CreateCommentCommand {
    constructor(
        public readonly comment: CreateCommentDto,
        public readonly author: User,
    ) { }
}