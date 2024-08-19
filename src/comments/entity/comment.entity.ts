import { PostEntity } from "src/posts/entity/post.entity";
import User from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public content: string;

    @ManyToOne(() => PostEntity, (post: PostEntity) => post.comments)
    public post: PostEntity;

    @ManyToOne(() => User, (author: User) => author.posts)
    public author: User;
}