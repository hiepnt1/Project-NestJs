import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../../../user/authentication/authentication.service";
import { UserService } from "../../../user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../../../user/entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { mocksConfigService } from "../../../utils/mocks/config.service.mock";
import { JwtService } from "@nestjs/jwt";
// directly imports => using via jest.mock
import * as bcrypt from 'bcrypt'
import { mockedJwtService } from "../../../utils/mocks/jwt.mock";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AuthenticationController } from "src/user/authentication/authentication.controller";
jest.mock('bcrypt');
import * as request from 'supertest'

describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    let userService: UserService;
    let bcryptCompare: jest.Mock;
    let findUser: jest.Mock;
    let app: INestApplication;
    const userMocker = {
        "id": 6,
        "email": "keke363@gmail.com",
        "name": "hihi",
        "address": {
            "id": 1,
            "street": "234 thanh xuan",
            "city": "hanoi",
            "country": "vietnam"
        }
    }
    beforeEach(async () => {
        const usersRepository = {
            create: jest.fn().mockResolvedValue(userMocker),
            save: jest.fn().mockReturnValue(Promise.resolve())
        }

        bcryptCompare = jest.fn().mockReturnValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;



        findUser = jest.fn().mockReturnValue(true);
        const userRepository = {
            findOne: findUser
        }

        const moduleTest = await Test.createTestingModule({
            controllers: [AuthenticationController],
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
                    useValue: usersRepository // mocked repository   
                }]
        }).compile();
        app = moduleTest.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init();
        authenticationService = await moduleTest.get(AuthenticationService)
        userService = await moduleTest.get(UserService)
    })

    describe('when accessing the data of authenticating user', () => {
        describe('and the provided password is not valid', () => {
            beforeEach(() => {
                bcryptCompare.mockReturnValue(false);
            });
            it('should throw an error', async () => {
                await expect(
                    authenticationService.login('user@email.com', 'strongPassword')
                ).rejects.toThrow();
            })
        })
        describe('and the provided password is valid', () => {
            beforeEach(() => {
                bcryptCompare.mockReturnValue(true);
            });
            describe('and the user is found in the database', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(userMocker);
                })
                it('should return the user data', async () => {
                    const user = await authenticationService.login('user@email.com', 'strongPassword');
                    expect(user).toBe(userMocker);
                })
            })
            describe('and the user is not found in the database', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(undefined);
                })
                it('should throw an error', async () => {
                    await expect(
                        authenticationService.login('user@email.com', 'strongPassword')
                    ).rejects.toThrow();
                })
            })
        })
    })


    describe('when registering', () => {
        describe('and using valid data', () => {
            it('should respond with the data of the user without the password', () => {
                const expectedData = {
                    ...userMocker
                }
                return request(app.getHttpServer())
                    .post('/authentication/register')
                    .send({
                        email: userMocker.email,
                        name: userMocker.name,
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
                        name: userMocker.name
                    })
                    .expect(400)
            })
        })
    })
})