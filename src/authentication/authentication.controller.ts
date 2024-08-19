import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, Request, Res, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { RegisterDTO } from "./dto/register.dto";
import { LocalAuthenticationGuard } from "./guard/localAuthentication.guard";
import requestWithUser from "./interface/requesWithtUser.interface";
import { Response } from "express";
import { JwtAuthGuard } from "./guard/jwtAuthenticationGuard.guard";
import User from "../user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { JwtRefreshTokenGuard } from "./strategy/jwtRefreshGuard.guard";
import { LogInWithCredentialsGuard } from "./guard/logInWithCredentialsGuard";
import { CookieAuthenticationGuard } from "./guard/cookieAuthentication.guard";

@Controller('authentication')
// choose properties of our entities are showed when get data
@SerializeOptions({
    strategy: 'excludeAll'
})
export class AuthenticationController {
    constructor(
        private readonly authenticatonService: AuthenticationService,
        private readonly userService: UserService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDTO) {
        return await this.authenticatonService.register(registrationData)
    }

    //refresh token
    @UseGuards(JwtRefreshTokenGuard)
    @Get('refresh')
    async refresh(@Req() request: requestWithUser) {
        const accessTokenCookie = await this.authenticatonService.getCookieWithAccessToken(request.user.id);

        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }

    // login with token
    //make sure that we send both cookies when logging in
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async login(@Req() request: requestWithUser) {

        const { user } = request;
        const accessTokenCookie = await this.authenticatonService.getCookieWithAccessToken(Number(user.id));
        const {
            cookie: refreshTokenCookie,
            tokenRefresh: refreshToken
        } = await this.authenticatonService.getCookieWithRefreshToken(user.id);
        await this.userService.setCurrentRefreshToken(refreshToken, user.id)

        request.res.setHeader("Set-Cookies", [accessTokenCookie, refreshTokenCookie])

        if (user.isTwoFactorAuthenticationEnabled) return;
        return user
    }

    // login with session
    @HttpCode(200)
    @UseGuards(LogInWithCredentialsGuard)
    @Post('log-in-session')
    async loginSS(@Req() request: requestWithUser) {
        return request.user;
    }


    @HttpCode(200)
    @UseGuards(CookieAuthenticationGuard)
    @Get()
    async authenticateSS(@Req() request: requestWithUser) {
        return request.user;
    }

    @HttpCode(200)
    @UseGuards(CookieAuthenticationGuard)
    @Post('log-out')
    async logOutSS(@Req() request: requestWithUser) {
        request.logOut;
        request.session.cookie.maxAge = 0;
    }


    //logout with token
    @UseGuards(JwtAuthGuard)
    @Post("log-out")
    @HttpCode(200)
    async logOutTK(@Req() request: requestWithUser) {
        await this.userService.removeRefreshToken(request.user.id)
        request.res.setHeader("Set-Cookies", this.authenticatonService.getCookieForLogout())
    }

    @Get()
    async getAlluser() {
        return this.authenticatonService.getAllUser()
    }

    // verifying JSON Web Tokens and returning user data
    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() req: requestWithUser) {
        const user = req.user;
        user.password = undefined;
        return user;
    }

}