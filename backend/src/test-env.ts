/** Jest bootstrap — provides required env before modules load */
process.env.DATABASE_URL ??=
  'postgresql://postgres:Endava@123@localhost:5432/library';
process.env.JWT_SECRET ??= 'test-jwt-secret-minimum-32-characters-long';
process.env.NODE_ENV ??= 'test';
