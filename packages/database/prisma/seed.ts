import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default AI Restaurant',
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@airestaurant.com',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  })

  console.log('Seed executed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
