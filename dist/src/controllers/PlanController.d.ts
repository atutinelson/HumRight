import type { Request, Response } from "express";
export declare class PlanController {
    static getPlans(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getplanPredictionsToday(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createPlan(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PlanController.d.ts.map