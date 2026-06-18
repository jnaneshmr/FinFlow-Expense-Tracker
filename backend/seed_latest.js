const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ orderBy: { id: 'desc' }, take: 5 });
  console.log('Latest users:');
  users.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}`));
  
  // also inject seed data into the very newest one!
  const user = users[0];
  console.log(`\nInjecting data into newest user: ${user.email} (ID: ${user.id})`);
  
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  try {
    await prisma.budget.createMany({
      data: [
        { userId: user.id, category: 'Food', limit: 400, month: currentMonthStr },
        { userId: user.id, category: 'Transport', limit: 150, month: currentMonthStr },
        { userId: user.id, category: 'Entertainment', limit: 100, month: currentMonthStr },
        { userId: user.id, category: 'Utilities', limit: 200, month: currentMonthStr }
      ]
    });
    console.log('Budgets added.');

    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today); nextMonth.setMonth(today.getMonth() + 1);

    await prisma.subscription.createMany({
      data: [
        { userId: user.id, name: 'Netflix', category: 'Entertainment', amount: 15.99, cycle: 'monthly', startDate: new Date('2023-01-01'), nextRenewal: nextWeek, method: 'Credit Card', status: 'active' },
        { userId: user.id, name: 'Spotify', category: 'Entertainment', amount: 9.99, cycle: 'monthly', startDate: new Date('2022-05-10'), nextRenewal: nextMonth, method: 'PayPal', status: 'active' },
        { userId: user.id, name: 'Gym Membership', category: 'Health', amount: 45.00, cycle: 'monthly', startDate: new Date('2024-01-15'), nextRenewal: nextWeek, method: 'Bank Transfer', status: 'active' }
      ]
    });
    console.log('Subscriptions added.');

    const transactions = [];
    transactions.push({ userId: user.id, title: 'Monthly Salary', amount: 3500, category: 'Salary', type: 'income', method: 'Bank Transfer', date: new Date(today.getFullYear(), today.getMonth(), 1) });
    transactions.push({ userId: user.id, title: 'Web Design Project', amount: 400, category: 'Freelance', type: 'income', method: 'PayPal', date: new Date(today.getFullYear(), today.getMonth(), 15) });

    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
    for (let i = 0; i < 15; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 28);
      const date = new Date(); date.setDate(date.getDate() - randomDaysAgo);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = parseFloat((Math.random() * 80 + 5).toFixed(2));
      transactions.push({ userId: user.id, title: `${category} Expense`, amount: amount, category: category, type: 'expense', method: 'Credit Card', date: date });
    }

    await prisma.transaction.createMany({ data: transactions });
    console.log('Transactions added.');
  } catch (e) {
    console.error('Data might already exist for this user or error:', e.message);
  }

  await prisma.$disconnect();
}
run();
