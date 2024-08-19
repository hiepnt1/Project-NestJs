import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { TwoFactorAuthService } from "./twoFactorAuthentication.service";
import { JwtAuthGuard } from "src/authentication/guard/jwtAuthenticationGuard.guard";
import { Response } from "express";
import requestWithUser from "src/authentication/interface/requesWithtUser.interface";
import { TwoFactorAuthenticationCodeDto } from "./twoFactorAuthCode.dto";
import { UserService } from "src/user/user.service";
import { AuthenticationService } from "src/authentication/authentication.service";


@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorService: TwoFactorAuthService,
        private readonly userService: UserService,
        private readonly authenticationService: AuthenticationService
    ) { }

    @Post('generate')
    // @UseGuards(JwtAuthGuard)
    async register(@Res() response: Response, @Req() req: requestWithUser) {
        const { otpauthUrl } = await this.twoFactorService.generateTwoFactorAuthenticationSecret(req.user);
        return this.twoFactorService.pipeQrcodeStream(response, otpauthUrl)
    }

    @Get('turn-on')
    // @UseGuards(JwtAuthGuard)
    async TurnOnTwoFactorAuth(
        @Req() request: requestWithUser,
        @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.twoFactorService.isTwoFactorAuthValid(twoFactorAuthenticationCode, request.user);
        if (!isCodeValid) throw new UnauthorizedException('Wrong authentication code');

        await this.userService.turnOnTwoFactorAuthentication(request.user.id)
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
        @Req() request: requestWithUser,
        @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.twoFactorService.isTwoFactorAuthValid(
            twoFactorAuthenticationCode, request.user
        );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        const accessTokenCookie = await this.authenticationService.getCookieWithAccessToken(request.user.id, true);

        request.res.setHeader('Set-Cookie', [accessTokenCookie]);

        return request.user;
    }
}