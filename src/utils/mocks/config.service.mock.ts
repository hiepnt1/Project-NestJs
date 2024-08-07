import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../../user/authentication/authentication.service"
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../../user/entity/user.entity";
import { mockedJwtService } from "./jwt.mock";

export const mocksConfigService = {
    get(key: string) {
        switch (key) {
            case "JWT_EXPIRATION_TIME":
                return '3600'
        }
    }
}

describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    beforeEach(async () => {
        const moduleTest = await Test.createTestingModule({

            providers: [AuthenticationService, UserService,
                {
                    provide: ConfigService,
                    useValue: mocksConfigService // mocked repository   
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {}
                }]
        }).compile();
        authenticationService = await moduleTest.get<AuthenticationService>(AuthenticationService)
    })

    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const userId = 1;
            expect(
                typeof authenticationService.getCookieWithJwtToken(userId)
            ).toEqual('string')
        })
    })
})