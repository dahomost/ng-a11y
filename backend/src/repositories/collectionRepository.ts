import type { Pool } from 'pg';
import type { Collection } from '../models';

interface CollectionRow {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  published_date: string | null;
  isbn: string | null;
  language: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    category: row.category,
    publishedDate: row.published_date,
    isbn: row.isbn,
    language: row.language,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CollectionCreateInput = Omit<
  Collection,
  'id' | 'createdAt' | 'updatedAt'
>;
export type CollectionUpdateInput = Partial<
  Pick<
    Collection,
    | 'title'
    | 'author'
    | 'description'
    | 'category'
    | 'publishedDate'
    | 'isbn'
    | 'language'
  >
>;

export class CollectionRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CollectionCreateInput): Promise<Collection> {
    const { rows } = await this.db.query<CollectionRow>(
      `INSERT INTO collections (
        title, author, description, category, published_date, isbn, language, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        input.title,
        input.author,
        input.description,
        input.category,
        input.publishedDate,
        input.isbn,
        input.language,
        input.createdBy,
      ],
    );
    return mapCollection(rows[0]);
  }

  async findById(id: string): Promise<Collection | null> {
    const { rows } = await this.db.query<CollectionRow>(
      `SELECT * FROM collections WHERE id = $1`,
      [id],
    );
    return rows[0] ? mapCollection(rows[0]) : null;
  }

  async list(): Promise<Collection[]> {
    const { rows } = await this.db.query<CollectionRow>(
      `SELECT * FROM collections ORDER BY updated_at DESC`,
    );
    return rows.map(mapCollection);
  }

  async update(
    id: string,
    patch: CollectionUpdateInput,
  ): Promise<Collection | null> {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let i = 1;
    const add = (col: string, val: unknown) => {
      sets.push(`${col} = $${i++}`);
      vals.push(val);
    };
    if (patch.title !== undefined) add('title', patch.title);
    if (patch.author !== undefined) add('author', patch.author);
    if (patch.description !== undefined) add('description', patch.description);
    if (patch.category !== undefined) add('category', patch.category);
    if (patch.publishedDate !== undefined)
      add('published_date', patch.publishedDate);
    if (patch.isbn !== undefined) add('isbn', patch.isbn);
    if (patch.language !== undefined) add('language', patch.language);
    if (sets.length === 0) {
      return this.findById(id);
    }
    vals.push(id);
    const { rows } = await this.db.query<CollectionRow>(
      `UPDATE collections SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      vals,
    );
    return rows[0] ? mapCollection(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `DELETE FROM collections WHERE id = $1`,
      [id],
    );
    return (rowCount ?? 0) > 0;
  }
}
