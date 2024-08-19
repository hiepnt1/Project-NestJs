
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 aim to verify the credentials provided by the user
 This is something the AuthGuard does out of the box 
 when the canActivate method is called by the user accessing the route.
*/
@Injectable()
export class LogInWithCredentialsGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // check the email and the password
        await super.canActivate(context);

        // initialize the session
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);

        // if no exceptions were thrown, allow the access to the route
        return true;
    }
}