import db from '@/db';

export const findAllUsers = async (search?: string, limit = 20) => {
  const query = db('users as u')
    .leftJoin('user_roles as ur', 'u.user_id', 'ur.user_id')
    .leftJoin('roles as r', 'ur.role_id', 'r.role_id')
    .select(
      'u.user_id as id',
      db.raw("CONCAT(u.first_name, ' ', u.last_name) as name"),
      'u.email',
      'u.created_at',
      'u.is_active',
      'r.role_name'
    )
    .orderBy('u.created_at', 'desc')
    .limit(limit);

  // 🔍 SEARCH FILTER
  if (search && search.trim()) {
    query.where((qb) => {
      qb.whereRaw('LOWER(u.first_name) LIKE ?', [`%${search.toLowerCase()}%`])
        .orWhereRaw('LOWER(u.last_name) LIKE ?', [`%${search.toLowerCase()}%`])
        .orWhereRaw('LOWER(u.email) LIKE ?', [`%${search.toLowerCase()}%`]);
    });
  }

  return await query;
};
