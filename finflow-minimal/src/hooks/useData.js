// src/hooks/useData.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { transactionService, subscriptionService, budgetService, dashboardService } from '../services/api';
import toast from 'react-hot-toast';

// ── Transactions ──────────────────────────────────────
export function useTransactions(params = {}) {
  return useQuery(
    ['transactions', params],
    () => transactionService.getAll(params).then(r => r.data.transactions || []),
    { keepPreviousData: true }
  );
}

export function useTransactionMutations() {
  const qc = useQueryClient();
  const invalidate = () => { qc.invalidateQueries('transactions'); qc.invalidateQueries('dashboard'); };

  const create = useMutation(
    (data) => transactionService.create(data),
    { onSuccess: () => { toast.success('Transaction added'); invalidate(); } }
  );
  const update = useMutation(
    ({ id, ...data }) => transactionService.update(id, data),
    { onSuccess: () => { toast.success('Transaction updated'); invalidate(); } }
  );
  const remove = useMutation(
    (id) => transactionService.delete(id),
    { onSuccess: () => { toast.success('Transaction deleted'); invalidate(); } }
  );
  return { create, update, remove };
}

// ── Subscriptions ─────────────────────────────────────
export function useSubscriptions(params = {}) {
  return useQuery(
    ['subscriptions', params],
    () => subscriptionService.getAll(params).then(r => r.data.subscriptions || []),
    { keepPreviousData: true }
  );
}

export function useSubscriptionMutations() {
  const qc = useQueryClient();
  const invalidate = () => { qc.invalidateQueries('subscriptions'); qc.invalidateQueries('dashboard'); };

  const create = useMutation(
    (data) => subscriptionService.create(data),
    { onSuccess: () => { toast.success('Subscription added'); invalidate(); } }
  );
  const update = useMutation(
    ({ id, ...data }) => subscriptionService.update(id, data),
    { onSuccess: () => { toast.success('Subscription updated'); invalidate(); } }
  );
  const remove = useMutation(
    (id) => subscriptionService.delete(id),
    { onSuccess: () => { toast.success('Subscription deleted'); invalidate(); } }
  );
  return { create, update, remove };
}

// ── Budgets ───────────────────────────────────────────
export function useBudgets(params = {}) {
  return useQuery(
    ['budgets', params],
    () => budgetService.getAll(params).then(r => r.data.budgets || []),
    { keepPreviousData: true }
  );
}

export function useBudgetMutations() {
  const qc = useQueryClient();
  const invalidate = () => { qc.invalidateQueries('budgets'); };

  const create = useMutation(
    (data) => budgetService.create(data),
    { onSuccess: () => { toast.success('Budget created'); invalidate(); } }
  );
  const update = useMutation(
    ({ id, ...data }) => budgetService.update(id, data),
    { onSuccess: () => { toast.success('Budget updated'); invalidate(); } }
  );
  const remove = useMutation(
    (id) => budgetService.delete(id),
    { onSuccess: () => { toast.success('Budget deleted'); invalidate(); } }
  );
  return { create, update, remove };
}

// ── Dashboard ─────────────────────────────────────────
export function useDashboard() {
  return useQuery(
    'dashboard',
    () => dashboardService.getSummary().then(r => r.data),
    { staleTime: 60_000 }
  );
}
