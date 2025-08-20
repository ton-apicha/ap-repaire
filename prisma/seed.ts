import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aprepair.com' },
    update: {},
    create: {
      email: 'admin@aprepair.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+66 81 234 5678',
        company: 'Mining Corp',
        address: 'Bangkok, Thailand',
        createdBy: adminUser.id,
      },
    }),
    prisma.customer.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+66 82 345 6789',
        company: 'Crypto Solutions',
        address: 'Chiang Mai, Thailand',
        createdBy: adminUser.id,
      },
    }),
    prisma.customer.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+66 83 456 7890',
        company: 'Digital Mining',
        address: 'Phuket, Thailand',
        createdBy: adminUser.id,
      },
    }),
  ])

  // Create sample technicians
  const technicians = await Promise.all([
    prisma.technician.upsert({
      where: { email: 'somchai@repair.com' },
      update: {},
      create: {
        name: 'Somchai Tech',
        email: 'somchai@repair.com',
        phone: '+66 81 111 1111',
        speciality: 'Bitmain Repair',
        hourlyRate: 500,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.technician.upsert({
      where: { email: 'somsri@repair.com' },
      update: {},
      create: {
        name: 'Somsri Engineer',
        email: 'somsri@repair.com',
        phone: '+66 82 222 2222',
        speciality: 'Whatsminer Repair',
        hourlyRate: 450,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.technician.upsert({
      where: { email: 'somkiat@repair.com' },
      update: {},
      create: {
        name: 'Somkiat Specialist',
        email: 'somkiat@repair.com',
        phone: '+66 83 333 3333',
        speciality: 'Avalon Repair',
        hourlyRate: 480,
        isActive: false,
        createdBy: adminUser.id,
      },
    }),
  ])

  // Create sample miner models
  const minerModels = await Promise.all([
    prisma.minerModel.upsert({
      where: { id: 'bitmain-s19' },
      update: {},
      create: {
        id: 'bitmain-s19',
        brand: 'Bitmain',
        model: 'Antminer S19',
        series: 'S19 Series',
        hashRate: '95 TH/s',
        power: '3250W',
        description: 'High-performance Bitcoin mining machine',
        isActive: true,
      },
    }),
    prisma.minerModel.upsert({
      where: { id: 'bitmain-s19-pro' },
      update: {},
      create: {
        id: 'bitmain-s19-pro',
        brand: 'Bitmain',
        model: 'Antminer S19 Pro',
        series: 'S19 Series',
        hashRate: '110 TH/s',
        power: '3250W',
        description: 'Professional Bitcoin mining machine',
        isActive: true,
      },
    }),
    prisma.minerModel.upsert({
      where: { id: 'whatsminer-m30s' },
      update: {},
      create: {
        id: 'whatsminer-m30s',
        brand: 'Whatsminer',
        model: 'M30S',
        series: 'M30 Series',
        hashRate: '88 TH/s',
        power: '3344W',
        description: 'Efficient Bitcoin mining machine',
        isActive: true,
      },
    }),
    prisma.minerModel.upsert({
      where: { id: 'whatsminer-m30s-plus' },
      update: {},
      create: {
        id: 'whatsminer-m30s-plus',
        brand: 'Whatsminer',
        model: 'M30S+',
        series: 'M30 Series',
        hashRate: '100 TH/s',
        power: '3400W',
        description: 'High-efficiency Bitcoin mining machine',
        isActive: true,
      },
    }),
    prisma.minerModel.upsert({
      where: { id: 'avalon-a1166' },
      update: {},
      create: {
        id: 'avalon-a1166',
        brand: 'Avalon',
        model: 'A1166',
        series: 'A11 Series',
        hashRate: '68 TH/s',
        power: '2550W',
        description: 'Reliable Bitcoin mining machine',
        isActive: false,
      },
    }),
    prisma.minerModel.upsert({
      where: { id: 'avalon-a1246' },
      update: {},
      create: {
        id: 'avalon-a1246',
        brand: 'Avalon',
        model: 'A1246',
        series: 'A12 Series',
        hashRate: '90 TH/s',
        power: '3420W',
        description: 'Advanced Bitcoin mining machine',
        isActive: true,
      },
    }),
  ])

  // Create sample work orders
  await Promise.all([
    prisma.workOrder.upsert({
      where: { orderNumber: 'WO-2024-001' },
      update: {},
      create: {
        orderNumber: 'WO-2024-001',
        customerId: customers[0].id,
        technicianId: technicians[0].id,
        minerModelId: minerModels[0].id,
        serialNumber: 'BM001234567',
        issue: 'Power supply failure',
        status: 'PENDING',
        priority: 'HIGH',
        estimatedCost: 5000,
        startDate: new Date('2024-01-15'),
        createdBy: adminUser.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { orderNumber: 'WO-2024-002' },
      update: {},
      create: {
        orderNumber: 'WO-2024-002',
        customerId: customers[1].id,
        technicianId: technicians[1].id,
        minerModelId: minerModels[2].id,
        serialNumber: 'WM987654321',
        issue: 'Fan malfunction',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        estimatedCost: 3000,
        startDate: new Date('2024-01-14'),
        createdBy: adminUser.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { orderNumber: 'WO-2024-003' },
      update: {},
      create: {
        orderNumber: 'WO-2024-003',
        customerId: customers[2].id,
        technicianId: technicians[2].id,
        minerModelId: minerModels[4].id,
        serialNumber: 'AV123456789',
        issue: 'Control board issue',
        status: 'COMPLETED',
        priority: 'URGENT',
        estimatedCost: 8000,
        actualCost: 7500,
        startDate: new Date('2024-01-10'),
        completedDate: new Date('2024-01-13'),
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Admin user created: admin@aprepair.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
