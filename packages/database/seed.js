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
        slug: 'default-local',
      }
    });
  }

  // Upsert user a@gmail.com
  const userA = await prisma.user.upsert({
    where: { email: 'a@gmail.com' },
    update: { passwordHash, tenantId: tenant.id },
    create: {
      email: 'a@gmail.com',
      passwordHash,
      firstName: 'Default',
      lastName: 'Admin',
      role: 'OWNER',
      tenantId: tenant.id
    }
  });

  const userMian = await prisma.user.upsert({
    where: { email: 'mian.sohaib@hotmail.com' },
    update: { passwordHash, tenantId: tenant.id },
    create: {
      email: 'mian.sohaib@hotmail.com',
      passwordHash,
      firstName: 'Mian',
      lastName: 'Sohaib',
      role: 'OWNER',
      tenantId: tenant.id
    }
  });

  console.log('Users created:', userA.email, userMian.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
