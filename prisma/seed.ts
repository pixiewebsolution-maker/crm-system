import { db as prisma } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  const passwordHash = await bcrypt.hash('DemoPassword123!', 10)

  const company = await prisma.company.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo SaaS Inc.',
      slug: 'demo-company',
      status: 'ACTIVE',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { passwordHash },
    create: {
      email: 'admin@demo.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      isSuperAdmin: false,
    },
  })

  await prisma.membership.upsert({
    where: { userId_companyId: { userId: admin.id, companyId: company.id } },
    update: {},
    create: {
      userId: admin.id,
      companyId: company.id,
      role: 'COMPANY_ADMIN',
    },
  })

  console.log('✅ Dummy data seeded!')
  console.log('Email: admin@demo.com')
  console.log('Password: DemoPassword123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
