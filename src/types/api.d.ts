import type { IDashboardStats, IPlan, ITelecaller, ITransaction, ITransactionDetails, IUser, IUserDetails, IRechargeWithdrawalTrend } from "./general";

interface IListBase {
  total: number;
  totalPages: number;
};

interface IUsersResponse extends IListBase {
  users: IUser[];
};

export interface IUserDetailsResponse {
  success: boolean;
  data: IUserDetails | null;
};

interface ITransactionsResponse extends IListBase {
  transactions: ITransaction[];
};

export interface ITelecallersResponse extends IListBase {
  telecallers: ITelecaller[];
};

export interface ITelecallerDetailsResponse {
  success: boolean;
  data: ITelecaller | null;
};

export interface IReportsResponse extends IListBase {
  reports: IReport[];
};

export interface IDashboardStatsResponse {
  success: boolean;
  data: IDashboardStats;
};

export interface ITransactionDetailsResponse {
  success: boolean;
  data: ITransactionDetails | null;
};

export interface IPlansResponse {
  success: boolean
  plans: IPlan[]
  total: number
  totalPages: number
};

export interface ICreatePlanResponse {
  success: boolean
  message: string
  data: IPlan
};

export interface IUpdatePlanResponse {
  success: boolean
  message: string
  data: IPlan
};

export interface IDeletePlanResponse {
  success: boolean
  message: string
};

// ============================================
// Configuration Types
// ============================================

export interface IConfigField {
  value: number;
  label: string;
  description: string;
}

export interface IConfigData {
  withdrawal: {
    inrToCoinRatio: IConfigField;
    minWithdrawalCoins: IConfigField;
  };
  videoCall: {
    userCoinPerSec: IConfigField;
    telecallerCoinPerSec: IConfigField;
  };
  audioCall: {
    userCoinPerSec: IConfigField;
    telecallerCoinPerSec: IConfigField;
  };
  updatedAt: string;
}

export interface IConfigResponse {
  success: boolean;
  message: string;
  data: IConfigData;
}

export interface IUpdateConfigPayload {
  inrToCoinRatio?: number;
  minWithdrawalCoins?: number;
  userVideoCallCoinPerSec?: number;
  userAudioCallCoinPerSec?: number;
  telecallerVideoCallCoinPerSec?: number;
  telecallerAudioCallCoinPerSec?: number;
}

export interface IUpdateConfigResponse {
  success: boolean;
  message: string;
  data: IConfigData;
}

// ============================================
// Withdrawal Types
// ============================================
export interface ICompleteWithdrawalPayload {
  transferReference: string;
}

export interface ICompleteWithdrawalResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    status: 'SUCCESS';
    transferReference: string;
    processedAt: string;
    coinsDeducted: number;
    newBalance: number;
  };
}

export interface IRejectWithdrawalResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    status: 'REJECTED';
    processedAt: string;
  };
}

// ============================================
// User Distribution Types
// ============================================
export interface IUserDistributionData {
  users: number;
  telecallers: number;
}

export interface IUserDistributionResponse {
  success: boolean;
  data: IUserDistributionData;
}

export interface IRechargeWithdrawalResponse {
  success: boolean;
  data: {
    period: string;
    trends: IRechargeWithdrawalTrend[];
  };
}