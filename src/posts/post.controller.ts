import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDTO } from "./dto/createPost.dto";
import { UpdatePostDTO } from "./dto/updatePost.dto";
import { JwtAuthGuard } from "../user/authentication/guard/jwtAuthenticationGuard.guard";
import { FindOneParam } from "../utils/findOneParams";
import requestWithUser from "../user/authentication/interface/requesWithtUser.interface";

@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Get()
    getAllPost() {
        return this.postService.getAllPost();
    }


    @Get(":id")
    findById(@Param() { id }: FindOneParam) {
        return this.postService.getPostById(Number(id))
    }

    @Post()
    // @UseGuards(JwtAuthGuard)
    async craetePost(@Body() post: CreatePostDTO, @Req() req: requestWithUser) {
        return this.postService.createPost(post, req.user)
    }

    @Put()
    async replacePost(@Param('id') id: string, @Body() post: UpdatePostDTO) {
        return this.postService.updatePost(Number(id), post)
    }

    @Delete()
    async deletePost(@Param('id') id: string) {
        return this.postService.deletePost(Number(id))
    }
}
