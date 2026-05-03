import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuditLogQueryService } from '../services/auditLogQueryService';

const querySchema = z.object({
  entityType: z.string().min(1).optional(),
  entityId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export class AuditLogController {
  constructor(private readonly audit: AuditLogQueryService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const q = querySchema.parse(req.query);
    const logs = await this.audit.list({
      entityType: q.entityType,
      entityId: q.entityId,
      userId: q.userId,
    });
    res.status(200).json({ auditLogs: logs });
  };
}
