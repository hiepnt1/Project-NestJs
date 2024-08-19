import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import User from "./entity/user.entity";
import { Repository } from "typeorm";
import CreateUserDTO from "./CreateUser.dto";
import Address from "./entity/address.entity";
import * as bcrypt from 'bcrypt'
import { authenticator } from "otplib";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly prismaService: PrismaService
    ) {

    }

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

    // create a method for saving the hash of the current refresh token
    // make sure that we send both cookies when logging in => authController
    async setCurrentRefreshToken(refreshToken: string, userID: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userID, {
            currentHashedRefreshToken
        })
    }

    // handling the incoming refresh token
    public async getUserWithRefreshToken(refreshToken: string, userId: number) {
        const user = await this.getById(userId);
        const checkTokenMatch = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)

        if (checkTokenMatch) return true
        return false;
    }

    async removeRefreshToken(userId: number) {
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: null
        });
    }

    public async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        return this.userRepository.update(userId, {
            twoFactorAuthenticationSecret: secret
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return this.userRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true
        });
    }


}