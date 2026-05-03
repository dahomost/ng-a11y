import type { Pool } from 'pg';
import type { Tag } from '../models';

interface TagRow {
  id: string;
  name: string;
}

export class CollectionTagRepository {
  constructor(private readonly db: Pool) {}

  async add(collectionId: string, tagId: string): Promise<void> {
    await this.db.query(
      `INSERT INTO collection_tags (collection_id, tag_id) VALUES ($1, $2)
       ON CONFLICT (collection_id, tag_id) DO NOTHING`,
      [collectionId, tagId],
    );
  }

  async listByCollection(collectionId: string): Promise<Tag[]> {
    const { rows } = await this.db.query<TagRow>(
      `SELECT t.id, t.name
       FROM tags t
       INNER JOIN collection_tags ct ON ct.tag_id = t.id
       WHERE ct.collection_id = $1
       ORDER BY t.name ASC`,
      [collectionId],
    );
    return rows;
  }

  async remove(collectionId: string, tagId: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `DELETE FROM collection_tags WHERE collection_id = $1 AND tag_id = $2`,
      [collectionId, tagId],
    );
    return (rowCount ?? 0) > 0;
  }
}
