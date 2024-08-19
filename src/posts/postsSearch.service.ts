import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { PostEntity } from "./entity/post.entity";
import { PostSearchBody } from "./types/postSearchBody.interface";
import { PostSearchResult } from "./types/postsSearchResult.interface";
import { count } from "console";
import PostCountResult from "./types/postCountBody.interface";

@Injectable()
export default class PostSearchService {

    index = 'posts';
    constructor(
        private readonly elasticSearchService: ElasticsearchService
    ) {
    }

    async indexPost(post: PostEntity) {
        return this.elasticSearchService.index({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id
            }
        })

    }

    async count(query: string, fields: string[]) {
        const body = await this.elasticSearchService.count({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query, fields
                    }
                }
            }
        })
        return body.count;
    }

    async search(text: string, offset?: number, limit?: number, startId = 0) {
        // elasticsearchService.search is that it returns just the properties that we’ve put into the Elasticsearch database
        try {

            const body = await this.elasticSearchService.search<PostSearchResult>({
                index: this.index,
                from: offset,
                size: limit,
                body: {
                    query: {
                        bool: {
                            should: {
                                multi_match: {
                                    query: text,
                                    fields: ['title', 'content'] // search for multi properties
                                }
                            },
                            filter: {
                                range: {
                                    id: {
                                        gt: startId
                                    }
                                }
                            }
                        }
                    }, sort: {
                        id: {
                            order: 'asc'
                        }
                    }
                }
            })
            const count = body.hits.total;
            const hits = body.hits.hits
            const result = hits.map((item) => item._source);
            return {
                count,
                result
            }
        } catch (error) {
            console.error('Elasticsearch error:', error);
            throw error;
        }
    }

    async remove(postId: number) {
        this.elasticSearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: postId
                    }
                }
            }
        })
    }

    async update(post: PostEntity) {
        const newBody: PostSearchBody = {
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author.id
        }

        const script = Object.entries(newBody).reduce((result, [key, value]) => {
            return `${result} ctx._source.${key}='${value}';`;
        }, '');

        return this.elasticSearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: post.id,
                    }
                },
                script: script
            }
        })
    }


}