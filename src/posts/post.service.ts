import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Post } from "./post.interface";
import { UpdatePostDTO } from "./dto/updatePost.dto";
import { CreatePostDTO } from "./dto/createPost.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "./entity/post.entity";
import User from "../user/entity/user.entity";

@Injectable() // mark a provider
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) { }
    private lastPostId = 0;

    getAllPost() {
        return this.postRepository.find({ relations: ["author"] });
    }

    async getPostById(id: number) {
        const post = await this.postRepository.findOne({ where: { id: id }, relations: ['author'] })
        if (post) return post

        throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    }

    async updatePost(id: number, post: UpdatePostDTO) {
        await this.postRepository.update(id, post);
        const updatedPost = await this.postRepository.findOne({ where: { id: id }, relations: ['author'] });
        if (updatedPost) {
            return updatedPost;
        }
        throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    }

    async createPost(post: CreatePostDTO, user: User) {
        const newPost = this.postRepository.create({ ...post, author: user })
        await this.postRepository.save(newPost)
        return newPost;
    }

    async deletePost(id: number) {
        const deletePost = await this.postRepository.delete(id)
        if (!deletePost.affected)
            throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

    }
}