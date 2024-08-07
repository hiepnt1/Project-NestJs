import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, Request, Res, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { RegisterDTO } from "./dto/register.dto";
import { LocalAuthenticationGuard } from "./guard/localAuthentication.guard";
import requestWithUser from "./interface/requesWithtUser.interface";
import { Response } from "express";
import { JwtAuthGuard } from "./guard/jwtAuthenticationGuard.guard";
import User from "../entity/user.entity";

@Controller('authentication')
// choose properties of our entities are exposed
@SerializeOptions({
    strategy: 'excludeAll'
})
export class AuthenticationController {
    constructor(
        private readonly authenticatonService: AuthenticationService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDTO) {
        return await this.authenticatonService.register(registrationData)
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Req() request: requestWithUser) {

        const userDataLogin = request.body;
        const user = await this.authenticatonService.login(userDataLogin.email, userDataLogin.password)
        // // sending token which is returned to the Set-Cookie header => use Response()
        if (user) {
            const cookie = this.authenticatonService.getCookieWithJwtToken(Number(user.id));
            request.res.setHeader("Set-Cookies", cookie)
            user.password = undefined;
            return user
        }

    }

    @UseGuards(JwtAuthGuard)
    @Post("log-out")
    async logOut(@Req() request: requestWithUser, @Res() response: Response, @Request() req) {
        response.setHeader("Set-Cookies", this.authenticatonService.getCookieForLogout())
        return response.sendStatus(200)
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