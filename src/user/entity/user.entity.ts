import { Exclude, Expose } from "class-transformer";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Address from "./address.entity";
import { PostEntity } from "../../posts/entity/post.entity";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    @Expose() // show 
    public id?: number

    @Column({ unique: true })
    @Expose()
    public email: string

    @Column()
    @Expose()
    public name: string

    @Column()
    @Exclude() // for use this we must add ClassSerializerInterceptor in controllers => useglobal in main
    // hide
    public password: string

    // add eager: true => always to be included => every time we fetch users, we also get their addresses
    // Only one side of the relationship can be eager.
    // turn on the cascade option => we can save an address while saving a user.
    @OneToOne(() => Address, { eager: true, cascade: true })
    @JoinColumn()
    @Expose()
    public address: Address

    @OneToMany(() => PostEntity, (post: PostEntity) => { post.author })
    public posts: PostEntity

}