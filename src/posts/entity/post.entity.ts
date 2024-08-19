import { Expose, Transform } from "class-transformer";
import User from "../../user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Category from "../../category/categories.entity";
import { CommentsEntity } from "src/comments/entity/comment.entity";

@Entity()

export class PostEntity {
    @PrimaryGeneratedColumn()
    @Expose()
    public id: number;

    @Column()
    @Expose()
    public title: string;

    @Column()
    @Expose()
    public content: string


    @Column({ nullable: true }) // can add null value
    // dont want save null value
    @Transform(value => {
        if (value !== null)
            return value;
    })
    @Expose()
    public category?: string

    @Index("post_authorId_index")
    @ManyToOne(() => User, (author: User) => author.posts)
    @Expose()
    public author: User

    @ManyToMany(() => Category, (category: Category) => category.posts)
    @JoinTable()
    public categories: Category[]

    @OneToMany(() => CommentsEntity, (comment: CommentsEntity) => comment.post)
    comments?: CommentsEntity[]
}