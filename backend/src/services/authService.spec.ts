/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import type { UserRepository } from '../repositories/userRepository';
import { AuthService } from './authService';

jest.mock('../utils/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed'),
  verifyPassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/jwt', () => ({
  signToken: jest.fn().mockReturnValue('jwt-token'),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { hashPassword, verifyPassword } = require('../utils/password') as {
  hashPassword: jest.Mock;
  verifyPassword: jest.Mock;
};

describe('AuthService', () => {
  const users = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  } as unknown as UserRepository;

  const service = new AuthService(users);

  beforeEach(() => {
    jest.clearAllMocks();
    verifyPassword.mockResolvedValue(true);
  });

  it('registers a new user', async () => {
    users.findByEmail = jest.fn().mockResolvedValue(null);
    users.create = jest.fn().mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashed',
      role: 'PUBLIC',
      createdAt: new Date(),
    });

    const out = await service.register('a@b.com', 'password123');

    expect(hashPassword).toHaveBeenCalledWith('password123');
    expect(users.create).toHaveBeenCalled();
    expect(out.token).toBe('jwt-token');
    expect(out.user.email).toBe('a@b.com');
    expect(out.user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate registration', async () => {
    users.findByEmail = jest.fn().mockResolvedValue({ id: 'x' });
    await expect(
      service.register('a@b.com', 'password123'),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('logs in with valid credentials', async () => {
    users.findByEmail = jest.fn().mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashed',
      role: 'LIBRARIAN',
      createdAt: new Date(),
    });

    const out = await service.login('a@b.com', 'password123');
    expect(verifyPassword).toHaveBeenCalled();
    expect(out.user.role).toBe('LIBRARIAN');
  });

  it('rejects unknown user', async () => {
    users.findByEmail = jest.fn().mockResolvedValue(null);
    await expect(
      service.login('a@b.com', 'password123'),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
