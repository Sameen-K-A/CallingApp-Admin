import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type {
  IDashboardStatsResponse,
  IReportsResponse,
  ITelecallerDetailsResponse,
  ITelecallersResponse,
  ITransactionDetailsResponse,
  ITransactionsResponse,
  IUserDetailsResponse,
  IUsersResponse,
  IPlansResponse,
  ICreatePlanResponse,
  IUpdatePlanResponse,
  IDeletePlanResponse,
  IConfigResponse,
  IUpdateConfigPayload,
  IUpdateConfigResponse,
  ICompleteWithdrawalPayload,
  ICompleteWithdrawalResponse,
  IRejectWithdrawalResponse
} from '@/types/api';
import type { ITelecaller, ITransaction } from '@/types/general';

export const useUsers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<IUsersResponse>('/admin/users', {
        params: { page, limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  });
};

export const useUserDetails = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get<IUserDetailsResponse>(
        `/admin/users/${userId}`
      );

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch user details.');
    },
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 3 * 60 * 1000,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'block' | 'unblock' }) => {
      const { data } = await apiClient.post(`/admin/users/${userId}/${action}`);
      return data;
    },
    onSuccess: (_, variables) => {
      // Clear caches - Admin will see fresh data
      queryClient.invalidateQueries({ queryKey: ['users'] }); // List cache
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] }); // Single user cache
    },
  });
};

export const useTransactions = (type: ITransaction["type"] = 'RECHARGE', page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['transactions', type, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<ITransactionsResponse>('/admin/transactions', {
        params: { type, page, limit },
      });
      return data;
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useTransactionDetails = (transactionId: string | undefined) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const { data } = await apiClient.get<ITransactionDetailsResponse>(
        `/admin/transactions/${transactionId}`
      );

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch transaction details.');
    },
    enabled: !!transactionId, // Only fetch if transactionId exists
    staleTime: 3 * 60 * 1000,
  });
};

// ============================================
// Withdrawal Management Hooks
// ============================================

export const useCompleteWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, payload }: { transactionId: string; payload: ICompleteWithdrawalPayload }) => {
      const { data } = await apiClient.post<ICompleteWithdrawalResponse>(
        `/admin/withdrawals/${transactionId}/complete`,
        payload
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.transactionId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useRejectWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const { data } = await apiClient.post<IRejectWithdrawalResponse>(
        `/admin/withdrawals/${transactionId}/reject`
      );
      return data;
    },
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useTelecallers = (
  status: ITelecaller["telecallerProfile"]["approvalStatus"] = 'PENDING',
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['telecallers', status, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<ITelecallersResponse>('/admin/telecallers', {
        params: { status, page, limit },
      });
      return data;
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useTelecallerDetails = (telecallerId: string | undefined) => {
  return useQuery({
    queryKey: ['telecaller', telecallerId],
    queryFn: async () => {
      const { data } = await apiClient.get<ITelecallerDetailsResponse>(
        `/admin/telecallers/${telecallerId}`
      );

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch telecaller details.');
    },
    enabled: !!telecallerId, // Only fetch if telecallerId exists
    staleTime: 3 * 60 * 1000,
  });
};

export const useApproveTelecaller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (telecallerId: string) => {
      const { data } = await apiClient.patch(`/admin/telecallers/${telecallerId}/approve`);
      return data;
    },
    onSuccess: (_, telecallerId) => {
      // Clear caches
      queryClient.invalidateQueries({ queryKey: ['telecallers'] }); // All tabs
      queryClient.invalidateQueries({ queryKey: ['telecaller', telecallerId] }); // Single telecaller
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // Dashboard stats
    },
  });
};

export const useRejectTelecaller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ telecallerId, reason }: { telecallerId: string; reason: string }) => {
      const { data } = await apiClient.patch(`/admin/telecallers/${telecallerId}/reject`, { reason });
      return data;
    },
    onSuccess: (_, variables) => {
      // Clear caches
      queryClient.invalidateQueries({ queryKey: ['telecallers'] });
      queryClient.invalidateQueries({ queryKey: ['telecaller', variables.telecallerId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTelecallerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ telecallerId, action }: { telecallerId: string; action: 'block' | 'unblock' }) => {
      const { data } = await apiClient.post(`/admin/users/${telecallerId}/${action}`);
      return data;
    },
    onSuccess: (_, variables) => {
      // Clear caches
      queryClient.invalidateQueries({ queryKey: ['telecallers'] });
      queryClient.invalidateQueries({ queryKey: ['telecaller', variables.telecallerId] });
    },
  });
};

export const useReports = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['reports', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<IReportsResponse>('/admin/reports', {
        params: { page, limit },
      });
      return data;
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<IDashboardStatsResponse>('/admin/dashboard/stats');

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch dashboard statistics');
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// Plans API Hooks
// ============================================
export const usePlans = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['plans', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<IPlansResponse>('/admin/plans', {
        params: { page, limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: { amount: number; coins: number; discountPercentage: number }) => {
      const { data } = await apiClient.post<ICreatePlanResponse>('/admin/plans', planData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, planData }: {
      planId: string;
      planData: { amount?: number; coins?: number; discountPercentage?: number; isActive?: boolean }
    }) => {
      const { data } = await apiClient.put<IUpdatePlanResponse>(`/admin/plans/${planId}`, planData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const { data } = await apiClient.delete<IDeletePlanResponse>(`/admin/plans/${planId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

// ============================================
// Configuration API Hooks
// ============================================

export const useConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data } = await apiClient.get<IConfigResponse>('/admin/config');

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch configuration.');
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (configData: IUpdateConfigPayload) => {
      const { data } = await apiClient.put<IUpdateConfigResponse>('/admin/config', configData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });
};