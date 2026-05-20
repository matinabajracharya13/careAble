import readline from 'readline';
import bcrypt from 'bcrypt';
import { createUser, findAuthUserByEmail } from '@/repositories/authRepository';
import { findRoleByName } from '@/repositories/roleRepository';
import { assignUserRole } from '@/repositories/userRoleRepository';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

const createAdmin = async () => {
  try {
    console.log('\n🚀 Create Admin User CLI\n');

    const email = await ask('Email: ');
    const password = await ask('Password: ');
    const first_name = await ask('First Name: ');
    const last_name = await ask('Last Name: ');

    const existing = await findAuthUserByEmail(email);

    if (existing) {
      console.log('❌ User already exists');
      process.exit(1);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const role = await findRoleByName('admin');

    if (!role) {
      console.log('❌ Admin role not found in roles table');
      process.exit(1);
    }

    const userId = await createUser({
      email,
      password_hash,
      first_name,
      last_name,
      email_verified: true,
      onboarding_completed: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    await assignUserRole(userId, role.role_id);

    console.log('\n✅ Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdmin();
