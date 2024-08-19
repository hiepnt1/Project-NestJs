import { TwoFactorAuthService } from "./twoFactorAuthentication.service";
import { TwoFactorAuthController } from "./twoFactorAuthentication.moule";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthenticationModule } from "src/authentication/authentication.module";
import JwtTwoFactorGuard from "./jwtTwoGuard.guard";
import { JwtTwoFactorStrategy } from "./strategy/jwtTwoFactorStrategy.strategy";

@Module({
    providers: [TwoFactorAuthService, JwtTwoFactorGuard, JwtTwoFactorStrategy],
    imports: [UserModule, AuthenticationModule],
    controllers: [TwoFactorAuthController]
})
export class TwoFactorAuthModule { }