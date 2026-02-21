import { passwordHasher } from '../../utils/passwordHasher.js';

/**
 * Seed the database with initial data
 * @param { import("knex").Knex } knex
 */
export const seed = async (knex) => {
  // Clear existing data in reverse dependency order
  await knex('users').del();
  await knex('roles').del();

  // Create roles
  const roles = [
    { name: 'super_admin', description: 'System owner with full access' },
    { name: 'admin', description: 'Manager with elevated access' },
    { name: 'user', description: 'Regular staff member' },
  ];

  const createdRoles = await knex('roles').insert(roles).returning('*');
  const roleMap = createdRoles.reduce((acc, role) => {
    acc[role.name] = role.id;
    return acc;
  }, {});

  // Create users
  const passwordHash = await passwordHasher.hash('Admin@123');

  // super_admin
  const [superAdmin] = await knex('users')
    .insert({
      email: 'admin@example.com',
      passwordHash: passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      roleId: roleMap['super_admin'],
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    })
    .returning('*');

  console.log(`Created super admin: ${superAdmin.email} (${superAdmin.id})`);

  // admin
  const [admin] = await knex('users')
    .insert({
      email: 'manager@example.com',
      passwordHash: passwordHash,
      firstName: 'Manager',
      lastName: 'User',
      role: 'admin',
      roleId: roleMap['admin'],
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    })
    .returning('*');

  console.log(`Created admin: ${admin.email} (${admin.id})`);

  // regular user
  const [user] = await knex('users')
    .insert({
      email: 'user@example.com',
      passwordHash: passwordHash,
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      roleId: roleMap['user'],
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    })
    .returning('*');

  console.log(`Created user: ${user.email} (${user.id})`);

  console.log('\n✅ Database seeded successfully with camelCase identifiers!');
  console.log('\nDefault credentials:');
  console.log('  Email: admin@example.com (Super Admin)');
  console.log('  Email: manager@example.com (Admin)');
  console.log('  Email: user@example.com (User)');
  console.log('  Password: Admin@123 (for all users)');
};
