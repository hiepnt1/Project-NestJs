import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/*
Guard is responsible for determining whether the route handler handles the request or not. In its nature
it is similar to Express.js middleware but is more powerful.
*/

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') { }