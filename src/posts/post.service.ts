import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Post } from "./post.interface";
import { UpdatePostDTO } from "./dto/updatePost.dto";
import { CreatePostDTO } from "./dto/createPost.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, MoreThan, Repository } from "typeorm";
import { PostEntity } from "./entity/post.entity";
import User from "../user/entity/user.entity";
import PostSearchService from "./postsSearch.service";
import { PrismaService } from "prisma-postgres/prisma/prisma.service";

@Injectable() // mark a provider
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        private readonly postSearchService: PostSearchService
    ) { }

    // return only the number of matching posts and to count them separately.
    async getAllPost(offset?: number, limit?: number, startId?: number) {
        const where: FindManyOptions<PostEntity>['where'] = {};
        let separateCount = 0;
        if (startId) {
            where.id = MoreThan(startId);
            separateCount = await this.postRepository.count();
        }

        const [items, count] = await this.postRepository.findAndCount({ where, relations: ["author"], order: { id: "ASC" }, skip: offset, take: limit });
        return { items, count: startId ? separateCount : count }
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
            await this.postSearchService.update(updatedPost)
            return updatedPost;
        }
        throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    }

    async createPost(post: CreatePostDTO, user: User) {
        const newPost = this.postRepository.create({ ...post, author: user })
        await this.postRepository.save(newPost)
        this.postSearchService.indexPost(newPost)
        return newPost;
    }

    async deletePost(id: number) {
        const deletePost = await this.postRepository.delete(id)
        if (!deletePost.affected)
            throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

        await this.postSearchService.remove(id)
    }

    async searchForPosts(text: string, offset?: number, limit?: number) {
        const { result, count } = await this.postSearchService.search(text, offset, limit);
        const ids = result.map(rs => rs)
        console.log(ids)
        if (!ids.length) return []
        const items = this.postRepository.find({ where: { id: In(ids) } })
        return { items, count }
    }
}