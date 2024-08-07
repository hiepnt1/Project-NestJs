import { Module } from "@nestjs/common";
import { UserModule } from "../user.module";
import { PassportModule } from "@nestjs/passport";
import { AuthenticationService } from "./authentication.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { AuthenticationController } from "./authentication.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../entity/user.entity";
import { UserService } from "../user.service";

@Module({
    imports: [UserModule, PassportModule, ConfigModule,
        // config JwtModule
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`
                }
            })
        })],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
    controllers: [AuthenticationController],
    exports: [JwtStrategy]
})

export class AuthenticationModule { }