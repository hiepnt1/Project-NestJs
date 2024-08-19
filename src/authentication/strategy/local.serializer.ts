
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import User from 'src/user/entity/user.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(
        private readonly usersService: UserService,
    ) {
        super();
    }

    /*
        The serializeUser function determines the data stored inside of the session.
        In our case, we only store the id of the user.
    */
    serializeUser(user: User, done: CallableFunction) {
        done(null, user.id);
    }

    /**
     * 
     * The result of the deserializeUser function gets attached to the request object. 
     * By calling the usersService.getById function, we get the complete data of the logged-in user, 
     * and we can access it through request.user in the controller.
     */

    async deserializeUser(userId: string, done: CallableFunction) {
        const user = await this.usersService.getById(Number(userId))
        done(null, user);
    }
}