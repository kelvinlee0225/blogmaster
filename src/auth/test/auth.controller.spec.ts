import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { ServiceMock, requestMock } from '../../common/mock-data';
import { userOne } from '../../user/constant';
import { accessTockenOne } from '../constant';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation(() => accessTockenOne),
          },
        },
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token after giving the required parameters', async () => {
      const dto: LoginDto = {
        username: userOne.username,
        password: userOne.password,
      };

      const request = {
        ...requestMock(),
        user: {
          id: userOne.id,
          userType: userOne.userType,
        },
      };

      const result = await controller.login(dto, request);

      expect(result).toEqual(accessTockenOne);
    });
  });
});
