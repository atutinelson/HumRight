import "dotenv/config";
export interface StkPushResult {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}
export declare function initiateStkPush(phoneNumber: string, amount: number, accountReference: string, transactionDesc?: string): Promise<StkPushResult>;
//# sourceMappingURL=mpesaService.d.ts.map