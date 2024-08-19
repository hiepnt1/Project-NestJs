import { UserService } from "../../../user/user.service"
import { AuthenticationService } from "../../authentication.service"
import { Repository } from "typeorm"
import User from "../../../user/entity/user.entity"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { Test } from "@nestjs/testing"
import { UserModule } from "../../../user/user.module"
import * as Joi from "@hapi/joi"
import { DatabaseModule } from "../../../database/database.module"
import { getRepositoryToken } from "@nestjs/typeorm"
import { mocksConfigService } from "../../../utils/mocks/config.service.mock"
import { mockedJwtService } from "../../../utils/mocks/jwt.mock"


// creating test module
describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    beforeEach(async () => {
        const moduleTest = await Test.createTestingModule({
            providers: [AuthenticationService, UserService,
                {
                    provide: ConfigService,
                    useValue: mocksConfigService
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {} // mocked repository   
                }]
        }).compile();
        authenticationService = await moduleTest.get(AuthenticationService)
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
