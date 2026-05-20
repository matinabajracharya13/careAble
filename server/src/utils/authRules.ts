export const loginRules = {
  admin: {
    allowPublicSignup: false,
    allowedRoles: ['admin']
  },
  user: {
    allowPublicSignup: true,
    allowedRoles: ['carer', 'employer']
  }
};
