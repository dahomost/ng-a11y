import type { AuditLog } from '../models';
import type { AuditLogRepository } from '../repositories/auditLogRepository';

export class AuditLogQueryService {
  constructor(private readonly auditLogs: AuditLogRepository) {}

  async list(filters: {
    entityType?: string;
    entityId?: string;
    userId?: string;
  }): Promise<AuditLog[]> {
    return this.auditLogs.list(filters);
  }
}
