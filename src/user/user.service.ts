import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import User from "./entity/user.entity";
import { Repository } from "typeorm";
import CreateUserDTO from "./CreateUser.dto";
import Address from "./entity/address.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async getAllUser() {
        const users = await this.userRepository.find();
        if (users) return users;
        else
            throw new HttpException("Users empty", HttpStatus.BAD_REQUEST)
    }

    async findUserByEmail(email: string) {

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new HttpException('User with this email not exist', HttpStatus.NOT_FOUND)
        }
        return user;

    }

    async createUser(userData: CreateUserDTO) {
        const newUser = this.userRepository.create(userData)
        await this.userRepository.save({ ...newUser });
        return newUser
    }

    async getById(id: number) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (user)
            return user;

        throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND)
    }

    async deleteAll() {
        await this.userRepository.delete
    }

}