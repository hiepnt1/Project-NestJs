import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "src/authentication/interface/tokenPayload.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-2-factor') {
    constructor(
        private readonly userServie: UserService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET')
        })
    }

    async validate(payload: TokenPayload) {
        const user = await this.userServie.getById(payload.userId);
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }

}