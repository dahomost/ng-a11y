import type { AuditLogRepository } from '../repositories/auditLogRepository';

/** Central place to append immutable audit trail rows */
export class AuditService {
  constructor(private readonly auditLogs: AuditLogRepository) {}

  async record(params: {
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: string;
    entityId: string | null;
    userId: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    await this.auditLogs.insert({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      userId: params.userId,
      metadata: params.metadata ?? null,
    });
  }
}
