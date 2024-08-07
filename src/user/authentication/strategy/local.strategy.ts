import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../authentication.service";
import User from "../../../user/entity/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authenticationService.login(email, password)
    }
}