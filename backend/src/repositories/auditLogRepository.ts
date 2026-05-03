import type { Pool } from 'pg';
import type { AuditLog } from '../models';

interface AuditRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: Date;
}

function map(row: AuditRow): AuditLog {
  return {
    id: row.id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    userId: row.user_id,
    metadata: row.metadata,
    timestamp: row.timestamp,
  };
}

export class AuditLogRepository {
  constructor(private readonly db: Pool) {}

  async insert(entry: {
    action: string;
    entityType: string;
    entityId: string | null;
    userId: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<AuditLog> {
    const { rows } = await this.db.query<AuditRow>(
      `INSERT INTO audit_logs (action, entity_type, entity_id, user_id, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        entry.action,
        entry.entityType,
        entry.entityId,
        entry.userId,
        entry.metadata ?? null,
      ],
    );
    return map(rows[0]);
  }

  async list(filters: {
    entityType?: string;
    entityId?: string;
    userId?: string;
  }): Promise<AuditLog[]> {
    const cond: string[] = [];
    const vals: unknown[] = [];
    let i = 1;
    if (filters.entityType) {
      cond.push(`entity_type = $${i++}`);
      vals.push(filters.entityType);
    }
    if (filters.entityId) {
      cond.push(`entity_id = $${i++}`);
      vals.push(filters.entityId);
    }
    if (filters.userId) {
      cond.push(`user_id = $${i++}`);
      vals.push(filters.userId);
    }
    const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
    const { rows } = await this.db.query<AuditRow>(
      `SELECT * FROM audit_logs ${where} ORDER BY timestamp DESC LIMIT 500`,
      vals,
    );
    return rows.map(map);
  }
}
