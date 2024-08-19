import { UserService } from "../user/user.service";
import { RegisterDTO } from "./dto/register.dto";
import * as bcrypt from 'bcrypt'
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import PostgresErrorCode from "../database/postgresErrorCode.enum";
import { TokenPayload } from "./interface/tokenPayload.interface";

// Authentication means checking the identity of user. It provides an answer to a question: who is the user?
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtServcie: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async register(registrationData: RegisterDTO) {
        // decode-10 times
        const hashPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.userService.createUser({
                ...registrationData,
                password: hashPassword
            });

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

    // create a function for creating a method for creating a cookie with the refresh token
    public async getCookieWithAccessToken(userId: number, isSecondFactorAuthenticated = false) {
        const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
        const token = this.jwtServcie.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }

    public async getCookieWithRefreshToken(userId: number, isSecondFactorAuthenticated = false) {
        const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
        const tokenRefresh = this.jwtServcie.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`
        });
        const cookie = `Refresh=${tokenRefresh}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
            cookie,
            tokenRefresh
        }
    }


    public async getAuthenticatedUser(email: string, pwd: string) {
        try {
            const user = await this.userService.findUserByEmail(email);
            await this.verifyPwd(pwd, user.password)
            user.password = undefined
            return user;
        } catch (error) { throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST) }
    }

    // to remove the token from the browser, Since the cookies that we designed are  HttpOnly, we need to create an endpoint that clears it.
    public getCookieForLogout() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }

    public async getAllUser() {
        return await this.userService.getAllUser()
    }
}