const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'jnanesh@gmail.com';
  
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user) {
    console.error(`User with email ${email} not found!`);
    process.exit(1);
  }

  console.log(`Found user ${user.name || user.email} with ID: ${user.id}`);

  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // 1. Add Budgets
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: 'Food', limit: 400, month: currentMonthStr },
      { userId: user.id, category: 'Transport', limit: 150, month: currentMonthStr },
      { userId: user.id, category: 'Entertainment', limit: 100, month: currentMonthStr },
      { userId: user.id, category: 'Utilities', limit: 200, month: currentMonthStr }
    ]
  });
  console.log('Added sample budgets.');

  // 2. Add Subscriptions
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  await prisma.subscription.createMany({
    data: [
      { userId: user.id, name: 'Netflix', category: 'Entertainment', amount: 15.99, cycle: 'monthly', startDate: new Date('2023-01-01'), nextRenewal: nextWeek, method: 'Credit Card', status: 'active' },
      { userId: user.id, name: 'Spotify', category: 'Entertainment', amount: 9.99, cycle: 'monthly', startDate: new Date('2022-05-10'), nextRenewal: nextMonth, method: 'PayPal', status: 'active' },
      { userId: user.id, name: 'Gym Membership', category: 'Health', amount: 45.00, cycle: 'monthly', startDate: new Date('2024-01-15'), nextRenewal: nextWeek, method: 'Bank Transfer', status: 'active' }
    ]
  });
  console.log('Added sample subscriptions.');

  // 3. Add Transactions (Mix of Incomes and Expenses over the last month)
  const transactions = [];
  
  // Income
  transactions.push({ userId: user.id, title: 'Monthly Salary', amount: 3500, category: 'Salary', type: 'income', method: 'Bank Transfer', date: new Date(today.getFullYear(), today.getMonth(), 1) });
  transactions.push({ userId: user.id, title: 'Web Design Project', amount: 400, category: 'Freelance', type: 'income', method: 'PayPal', date: new Date(today.getFullYear(), today.getMonth(), 15) });

  // Expenses
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
  
  for (let i = 0; i < 15; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(date.getDate() - randomDaysAgo);
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = parseFloat((Math.random() * 80 + 5).toFixed(2)); // random between $5 and $85
    
    transactions.push({
      userId: user.id,
      title: `${category} Expense`,
      amount: amount,
      category: category,
      type: 'expense',
      method: 'Credit Card',
      date: date
    });
  }

  await prisma.transaction.createMany({ data: transactions });
  console.log(`Added ${transactions.length} sample transactions.`);
  
  console.log('Sample data injection complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
