const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'a@gmail.com';
  const plainPassword = 'a';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // First create a default tenant for this user
  let tenant = await prisma.tenant.findFirst({ where: { name: 'Default Local Tenant' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Default Local Tenant',
        slug: 'default-local-tenant',
      }
    });
  }

  // Upsert the user
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      firstName: 'Default',
      lastName: 'Admin',
      role: 'OWNER',
      tenantId: tenant.id
    }
  });

  console.log('User created:', user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
