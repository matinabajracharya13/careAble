import db from '@/db';

export const findAllUsers = async () => {
  return await db('users as u')
    .leftJoin('user_roles as ur', 'u.user_id', 'ur.user_id')
    .leftJoin('roles as r', 'ur.role_id', 'r.role_id')
    .select(
      'u.user_id as id',
      db.raw("CONCAT(u.first_name, ' ', u.last_name) as name"),
      'u.email',
      'u.created_at',
      'u.is_active',
      'r.role_name'
    );
};
