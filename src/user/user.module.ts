import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./entity/user.entity";
import { UserService } from "./user.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PrismaModule],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }