import { UserService } from "../user.service";
import { RegisterDTO } from "./dto/register.dto";
import * as bcrypt from 'bcrypt'
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import PostgresErrorCode from "../../database/postgresErrorCode.enum";

// Authentication means checking the identity of user. It provides an answer to a question: who is the user?
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtServcie: JwtService,
        private readonly configService: ConfigService
    ) { }

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtServcie.sign(payload)
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public async register(registrationData: RegisterDTO) {
        // decode-10 times
        const hashPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.userService.createUser({
                ...registrationData,
                password: hashPassword
            });
            createdUser.password = undefined; // the  cleanest way to not send the password in a response
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException("User with that email already exist", HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // compare password method
    private async verifyPwd(plainTextPwd: string, hashPwd: string) {
        const isPwdMatching = await bcrypt.compare(plainTextPwd, hashPwd);
        if (!isPwdMatching)
            throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST)
    }


    public async login(email: string, pwd: string) {
        try {
            const user = await this.userService.findUserByEmail(email);
            if (user) {
                await this.verifyPwd(pwd, user.password)
                user.password = undefined
                return user;
            }
            throw new HttpException("Wrong credentials provided1", HttpStatus.BAD_REQUEST)
        } catch (error) { throw new HttpException("Wrong credentials provided1", HttpStatus.BAD_REQUEST) }
    }

    // to remove the token from the browser, Since the cookies that we designed are  HttpOnly, we need to create an endpoint that clears it.
    public getCookieForLogout() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public async getAllUser() {
        return await this.userService.getAllUser()
    }
}