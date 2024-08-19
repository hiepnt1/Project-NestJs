import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../authentication.service";
import User from "../../user/entity/user.entity";

/*
    Passport calls the validate function for every strategy.
    For the local strategy, Passports requires a username and a password.
    Our application uses email as the username.
*/
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authenticationService.getAuthenticatedUser(email, password)
    }
}