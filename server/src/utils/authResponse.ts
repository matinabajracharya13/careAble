const mapUserResponse = (user: any) => ({
  user_id: user.user_id,
  first_name: user.first_name,
  last_name: user.last_name,
  name: `${user.first_name} ${user.last_name}`,
  email: user.email,
  phone: user.phone,
  dob: user.date_of_birth,
  postcode: user.postcode,
  role: user.role,
  onboarding_completed: Boolean(user.onboarding_completed),
  email_verified: Boolean(user.email_verified),
  created_at: user.created_at
});
