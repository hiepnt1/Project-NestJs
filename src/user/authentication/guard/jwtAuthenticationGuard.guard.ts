import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// require our users to authenticate when sending requests to our API
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}