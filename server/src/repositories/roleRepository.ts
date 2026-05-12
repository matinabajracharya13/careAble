import db from '@/db';

export const findRoleByName = async (role_name: string) => {
  return await db('roles').where({ role_name: role_name }).first();
};

export const findPublicRoles = async () => {
  return await db('roles').where({ is_public_signup: 1 }).select('role_id', 'role_name', 'description', 'label', 'icon_key');
};
