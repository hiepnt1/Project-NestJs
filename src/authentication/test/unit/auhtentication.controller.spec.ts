import { INestApplication, ValidationPipe } from "@nestjs/common"
import User from "../../../user/entity/user.entity";
import { Test } from "@nestjs/testing";
import { AuthenticationController } from "../../../authentication/authentication.controller";
import { UserService } from "../../../user/user.service";
import { AuthenticationService } from "../../../authentication/authentication.service";
import { ConfigService } from "@nestjs/config";
import { mocksConfigService } from "../../../utils/mocks/config.service.mock";
import { JwtService } from "@nestjs/jwt";
import { mockedJwtService } from "../../../utils/mocks/jwt.mock";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest'

const userModel = {
    id: 1,
    email: 'user@email.com',
    name: 'John',
    password: 'hash',
    address: {
        id: 1,
        street: 'streetName',
        city: 'cityName',
        country: 'countryName'
    }
}

describe('The AuthenticationController', () => {
    let app: INestApplication;
    let userData: User

    beforeEach(async () => {
        userData = { ...userModel }

        const userRepository = {
            create: jest.fn().mockResolvedValue(userData),
            save: jest.fn().mockReturnValue(Promise.resolve())
        }

        const testModule = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                UserService,
                AuthenticationService,
                {
                    provide: ConfigService,
                    useValue: mocksConfigService
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService
                }, {
                    provide: getRepositoryToken(User),
                    useValue: userRepository
                }
            ]
        }).compile()

        app = testModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init()
    })
    describe('when registering', () => {
        describe('and using valid data', () => {
            it('should respond with the data of the user without the password', () => {
                const expectedData = {
                    ...userData
                }
                delete expectedData.password;
                return request(app.getHttpServer())
                    .post('/authentication/register')
                    .send({
                        email: userModel.email,
                        name: userModel.name,
                        password: 'strongPassword'
                    })
                    .expect(201)
                    .expect(expectedData);
            })
        })
        describe('and using invalid data', () => {
            it('should throw an error', () => {
                return request(app.getHttpServer())
                    .post('/authentication/register')
                    .send({
                        name: userModel.name
                    })
                    .expect(400)
            })
        })
    })
})