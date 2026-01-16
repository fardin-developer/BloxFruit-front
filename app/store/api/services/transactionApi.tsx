import { baseApi } from "../baseApi";

export interface Transaction {
    _id: string;
    userId: string;
    orderId: string;
    amount: number;
    paymentNote: string;
    customerName: string;
    customerEmail: string;
    customerNumber: string;
    redirectUrl: string;
    status: string;
    gatewayId: string;
    gatewayType: string;
    gatewayResponse: any;
    udf1: string;
    udf2: string;
    createdAt: string;
    updatedAt: string;
    gatewayOrderId: string;
}

export interface TransactionHistoryResponse {
    success: boolean;
    transactions: Transaction[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalTransactions: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface TransactionHistoryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

// Wallet Ledger Interfaces
export interface WalletLedgerEntry {
    _id: string;
    userId: string;
    transactionType: "credit" | "debit";
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reference: string;
    referenceType: string;
    description: string;
    status: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdByType: string;
    isReversal: boolean;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface WalletLedgerResponse {
    success: boolean;
    data: {
        transactions: WalletLedgerEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface WalletLedgerParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

// Add Balance Interfaces
export interface AddBalanceRequest {
    amount: number;
    redirectUrl: string;
}

export interface AddBalanceResponse {
    success: boolean;
    message: string;
    transaction: {
        _id: string;
        orderId: string;
        amount: number;
        status: string;
        gatewayType: string;
        paymentUrl: string;
        gatewayOrderId: string;
    };
}

export const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactionHistory: builder.query<TransactionHistoryResponse, TransactionHistoryParams>({
            query: (params) => ({
                url: "/transaction/history",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    startDate: params?.startDate,
                    endDate: params?.endDate,
                },
            }),
        }),
        getWalletLedger: builder.query<WalletLedgerResponse, WalletLedgerParams>({
            query: (params) => ({
                url: "/wallet/ledger",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    startDate: params?.startDate,
                    endDate: params?.endDate,
                },
            }),
        }),
        addBalance: builder.mutation<AddBalanceResponse, AddBalanceRequest>({
            query: (data) => ({
                url: "/wallet/add",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetTransactionHistoryQuery, useGetWalletLedgerQuery, useAddBalanceMutation } = transactionApi;
