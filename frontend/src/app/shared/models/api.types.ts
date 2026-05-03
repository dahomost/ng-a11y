export type UserRole = 'PUBLIC' | 'LIBRARIAN' | 'ADMIN';

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CollectionDto {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string | null;
  publishedDate: string | null;
  isbn: string | null;
  language: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagDto {
  id: string;
  name: string;
}

export interface AuditLogDto {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
}
