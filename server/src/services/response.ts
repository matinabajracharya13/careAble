const userResponse = (user: any) => {
  const { user_id, email, created_at, first_name, last_name, phone, dob, postcode, role, onboarding_completed, email_verified } = user;

  return {
    user_id,
    first_name,
    last_name,
    name: `${first_name} ${last_name}`,
    email,
    phone,
    date_of_birth:user.date_of_birth,
    postcode,
    role,
    created_at,
    onboarding_completed: Boolean(onboarding_completed),
    email_verified: Boolean(email_verified)
  };
};

export default userResponse;
