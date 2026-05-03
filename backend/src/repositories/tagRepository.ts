import type { Pool } from 'pg';
import type { Tag } from '../models';

interface TagRow {
  id: string;
  name: string;
}

export class TagRepository {
  constructor(private readonly db: Pool) {}

  async create(name: string): Promise<Tag> {
    const { rows } = await this.db.query<TagRow>(
      `INSERT INTO tags (name) VALUES ($1) RETURNING id, name`,
      [name.trim()],
    );
    return rows[0];
  }

  async findById(id: string): Promise<Tag | null> {
    const { rows } = await this.db.query<TagRow>(
      `SELECT id, name FROM tags WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async list(): Promise<Tag[]> {
    const { rows } = await this.db.query<TagRow>(
      `SELECT id, name FROM tags ORDER BY name ASC`,
    );
    return rows;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await this.db.query(`DELETE FROM tags WHERE id = $1`, [
      id,
    ]);
    return (rowCount ?? 0) > 0;
  }
}
