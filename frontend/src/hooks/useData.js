// src/hooks/useData.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { transactionService, subscriptionService, budgetService, dashboardService } from '../services/api';
import toast from 'react-hot-toast';

// Helper to generate optimistic update configuration
function getOptimisticConfig(qc, key, operation, successMsg) {
  return {
    onMutate: async (data) => {
      await qc.cancelQueries(key);
      const previous = qc.getQueriesData(key);
      
      qc.setQueriesData(key, (oldData) => {
        if (!oldData) return oldData;
        if (operation === 'create') {
          return [{ id: Date.now(), ...data }, ...oldData];
        }
        if (operation === 'update') {
          return oldData.map(item => item.id === data.id ? { ...item, ...data } : item);
        }
        if (operation === 'remove') {
          return oldData.filter(item => item.id !== data);
        }
        return oldData;
      });
      return { previous };
    },
    onError: (err, data, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, oldData]) => {
          qc.setQueryData(queryKey, oldData);
        });
      }
      toast.error('Failed to save changes');
    },
    onSettled: () => {
      qc.invalidateQueries(key);
      qc.invalidateQueries('dashboard');
    },
    onSuccess: () => {
      if (successMsg) toast.success(successMsg);
    }
  };
}

// 🔵 Transactions 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵
export function useTransactions(params = {}) {
  return useQuery(
    ['transactions', params],
    () => transactionService.getAll(params).then(r => r.data.transactions || []),
    { keepPreviousData: true }
  );
}

export function useTransactionMutations() {
  const qc = useQueryClient();

  const create = useMutation(
    (data) => transactionService.create(data),
    getOptimisticConfig(qc, 'transactions', 'create', 'Transaction added')
  );
  const update = useMutation(
    ({ id, ...data }) => transactionService.update(id, data),
    getOptimisticConfig(qc, 'transactions', 'update', 'Transaction updated')
  );
  const remove = useMutation(
    (id) => transactionService.delete(id),
    getOptimisticConfig(qc, 'transactions', 'remove', 'Transaction deleted')
  );
  return { create, update, remove };
}

// 🔵 Subscriptions 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵
export function useSubscriptions(params = {}) {
  return useQuery(
    ['subscriptions', params],
    () => subscriptionService.getAll(params).then(r => r.data.subscriptions || []),
    { keepPreviousData: true }
  );
}

export function useSubscriptionMutations() {
  const qc = useQueryClient();

  const create = useMutation(
    (data) => subscriptionService.create(data),
    getOptimisticConfig(qc, 'subscriptions', 'create', 'Subscription added')
  );
  const update = useMutation(
    ({ id, ...data }) => subscriptionService.update(id, data),
    getOptimisticConfig(qc, 'subscriptions', 'update', 'Subscription updated')
  );
  const remove = useMutation(
    (id) => subscriptionService.delete(id),
    getOptimisticConfig(qc, 'subscriptions', 'remove', 'Subscription deleted')
  );
  return { create, update, remove };
}

// 🔵 Budgets 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵
export function useBudgets(params = {}) {
  return useQuery(
    ['budgets', params],
    () => budgetService.getAll(params).then(r => r.data.budgets || []),
    { keepPreviousData: true }
  );
}

export function useBudgetMutations() {
  const qc = useQueryClient();

  const create = useMutation(
    (data) => budgetService.create(data),
    getOptimisticConfig(qc, 'budgets', 'create', 'Budget created')
  );
  const update = useMutation(
    ({ id, ...data }) => budgetService.update(id, data),
    getOptimisticConfig(qc, 'budgets', 'update', 'Budget updated')
  );
  const remove = useMutation(
    (id) => budgetService.delete(id),
    getOptimisticConfig(qc, 'budgets', 'remove', 'Budget deleted')
  );
  return { create, update, remove };
}

// 🔵 Dashboard 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵
export function useDashboard() {
  return useQuery(
    'dashboard',
    () => dashboardService.getSummary().then(r => r.data),
    { staleTime: 60_000 }
  );
}
