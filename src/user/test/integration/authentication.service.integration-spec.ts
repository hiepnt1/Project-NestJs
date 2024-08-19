import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../../../authentication/authentication.service";
import { UserService } from "../../user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../../entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { mocksConfigService } from "../../../utils/mocks/config.service.mock";
import { JwtService } from "@nestjs/jwt";
// directly imports => using via jest.mock
import * as bcrypt from 'bcrypt'
import { mockedJwtService } from "../../../utils/mocks/jwt.mock";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AuthenticationController } from "src/authentication/authentication.controller";
jest.mock('bcrypt');
import * as request from 'supertest'

describe('The AuthenticationService', () => {
    let authenticationService: AuthenticationService;
    let userService: UserService;
    let bcryptCompare: jest.Mock;
    let findUser: jest.Mock;
    let app: INestApplication;
    let userData: User;
    const userMocker = {
        "id": 6,
        "email": "keke363@gmail.com",
        "name": "hihi",
        "password": "12345689",
        "address": {
            "id": 1,
            "street": "234 thanh xuan",
            "city": "hanoi",
            "country": "vietnam"
        }
    }

    beforeEach(async () => {
        userData = { ...userMocker }

        findUser = jest.fn().mockResolvedValue(userData);
        const userRepository = {
            findOne: findUser
        }
        bcryptCompare = jest.fn().mockReturnValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;

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
                    useValue: userRepository // mocked repository   
                }]
        }).compile();

        authenticationService = await moduleTest.get(AuthenticationService)
        userService = await moduleTest.get(UserService)
    })

    describe('when accessing the data of authenticating user', () => {
        it('should attempt to get a user by email', async () => {
            const getByEmailSpy = jest.spyOn(userService, 'findUserByEmail');
            await authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword');
            expect(getByEmailSpy).toBeCalledTimes(1);
        })
        describe('and the provided password is not valid', () => {
            beforeEach(() => {
                bcryptCompare.mockReturnValue(false);
            });
            it('should throw an error', async () => {
                await expect(
                    authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword')
                ).rejects.toThrow();
            })
        })
        describe('and the provided password is valid', () => {
            beforeEach(() => {
                bcryptCompare.mockReturnValue(true);
            });
            describe('and the user is found in the database', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(userData);
                })
                it('should return the user data', async () => {
                    const user = await authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword');
                    expect(user).toBe(userData);
                })
            })
            describe('and the user is not found in the database', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(undefined);
                })
                it('should throw an error', async () => {
                    await expect(
                        authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword')
                    ).rejects.toThrow();
                })
            })
        })
    })
})