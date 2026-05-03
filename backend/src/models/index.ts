/** Domain roles enforced by RBAC middleware */
export type UserRole = 'PUBLIC' | 'LIBRARIAN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export interface Collection {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  publishedDate: string | null;
  isbn: string | null;
  language: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface CollectionTag {
  collectionId: string;
  tagId: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: Date;
}
