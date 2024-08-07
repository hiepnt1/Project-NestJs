import { UserService } from "../../../user.service"
import { AuthenticationService } from "../../authentication.service"
import { Repository } from "typeorm"
import User from "../../../entity/user.entity"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { Test } from "@nestjs/testing"
import { UserModule } from "../../../user.module"
import * as Joi from "@hapi/joi"
import { DatabaseModule } from "../../../../database/database.module"
import { getRepositoryToken } from "@nestjs/typeorm"


// creating test module
describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    beforeEach(async () => {
        const moduleTest = await Test.createTestingModule({
            imports: [
                UserModule,
                ConfigModule.forRoot({
                    validationSchema: Joi.object({
                        POSTGRES_HOST: Joi.string().required(),
                        POSTGRES_PORT: Joi.number().required(),
                        POSTGRES_USER: Joi.string().required(),
                        POSTGRES_PASSWORD: Joi.string().required(),
                        POSTGRES_DB: Joi.string().required(),
                        JWT_SECRET: Joi.string().required(),
                        JWT_EXPIRATION_TIME: Joi.string().required(),
                        PORT: Joi.number(),
                    })
                }), DatabaseModule,
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get('JWT_SECRET'),
                        signOptions: {
                            expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
                        },
                    })
                })
            ],
            providers: [AuthenticationService, UserService, {
                provide: getRepositoryToken(User),
                useValue: {} // mocked repository   
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
