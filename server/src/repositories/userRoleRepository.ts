import db from '../db';

export const assignUserRole = async (userId: number, roleId: number) => {
  await db('user_roles').insert({
    user_id: userId,
    role_id: roleId,
    assigned_at: new Date(),
    assigned_by: null
  });
};
