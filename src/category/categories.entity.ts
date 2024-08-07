import { Expose } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../posts/entity/post.entity';

@Entity()
class CategoryEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Expose()
    public name: string;

    @ManyToMany(() => PostEntity, (posts: PostEntity) => posts.categories)
    @Expose()
    public posts: PostEntity[]
}

export default CategoryEntity;