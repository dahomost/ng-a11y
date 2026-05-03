/* eslint-disable @typescript-eslint/unbound-method */
import type { Request, Response } from 'express';
import type { UserService } from '../services/userService';
import { UserController } from './userController';

function mockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('UserController', () => {
  const users = {
    create: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as UserService;

  const controller = new UserController(users);

  it('lists users', async () => {
    users.list = jest
      .fn()
      .mockResolvedValue([
        { id: '1', email: 'a@b.com', role: 'ADMIN', createdAt: new Date() },
      ]);
    const req = { user: { id: 'admin' } } as Request;
    const res = mockRes();
    await controller.list(req, res);
    expect(res.status as jest.Mock).toHaveBeenCalledWith(200);
    expect(res.json as jest.Mock).toHaveBeenCalledWith({
      users: [
        {
          id: '1',
          email: 'a@b.com',
          role: 'ADMIN',
          createdAt: expect.any(Date) as Date,
        },
      ],
    });
  });

  it('creates user', async () => {
    users.create = jest.fn().mockResolvedValue({
      id: '2',
      email: 'c@d.com',
      role: 'PUBLIC',
      createdAt: new Date(),
    });
    const req = {
      user: { id: 'admin' },
      body: { email: 'c@d.com', password: 'secret1234', role: 'PUBLIC' },
    } as unknown as Request;
    const res = mockRes();
    await controller.create(req, res);
    expect(users.create as jest.Mock).toHaveBeenCalledWith('admin', {
      email: 'c@d.com',
      password: 'secret1234',
      role: 'PUBLIC',
    });
    expect(res.status as jest.Mock).toHaveBeenCalledWith(201);
  });
});
