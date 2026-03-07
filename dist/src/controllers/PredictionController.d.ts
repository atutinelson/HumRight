import type { Request, Response } from "express";
export declare class PredictionController {
    static getPredictionBasedOnDate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createPrediction(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PredictionController.d.ts.map