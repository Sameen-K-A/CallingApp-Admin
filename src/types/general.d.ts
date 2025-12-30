export interface IsidebarItems {
  title: string;
  url: string;
  icon: React.ElementType;
  onClick: () => void;
};

export interface IUserBase {
  _id: string
  phone: string
  name?: string
  role?: 'USER' | 'TELECALLER'
  dob?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  wallet: { balance: number }
  accountStatus: 'ACTIVE' | 'SUSPENDED'
  createdAt: Date
  updatedAt: Date
};

export interface ITelecallerComplaint extends Pick<IReport,
  | "_id"
  | "reportedBy"
  | "description"
  | "status"
  | "createdAt"
> {
  reportedByName: string;
}

export interface ITelecaller extends IUserBase {
  role: 'TELECALLER'
  telecallerProfile: {
    about: string
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    verificationNotes?: string
    presence: 'ONLINE' | 'OFFLINE' | 'ON_CALL'
  }
  walletBalance: number
  complaints: ITelecallerComplaint[]
  totalComplaints: number
};

export interface IUser extends IUserBase {
  role: 'USER'
  favorites: string[]
};

export interface IUserComplaint extends Pick<IReport,
  | "_id"
  | "reportedBy"
  | "description"
  | "status"
  | "createdAt"
> {
  reportedByName: string;
};

export interface IUserDetails extends Pick<IUser,
  | '_id'
  | 'name'
  | 'phone'
  | 'dob'
  | 'gender'
  | 'accountStatus'
  | 'createdAt'
> {
  walletBalance: number;
  complaints: IUserComplaint[];
  totalComplaints: number;
};

export interface ITransaction {
  _id: string;
  user: Pick<IUser, | "name">;
  type: 'RECHARGE' | 'WITHDRAWAL';
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  createdAt: string;
};

export interface ITransaction {
  _id: string;
  user: Pick<IUser, "name">;
  type: "RECHARGE" | "WITHDRAWAL";
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  createdAt: string;
}

export interface ITransactionDetails {
  _id: string;
  type: 'RECHARGE' | 'WITHDRAWAL';
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    phone: string;
    walletBalance: number;
  };
  // For RECHARGE
  coins?: number;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  // For WITHDRAWAL
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  transferReference?: string;
  processedAt?: string;
}

export interface IReport {
  _id: string;
  reportedBy: string;
  reportedAgainst: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reportedByName: string;
  reportedAgainstName: string;
}

export interface ICall {
  _id: string;
  status: 'INITIATED' | 'RINGING' | 'ACCEPTED' | 'REJECTED' | 'MISSED' | 'COMPLETED' | 'CANCELLED';
  initiatedAt: string;
  acceptedAt?: string;
  endedAt?: string;
  durationInSeconds: number;
  coinsSpent: number;
  coinsEarned: number;
  endedBy?: 'USER' | 'TELECALLER' | 'SYSTEM';
  endReason?: 'NORMAL' | 'INSUFFICIENT_BALANCE' | 'USER_HANGUP' | 'TELECALLER_HANGUP' | 'NETWORK_ISSUE' | 'TIMEOUT' | 'REJECTED' | 'MISSED';
  userFeedback?: string;
  telecallerFeedback?: string;
}

export interface IReportDetails {
  _id: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  reporter: Pick<IUser,
    | "_id"
    | "name"
    | "phone"
    | "role"
    | "accountStatus"
  >
  reportedAgainst: Pick<IUser,
    | "_id"
    | "name"
    | "phone"
    | "role"
    | "accountStatus"
  >
  call: ICall
};

export interface IDashboardStats {
  revenue: {
    totalRecharges: number;
    totalWithdrawals: number;
    platformProfit: number;
  };
  users: {
    total: number;
    newThisMonth: number;
    incompleteProfiles: number;
  };
  telecallers: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  calls: {
    total: number;
    totalDurationMinutes: number;
    averageDurationSeconds: number;
  };
};

export interface IPlan {
  _id: string
  amount: number
  coins: number
  discountPercentage: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
};

export interface IRechargeWithdrawalTrend {
  label: string;
  recharge: number;
  withdrawal: number;
}