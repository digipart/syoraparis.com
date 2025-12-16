declare const FB: any;

declare class ApplePaySession {
  constructor(version: number, request: any);
  static canMakePayments(): boolean;
  onvalidatemerchant: (event: any) => void;
  onpaymentauthorized: (event: any) => void;
  oncancel: (event: any) => void;
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePayment(status: any): void;
}

interface Window {
  ApplePaySession: typeof ApplePaySession;
}

