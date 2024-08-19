import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "src/authentication/guard/jwtAuthenticationGuard.guard";
import CreateCommentDto from "./dto/createComment.dto";
import requestWithUser from "src/authentication/interface/requesWithtUser.interface";
import { CreateCommentCommand } from "./command/createComment.command";
import GetCommentsDto from "./dto/getComment.dto";
import { CommentQuery } from "./query/getComments.query";

@Controller('comments')
// To execute the above command, we need to use a command bus.
export class CommentsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createComment(@Body() comment: CreateCommentDto, @Req() req: requestWithUser) {
        const user = req.user;
        // Once we execute a certain command, it gets picked up by a matching command handler.
        return this.commandBus.execute(new CreateCommentCommand(comment, user))
    }

    @Get()
    async getComment(@Query() { postId }: GetCommentsDto) {
        return this.queryBus.execute(
            new CommentQuery(postId)
        )
    }

}