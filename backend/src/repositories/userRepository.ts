import type { Pool, PoolClient } from 'pg';
import type { User, UserRole } from '../models';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
  };
}

export class UserRepository {
  constructor(private readonly db: Pool) {}

  async create(
    input: { email: string; passwordHash: string; role: UserRole },
    client?: PoolClient,
  ): Promise<User> {
    const runner = client ?? this.db;
    const { rows } = await runner.query<UserRow>(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, password_hash, role, created_at`,
      [input.email.toLowerCase(), input.passwordHash, input.role],
    );
    return mapUser(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1`,
      [email.toLowerCase()],
    );
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT id, email, password_hash, role, created_at FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async list(): Promise<Omit<User, 'passwordHash'>[]> {
    interface PublicRow {
      id: string;
      email: string;
      role: UserRole;
      created_at: Date;
    }
    const { rows } = await this.db.query<PublicRow>(
      `SELECT id, email, role, created_at FROM users ORDER BY created_at DESC`,
    );
    return rows.map((r: PublicRow) => ({
      id: r.id,
      email: r.email,
      role: r.role,
      createdAt: r.created_at,
    }));
  }

  async update(
    id: string,
    patch: Partial<{ email: string; passwordHash: string; role: UserRole }>,
  ): Promise<User | null> {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let i = 1;
    if (patch.email !== undefined) {
      sets.push(`email = $${i++}`);
      vals.push(patch.email.toLowerCase());
    }
    if (patch.passwordHash !== undefined) {
      sets.push(`password_hash = $${i++}`);
      vals.push(patch.passwordHash);
    }
    if (patch.role !== undefined) {
      sets.push(`role = $${i++}`);
      vals.push(patch.role);
    }
    if (sets.length === 0) {
      return this.findById(id);
    }
    vals.push(id);
    const { rows } = await this.db.query<UserRow>(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${i}
       RETURNING id, email, password_hash, role, created_at`,
      vals,
    );
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `DELETE FROM users WHERE id = $1`,
      [id],
    );
    return (rowCount ?? 0) > 0;
  }
}
