export type PaymentProvider = 'STRIPE' | 'MEXPAGO' | 'PAYPAL' | 'BANK_TRANSFER' | 'POS';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'noaprobado';

export interface PaymentValidationResult {
  isValid: boolean;
  message?: string;
}

export interface PaymentResponse {
    transactionId: string;
    status: string;
    provider: string;
    metadata: Record<string, any>;
    amount: number;
  currency: string;
}
