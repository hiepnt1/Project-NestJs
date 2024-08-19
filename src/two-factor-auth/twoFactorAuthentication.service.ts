import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { authenticator } from "otplib";
import User from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { toFileStream } from 'qrcode'

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) { }

    public async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri('nguyenthehiep3232@gmail.com', this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

        await this.userService.setTwoFactorAuthenticationSecret(secret, 1);

        return {
            secret,
            otpauthUrl
        }
    }

    public async pipeQrcodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl
        )
    }

    public isTwoFactorAuthValid(twoFactorCode: string,
        user: User) {
        return authenticator.verify({
            token: twoFactorCode,
            // secret: user.twoFactorAuthenticationSecret
            secret: ''
        })
    }
}