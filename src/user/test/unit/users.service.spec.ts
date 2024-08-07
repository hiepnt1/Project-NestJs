import { Test } from "@nestjs/testing";
import { UserService } from "../../user.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../../entity/user.entity";


// To change our implementation between tests, we can use  jest.Mock.
describe("The UsersService", () => {
    let userService: UserService;
    let findOne: jest.Mock;
    const userMock = {
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
        findOne = jest.fn();
        const moduleTest = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: findOne
                }
            ]
        }).compile();
        userService = await moduleTest.get(UserService)
    })
    describe('when getting a user by email', () => {
        describe('and the user is matched', () => {
            let user: User;
            beforeEach(() => {
                user = new User();
                findOne.mockReturnValue(Promise.resolve(user));
            })
            it('should return the user', async () => {
                const fetchedUser = await userService.findUserByEmail('test@test.com');
                expect(fetchedUser).toEqual(userMock);
            })
        })
        describe('and the user is not matched', () => {
            beforeEach(() => {
                findOne.mockReturnValue(undefined);
            })
            it('should throw an error', async () => {
                await expect(userService.findUserByEmail('test@test.com')).rejects.toThrow();
            })
        })
    })
})