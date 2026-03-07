import type { Request, Response } from "express";
export declare class PaymentController {
    static initiate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static callback(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=paymentController.d.ts.map