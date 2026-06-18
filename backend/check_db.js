const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { transactions: true, budgets: true, subscriptions: true }
      }
    }
  });
  console.log('--- ALL USERS ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: '${u.email}' | TXs: ${u._count.transactions} | Budgets: ${u._count.budgets} | Subs: ${u._count.subscriptions}`);
  });
  await prisma.$disconnect();
}
run();
