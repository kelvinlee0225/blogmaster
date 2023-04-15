import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { accessTockenOne } from '../constant';
import { UserService } from '../../user/user.service';
import { ServiceMock } from '../../common/mock-data';
import { userOne, userTwo } from '../../user/constant';
import * as bcrypt from 'bcrypt';
import { NotAcceptableException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockImplementation((pastPassword, userPassword) => {
    if (pastPassword === userPassword) return true;
    return false;
  }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .fn()
              .mockImplementation(() => accessTockenOne.access_token),
          },
        },
        {
          provide: UserService,
          useValue: {
            ...ServiceMock,
            findOne: jest.fn().mockImplementation(() => userOne),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return an user data without the password with the given parameter', async () => {
      const dto = {
        username: userOne.username,
        password: userOne.password,
      };

      const result = await service.validateUser(dto.username, dto.password);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expected } = userOne;

      expect(userService.findOne).toHaveBeenLastCalledWith(
        { username: dto.username },
        true,
      );
      expect(bcrypt.compare).toHaveBeenLastCalledWith(
        dto.password,
        userOne.password,
      );
      expect(result).toEqual(expected);
    });

    it('should throw an NotAcceptableException with the given parameter', async () => {
      expect.assertions(3);
      const dto = {
        username: userOne.username,
        password: userTwo.password,
      };
      try {
        await service.validateUser(dto.username, dto.password);
      } catch (e) {
        expect(userService.findOne).toHaveBeenLastCalledWith(
          { username: userOne.username },
          true,
        );
        expect(bcrypt.compare).toHaveBeenLastCalledWith(
          dto.password,
          userOne.password,
        );
        expect(e).toEqual(
          new NotAcceptableException('The username and password do not match'),
        );
      }
    });
  });

  describe('login', () => {
    it('should return an object with an access token with the given parameter', async () => {
      const payload = {
        username: userOne.username,
        sub: userOne.id,
        userType: userOne.userType,
      };

      const result = await service.login(
        userOne.username,
        userOne.password,
        userOne,
      );

      expect(jwtService.sign).toHaveBeenLastCalledWith(payload);
      expect(result).toEqual(accessTockenOne);
    });
  });
});
