// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'alex@finflow.app' },
    update: {},
    create: {
      name: 'Alex Morgan',
      email: 'alex@finflow.app',
      password: hashedPassword,
      currency: 'USD',
    },
  });
  console.log(`✅ Created user: ${user.email}`);

  // Transactions
  const transactions = [
    { title: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary', date: new Date('2024-01-01'), method: 'Bank Transfer', notes: 'Regular monthly salary' },
    { title: 'Freelance – Acme Corp', amount: 1800, type: 'income', category: 'Freelance', date: new Date('2024-01-08'), method: 'Bank Transfer', notes: '' },
    { title: 'Whole Foods Groceries', amount: 186, type: 'expense', category: 'Food & Dining', date: new Date('2024-01-03'), method: 'Credit Card', notes: 'Weekly groceries' },
    { title: 'Rent – January', amount: 1400, type: 'expense', category: 'Housing', date: new Date('2024-01-01'), method: 'Bank Transfer', notes: '' },
    { title: 'Gas Station', amount: 62, type: 'expense', category: 'Transportation', date: new Date('2024-01-05'), method: 'Debit Card', notes: '' },
    { title: 'Electric Bill', amount: 88, type: 'expense', category: 'Utilities', date: new Date('2024-01-10'), method: 'Auto-Pay', notes: '' },
    { title: 'Dinner – Date Night', amount: 94, type: 'expense', category: 'Food & Dining', date: new Date('2024-01-12'), method: 'Credit Card', notes: 'Anniversary dinner' },
    { title: 'Amazon – Electronics', amount: 249, type: 'expense', category: 'Shopping', date: new Date('2024-01-14'), method: 'Credit Card', notes: '' },
    { title: 'Gym Membership', amount: 49, type: 'expense', category: 'Fitness', date: new Date('2024-01-15'), method: 'Auto-Pay', notes: '' },
    { title: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary', date: new Date('2024-02-01'), method: 'Bank Transfer', notes: '' },
    { title: 'Rent – February', amount: 1400, type: 'expense', category: 'Housing', date: new Date('2024-02-01'), method: 'Bank Transfer', notes: '' },
    { title: 'Doctor Visit', amount: 120, type: 'expense', category: 'Health', date: new Date('2024-02-06'), method: 'Credit Card', notes: 'Annual checkup' },
    { title: "Groceries – Trader Joe's", amount: 142, type: 'expense', category: 'Food & Dining', date: new Date('2024-02-09'), method: 'Debit Card', notes: '' },
    { title: 'Investment Dividend', amount: 340, type: 'income', category: 'Investment', date: new Date('2024-02-15'), method: 'Bank Transfer', notes: 'Q4 dividend' },
    { title: 'Uber rides', amount: 78, type: 'expense', category: 'Transportation', date: new Date('2024-02-20'), method: 'Credit Card', notes: '' },
    { title: 'Monthly Salary', amount: 5200, type: 'income', category: 'Salary', date: new Date('2024-03-01'), method: 'Bank Transfer', notes: '' },
    { title: 'Freelance – Website redesign', amount: 2400, type: 'income', category: 'Freelance', date: new Date('2024-03-10'), method: 'PayPal', notes: 'Full payment' },
    { title: 'Rent – March', amount: 1400, type: 'expense', category: 'Housing', date: new Date('2024-03-01'), method: 'Bank Transfer', notes: '' },
    { title: 'Groceries', amount: 168, type: 'expense', category: 'Food & Dining', date: new Date('2024-03-05'), method: 'Debit Card', notes: '' },
    { title: 'New Running Shoes', amount: 135, type: 'expense', category: 'Shopping', date: new Date('2024-03-18'), method: 'Credit Card', notes: '' },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: { ...tx, userId: user.id } });
  }
  console.log(`✅ Created ${transactions.length} transactions`);

  // Subscriptions
  const subscriptions = [
    { name: 'Netflix', category: 'Streaming', amount: 15.99, cycle: 'monthly', startDate: new Date('2022-06-01'), nextRenewal: new Date('2024-04-01'), method: 'Credit Card', status: 'active', notes: '4K plan' },
    { name: 'Spotify', category: 'Music', amount: 9.99, cycle: 'monthly', startDate: new Date('2021-01-01'), nextRenewal: new Date('2024-04-05'), method: 'Credit Card', status: 'active', notes: 'Premium Family' },
    { name: 'GitHub Copilot', category: 'Software', amount: 10, cycle: 'monthly', startDate: new Date('2023-03-01'), nextRenewal: new Date('2024-04-01'), method: 'Credit Card', status: 'active', notes: '' },
    { name: 'Adobe Creative Cloud', category: 'Software', amount: 54.99, cycle: 'monthly', startDate: new Date('2022-01-15'), nextRenewal: new Date('2024-04-15'), method: 'Credit Card', status: 'active', notes: 'All apps plan' },
    { name: 'NYT Digital', category: 'News', amount: 4, cycle: 'monthly', startDate: new Date('2023-07-01'), nextRenewal: new Date('2024-04-07'), method: 'Credit Card', status: 'active', notes: '' },
    { name: 'iCloud 2TB', category: 'Cloud', amount: 9.99, cycle: 'monthly', startDate: new Date('2020-11-01'), nextRenewal: new Date('2024-04-10'), method: 'Auto-Pay', status: 'active', notes: '' },
    { name: 'Disney+', category: 'Streaming', amount: 13.99, cycle: 'monthly', startDate: new Date('2023-02-01'), nextRenewal: new Date('2024-04-01'), method: 'Credit Card', status: 'paused', notes: 'Paused during travel' },
    { name: 'Xbox Game Pass', category: 'Gaming', amount: 14.99, cycle: 'monthly', startDate: new Date('2023-05-01'), nextRenewal: new Date('2024-04-08'), method: 'Credit Card', status: 'active', notes: 'Ultimate plan' },
    { name: 'Figma Pro', category: 'Software', amount: 144, cycle: 'yearly', startDate: new Date('2023-06-01'), nextRenewal: new Date('2024-06-01'), method: 'Credit Card', status: 'active', notes: 'Professional plan' },
    { name: 'AWS Services', category: 'Cloud', amount: 28.50, cycle: 'monthly', startDate: new Date('2022-08-01'), nextRenewal: new Date('2024-04-01'), method: 'Bank Transfer', status: 'active', notes: 'EC2 + S3 usage' },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({ data: { ...sub, userId: user.id } });
  }
  console.log(`✅ Created ${subscriptions.length} subscriptions`);

  // Budgets
  const budgets = [
    { category: 'Food & Dining', limit: 400, month: '2024-03' },
    { category: 'Housing', limit: 1500, month: '2024-03' },
    { category: 'Transportation', limit: 200, month: '2024-03' },
    { category: 'Entertainment', limit: 150, month: '2024-03' },
    { category: 'Shopping', limit: 300, month: '2024-03' },
    { category: 'Health', limit: 200, month: '2024-03' },
    { category: 'Utilities', limit: 150, month: '2024-03' },
    { category: 'Fitness', limit: 80, month: '2024-03' },
  ];

  for (const b of budgets) {
    await prisma.budget.create({ data: { ...b, userId: user.id } });
  }
  console.log(`✅ Created ${budgets.length} budgets`);

  // Notifications
  await prisma.notification.createMany({
    data: [
      { title: 'Netflix renews tomorrow', message: 'Your Netflix subscription ($15.99) renews on Apr 1.', type: 'renewal', userId: user.id },
      { title: 'Budget alert: Food & Dining', message: "You've used 85% of your Food & Dining budget this month.", type: 'budget', userId: user.id },
    ],
  });

  console.log('🎉 Seed complete!');
  console.log('   Login: alex@finflow.app / demo1234');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
